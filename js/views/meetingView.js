/**
 * View controller for the active meeting screen.
 * Manages timer functionality, speaker tracking, and synchronization with popup timer window.
 * Uses configuration from CONFIG to ensure consistency across the application.
 * @class
 */
class MeetingView {
    /**
     * Initializes the meeting view with all necessary DOM elements and event handlers.
     * Sets up timer functionality and popup window communication.
     * @constructor
     */
    constructor() {
        this.menButton = document.getElementById(CONFIG.DOM.BUTTONS.MEN);
        this.womenButton = document.getElementById(CONFIG.DOM.BUTTONS.WOMEN);
        this.nonBinaryButton = document.getElementById(CONFIG.DOM.BUTTONS.NON_BINARY);
        this.pauseButton = document.getElementById(CONFIG.DOM.BUTTONS.PAUSE);
        this.endButton = document.getElementById(CONFIG.DOM.BUTTONS.END_MEETING);
        this.timerDisplay = document.getElementById(CONFIG.DOM.TIMER.DISPLAY);

        // Create pop-out timer button
        this.popOutButton = document.getElementById(CONFIG.DOM.BUTTONS.TIMER_POPUP);
        if (this.popOutButton) {
            this.popOutButton.textContent = CONFIG.TIMER_POPUP.BUTTON_TEXT;
            this.popOutButton.className = CONFIG.TIMER_POPUP.BUTTON_CLASS;
            this.popOutButton.addEventListener('click', () => this.openTimerWindow());
        }

        this.timerDisplay.parentNode.insertBefore(this.popOutButton, this.timerDisplay.nextSibling);

        this.meeting = StorageManager.getCurrentMeeting();
        this.timer = new SpeakingTimer(this.meeting);
        this.timerWindow = null;

        this.initEventListeners();
        this.updateUI();

        window.getCurrentMeeting = () => this.meeting;

        //Set up to receive updates from timer window
        window.updateFromTimerWindow = (action, data) => this.handleTimerWindowUpdate(action, data);
    }

    /**
     * Initializes all event listeners for the meeting view buttons.
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
     * Opens timerWindow.
     * @returns {void}
     */
    openTimerWindow() {
        this.timerWindow = window.open(CONFIG.URLS.TIMER_WINDOW, 'MeetingTimer',
            CONFIG.URLS.TIMER_WINDOW_FEATURES);

        if (!this.timerWindow) {
            alert(CONFIG.MESSAGES.ERROR_POPUP_BLOCKED);
            return;
        }

        //Wait for window to load before comunication
        this.timerWindow.onload = () => {
            if (this.timer.currentSpeaker) {
                this.timerWindow.timerWindow.startSpeaking(this.timer.currentSpeaker);
            }
        };

        //Listener for window closing
        this.timerWindow.addEventListener('beforeunload', () => {
            this.timerWindow = null;
        });

    }
    /**
     * Handels updates from timerWindow.
     * @param {string} action - determines action for update.
     * @param {Object} data - data associated with the action
     * @returns {void}
     */
    handleTimerWindowUpdate(action, data) {
        console.log("Received update from timer window:", action, data);

        switch(action) {
            case 'speakerChange':
                //Update the main UI to match the timer window
                this.startSpeaking(data.gender, false); //false means don't update the timer window
                break;

            case 'speakerPaused':
                //Update the main UI
                this.pauseSpeaking(false);
                break;

            case 'meetingEnded':
                //Update our meeting object and navigate to stats
                if (data.meeting) {
                    this.meeting = data.meeting;
                    StorageManager.saveMeeting(this.meeting);
                    App.navigateTo(CONFIG.DOM.SCREENS.STATS);
                }
                break;
            default:
                console.error(CONFIG.MESSAGES.ERROR_TIMER_COMMUNICATION);
        }
    }
    /**
     * Starts the timer for the specified gender and updates UI accordingly.
     * Optionally synchronizes the timer window if it's open.
     * @param {string} gender - The gender of the current speaker (from CONFIG.GENDERS.types)
     * @param {boolean} updateTimerWindow - Whether to update the timer popup window
     * @returns {void}
     */
    startSpeaking(gender, updateTimerWindow = true) {
        this.timer.startTimer(gender);
        this.updateButtonStates(gender);

        //Also update the timer window if it's open
        if (updateTimerWindow && this.timerWindow && !this.timerWindow.closed) {
            try {
                this.timerWindow.timerWindow.startSpeaking(gender);
            } catch (error) {
                console.error("Error updating timer window:", error);
            }
        }
    }
    /**
     * Pauses the timer and updates UI accordingly.
     * Optionally synchronizes the timer window if it's open.
     * @param {boolean} updateTimerWindow - Whether to update the timer popup window
     * @returns {void}
     */
    pauseSpeaking(updateTimerWindow = true) {
        this.timer.stopTimer();
        this.updateButtonStates(null);

        // Also update the timer window if it's open
        if (updateTimerWindow && this.timerWindow && !this.timerWindow.closed) {
            try {
                this.timerWindow.timerWindow.pauseSpeaking();
            } catch (error) {
                console.error("Error updating timer window:", error);
            }
        }
    }
    /**
     * Ends the current meeting, saves data, and navigates to statistics screen.
     * @returns {void}
     */
    endMeeting() {
        this.timer.stopTimer();
        StorageManager.saveMeeting(this.meeting);
        App.navigateTo(CONFIG.DOM.SCREENS.STATS);
    }
    /**
     * Updates the visual state of speaker buttons based on which gender is currently active.
     * @param {string|null} activeGender - The currently active gender, or null if no one is speaking
     * @returns {void}
     */
    updateButtonStates(activeGender) {
        //Remove active class from all buttons
        if (this.menButton) this.menButton.classList.remove(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        if (this.womenButton) this.womenButton.classList.remove(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        if (this.nonBinaryButton) this.nonBinaryButton.classList.remove(CONFIG.THEME.CSS_CLASSES.ACTIVE);

        //Add active class to the button for the currently speaking gender
        if (activeGender === CONFIG.GENDERS.types[0] && this.menButton) {
            this.menButton.classList.add(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        } else if (activeGender === CONFIG.GENDERS.types[1] && this.womenButton) {
            this.womenButton.classList.add(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        } else if (activeGender === CONFIG.GENDERS.types[2] && this.nonBinaryButton) {
            this.nonBinaryButton.classList.add(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        }
    }
    /**
     * Updates the user interface with current meeting data.
     * @returns {void}
     */
    updateUI() {
        if (this.meeting && this.meeting.name) {
            document.getElementById('meeting-title').textContent = this.meeting.name;
        }
    }
}