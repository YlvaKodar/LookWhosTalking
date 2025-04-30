/**
 * Timer window view:
 * Initializes timer window and syncs between timerView and meetingView
 */

class TimerWindow {
    /**
     * Initializes timer view elements.
     */
    constructor() {
        this.menButton = document.getElementById(CONFIG.DOM.BUTTONS.MEN);
        this.womenButton = document.getElementById(CONFIG.DOM.BUTTONS.WOMEN);
        this.nonBinaryButton = document.getElementById(CONFIG.DOM.BUTTONS.NON_BINARY);
        this.pauseButton = document.getElementById(CONFIG.DOM.BUTTONS.PAUSE);
        this.endButton = document.getElementById(CONFIG.DOM.BUTTONS.END);
        this.timerDisplay = document.getElementById(CONFIG.DOM.TIMER.DISPLAY);
        this.meetingInfo = document.getElementById('meeting-info');

        //Meeting and timer state
        this.meeting = null;
        this.startTime = null;
        this.currentSpeaker = null;
        this.interval = null;

        //Initialize from localStorage or opener window
        this.loadMeetingData();

        //Set up event listeners
        this.initEventListeners();

        //Set up communication channel
        this.setupCommunication();
    }
    /**
     * Loads meeting data from opener window or local storage.
     * If that fails, creates new meeting object.
     * @returns {void}
     */
    loadMeetingData() {
        //Try to get meeting data from the opener window
        if (window.opener && !window.opener.closed) {
            try {
                //This assumes the opener window has a global meeting object
                const openerMeeting = window.opener.getCurrentMeeting();
                if (openerMeeting) {
                    this.meeting = openerMeeting;
                    this.updateMeetingInfo();
                    return;
                }
            } catch (error) {
                console.error("Error accessing opener window:", error);
            }
        }
        //Fallback to localStorage
        try {
            const savedMeeting = localStorage.getItem('currentMeeting');
            if (savedMeeting) {
                this.meeting = JSON.parse(savedMeeting);
                this.updateMeetingInfo();
                return;
            }
        } catch (error) {
            console.error("Error loading from localStorage:", error);
        }
        //If all else fails, create a basic meeting object
        this.meeting = {
            name: "Unnamed Meeting",
            date: new Date().toISOString().split('T')[0],
            participants: { men: 0, women: 0, nonBinary: 0 },
            speakingData: { men: [], women: [], nonBinary: [] },
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
            const total = this.meeting.participants.men +
                this.meeting.participants.women +
                this.meeting.participants.nonBinary;

            this.meetingInfo.textContent = `${this.meeting.name} | ${total} participants`;
        }
    }
    /**
     * Sets up listeners for buttons.
     * @returns {void}
     */
    initEventListeners() {
        this.menButton.addEventListener('click', () => this.startSpeaking(CONFIG.GENDERS.labels.men));
        this.womenButton.addEventListener('click', () => this.startSpeaking(CONFIG.GENDERS.labels.women));
        this.nonBinaryButton.addEventListener('click', () => this.startSpeaking(CONFIG.GENDERS.labels.nonbinary));
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
            if (event.key === 'currentMeeting') {
                try {
                    this.meeting = JSON.parse(event.newValue);
                    this.updateMeetingInfo();
                } catch (error) {
                    console.error("Error parsing meeting data:", error);
                }
            }
        });

        //Periodic save of data back to localStorage
        setInterval(() => this.saveData(), 1000);
    }
    /**
     * Starts timer for current speaker.
     * Updates UI.
     * @param {string} gender -
     * @returns {void}
     */
    startSpeaking(gender) {
        //Stop any current speaker
        if (this.interval) {
            this.pauseSpeaking();
        }

        //Start timing for the new speaker
        this.currentSpeaker = gender;
        this.startTime = Date.now();
        this.interval = setInterval(() => this.updateTimer(), 100);

        //Update the UI
        this.updateButtonStates();

        //Notify main window if open
        this.notifyMainWindow('speakerChange', { gender });
    }
    /**
     * Pauses all timers and resets timer state.
     * Saves data to meeting data.
     * @returns {void}
     */
    pauseSpeaking() {
        if (!this.startTime || !this.currentSpeaker) return;

        const duration = (Date.now() - this.startTime) / 1000; // in seconds

        //Add to meeting data
        if (!this.meeting.speakingData[this.currentSpeaker]) {
            this.meeting.speakingData[this.currentSpeaker] = [];
        }
        this.meeting.speakingData[this.currentSpeaker].push(duration);

        //Reset timer state
        clearInterval(this.interval);
        this.interval = null;
        this.startTime = null;
        this.currentSpeaker = null;

        //Update UI
        this.updateButtonStates();
        this.timerDisplay.textContent = "00:00";

        //Save and notify
        this.saveData();
        this.notifyMainWindow('speakerPaused', { duration });
    }
    /**
     * Updates timer.
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
        this.menButton.classList.remove('active');
        this.womenButton.classList.remove('active');
        this.nonBinaryButton.classList.remove('active');

        if (this.currentSpeaker === CONFIG.GENDERS.labels.men) {
            this.menButton.classList.add('active');
        } else if (this.currentSpeaker === CONFIG.GENDERS.labels.women) {
            this.womenButton.classList.add('active');
        } else if (this.currentSpeaker === CONFIG.GENDERS.labels.nonbinary) {
            this.nonBinaryButton.classList.add('active');
        }
    }
    /**
     * Saves data to local storage.
     * @returns {void}
     */
    saveData() {
        localStorage.setItem('currentMeeting', JSON.stringify(this.meeting));
    }
    /**
     * Updates main window with current data.
     * @returns {void}
     */
    notifyMainWindow(action, data) {
        //If main window is open, call its update method
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.updateFromTimerWindow(action, {
                    ...data,
                    meeting: this.meeting
                });
            } catch (error) {
                console.error("Error notifying main window:", error);
            }
        }
    }
    /**
     * Updates main window with current data.
     * @returns {void}
     */
    endMeeting() {
        //First pause any ongoing speaking
        if (this.interval) {
            this.pauseSpeaking();
        }

        //Mark meeting as complete
        localStorage.setItem('completedMeeting', JSON.stringify(this.meeting));

        //Notify main window if open
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.updateFromTimerWindow('meetingEnded', {
                    meeting: this.meeting
                });

                //Only close if main window acknowledged the end
                window.close();
            } catch (error) {
                console.error("Error ending meeting:", error);
                alert("Meeting completed! Please open the main application to view statistics.");
            }
        } else {
            alert("Meeting completed! Please open the main application to view statistics.");
        }
    }
}

//Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.timerWindow = new TimerWindow();
});