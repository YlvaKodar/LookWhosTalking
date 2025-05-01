/**
 * Timer window view:
 * Initializes timer window and syncs between timerView and meetingView
 */

class TimerWindow {
    /**
     * Initializes timer view elements.
     */
    constructor() {
        // Get references to DOM elements using CONFIG
        this.menButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_MEN);
        this.womenButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_WOMEN);
        this.nonBinaryButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_NON_BINARY);
        this.pauseButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_PAUSE);
        this.endButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_END);
        this.timerDisplay = document.getElementById(CONFIG.DOM.TIMER.POPUP_DISPLAY);
        this.meetingInfo = document.getElementById(CONFIG.TIMER_POPUP.DOM.MEETING_INFO);

        // Meeting and timer state
        this.meeting = null;
        this.startTime = null;
        this.currentSpeaker = null;
        this.interval = null;

        // Initialize from localStorage or opener window
        this.loadMeetingData();

        // Set up event listeners
        this.initEventListeners();

        // Set up communication channel
        this.setupCommunication();
    }
    /**
     * Loads meeting data from opener window or local storage.
     * If that fails, creates new meeting object.
     * @returns {void}
     */
    loadMeetingData() {
        // Try to get meeting data from the opener window
        if (window.opener && !window.opener.closed) {
            try {
                // This assumes the opener window has a global meeting object
                const openerMeeting = window.opener.getCurrentMeeting();
                if (openerMeeting) {
                    this.meeting = openerMeeting;
                    this.updateMeetingInfo();
                    return;
                }
            } catch (error) {
                console.error(CONFIG.CONSOLE_MESSAGES.ERROR_OPENER_ACCESS, error);
            }
        }
        // Fallback to localStorage
        try {
            const savedMeeting = localStorage.getItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING);
            if (savedMeeting) {
                this.meeting = JSON.parse(savedMeeting);
                this.updateMeetingInfo();
                return;
            }
        } catch (error) {
            console.error(CONFIG.CONSOLE_MESSAGES.ERROR_LOCALSTORAGE, error);
        }
        // If all else fails, create a basic meeting object
        this.meeting = {
            name: CONFIG.DEFAULTS.MEETING_NAME,
            date: new Date().toISOString().split('T')[0],
            participants: {
                [CONFIG.GENDERS.types[0]]: 0,
                [CONFIG.GENDERS.types[1]]: 0,
                [CONFIG.GENDERS.types[2]]: 0
            },
            speakingData: {
                [CONFIG.GENDERS.types[0]]: [],
                [CONFIG.GENDERS.types[1]]: [],
                [CONFIG.GENDERS.types[2]]: []
            },
            currentSpeaker: null
        };

        this.updateMeetingInfo();
    }
    /**
     * Updates meeting participation info.
     * @returns {void}
     */
    updateMeetingInfo() {
        if (this.meeting) {
            const total = this.meeting.participants[CONFIG.GENDERS.types[0]] +
                this.meeting.participants[CONFIG.GENDERS.types[1]] +
                this.meeting.participants[CONFIG.GENDERS.types[2]];

            this.meetingInfo.textContent = `${this.meeting.name} | ${total} ${CONFIG.LABELS.PARTICIPANTS}`;
        }
    }
    /**
     * Sets up listeners for buttons.
     * @returns {void}
     */
    initEventListeners() {
        this.menButton.addEventListener('click', () => this.startSpeaking(CONFIG.GENDERS.types[0]));
        this.womenButton.addEventListener('click', () => this.startSpeaking(CONFIG.GENDERS.types[1]));
        this.nonBinaryButton.addEventListener('click', () => this.startSpeaking(CONFIG.GENDERS.types[2]));
        this.pauseButton.addEventListener('click', () => this.pauseSpeaking());
        this.endButton.addEventListener('click', () => this.endMeeting());
    }
    /**
     * Storage event listener to receive updates from main window.
     * Periodically saves data back to storage.
     * @returns {void}
     */
    setupCommunication() {
        window.addEventListener('storage', (event) => {
            if (event.key === CONFIG.STORAGE.KEYS.CURRENT_MEETING) {
                try {
                    this.meeting = JSON.parse(event.newValue);
                    this.updateMeetingInfo();
                } catch (error) {
                    console.error(CONFIG.CONSOLE_MESSAGES.ERROR_PARSE_MEETING, error);
                }
            }
        });

        // Periodic save of data back to localStorage
        setInterval(() => this.saveData(), CONFIG.TIMER.SAVE_INTERVAL);
    }
    /**
     * Starts timer for current speaker.
     * Updates UI.
     * @param {string} gender - The gender of the current speaker
     * @returns {void}
     */
    startSpeaking(gender) {
        // Stop any current speaker
        if (this.interval) {
            this.pauseSpeaking();
        }

        // Start timing for the new speaker
        this.currentSpeaker = gender;
        this.startTime = Date.now();
        this.interval = setInterval(() => this.updateTimer(), CONFIG.TIMER.UPDATE_INTERVAL);

        // Update the UI
        this.updateButtonStates();

        // Notify main window if open
        this.notifyMainWindow(CONFIG.COMMUNICATION.ACTIONS.SPEAKER_CHANGE, { gender });
    }
    /**
     * Pauses all timers and resets timer state.
     * Saves data to meeting data.
     * @returns {void}
     */
    pauseSpeaking() {
        if (!this.startTime || !this.currentSpeaker) return;

        const duration = (Date.now() - this.startTime) / 1000; // in seconds

        // Add to meeting data
        if (!this.meeting.speakingData[this.currentSpeaker]) {
            this.meeting.speakingData[this.currentSpeaker] = [];
        }
        this.meeting.speakingData[this.currentSpeaker].push(duration);

        // Reset timer state
        clearInterval(this.interval);
        this.interval = null;
        this.startTime = null;
        this.currentSpeaker = null;

        // Update UI
        this.updateButtonStates();
        this.timerDisplay.textContent = CONFIG.TIMER.DEFAULT_DISPLAY;

        // Save and notify
        this.saveData();
        this.notifyMainWindow(CONFIG.COMMUNICATION.ACTIONS.SPEAKER_PAUSED, { duration });
    }
    /**
     * Updates timer.
     * @returns {void}
     */
    /**
     * Updates timer display based on elapsed time.
     * @returns {void}
     */
    updateTimer() {
        if (!this.startTime) return;

        const elapsed = (Date.now() - this.startTime) / 1000;
        const mins = Math.floor(elapsed / 60);
        const secs = Math.floor(elapsed % 60);

        this.timerDisplay.textContent =
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    /**
     * Sets button state (active /passive)
     * @returns {void}
     */
    updateButtonStates() {
        this.menButton.classList.remove(CONFIG.CSS_CLASSES.ACTIVE);
        this.womenButton.classList.remove(CONFIG.CSS_CLASSES.ACTIVE);
        this.nonBinaryButton.classList.remove(CONFIG.CSS_CLASSES.ACTIVE);

        if (this.currentSpeaker === CONFIG.GENDERS.types[0]) {
            this.menButton.classList.add(CONFIG.CSS_CLASSES.ACTIVE);
        } else if (this.currentSpeaker === CONFIG.GENDERS.types[1]) {
            this.womenButton.classList.add(CONFIG.CSS_CLASSES.ACTIVE);
        } else if (this.currentSpeaker === CONFIG.GENDERS.types[2]) {
            this.nonBinaryButton.classList.add(CONFIG.CSS_CLASSES.ACTIVE);
        }
    }
    /**
     * Saves meeting data to local storage.
     * @returns {void}
     */
    saveData() {
        localStorage.setItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING, JSON.stringify(this.meeting));
    }
    /**
     * Updates main window with current data.
     * @returns {void}
     */
    /**
     * Notifies main window of actions and data changes.
     * @param {string} action - The action type to notify about
     * @param {Object} data - Additional data to send with the notification
     * @returns {void}
     */
    notifyMainWindow(action, data) {
        // If main window is open, call its update method
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.updateFromTimerWindow(action, {
                    ...data,
                    meeting: this.meeting
                });
            } catch (error) {
                console.error(CONFIG.MESSAGES.ERROR_NOTIFY_MAIN, error);
            }
        }
    }
    /**
     * Ends the meeting and sends data to main window.
     * @returns {void}
     */
    endMeeting() {
        // First pause any ongoing speaking
        if (this.interval) {
            this.pauseSpeaking();
        }

        // Mark meeting as complete
        localStorage.setItem(CONFIG.STORAGE.KEYS.COMPLETED_MEETING, JSON.stringify(this.meeting));

        // Notify main window if open
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.updateFromTimerWindow(CONFIG.COMMUNICATION.ACTIONS.MEETING_ENDED, {
                    meeting: this.meeting
                });

                // Only close if main window acknowledged the end
                window.close();
            } catch (error) {
                console.error(CONFIG.CONSOLE_MESSAGES.ERROR_END_MEETING, error);
            }
        alert(CONFIG.MESSAGES.ALERT_MEETING_COMPLETED);
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.timerWindow = new TimerWindow();
});