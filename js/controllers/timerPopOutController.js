/**
 * Controller for the timer popout window.
 * Handles communication with the main window and local timing.
 * Does NOT maintain its own meeting data - relies on main window.
 * @class
 */
class TimerPopOutController {
    /**
     * Initializes the timer popout controller with a view reference.
     * @param {TimerPopOutView} view - The associated view for UI updates
     * @constructor
     */
    constructor(view) {
        this.view = view;
        this.startTime = null;
        this.interval = null;
        this.currentSpeaker = null;

        // Setup messaging with parent window
        this.setupWindowCommunication();
    }

    /**
     * Sets up window messaging to communicate with the main window.
     * @returns {void}
     */
    setupWindowCommunication() {
        // Listen for messages from main window
        window.addEventListener('message', this.handleMainWindowMessage.bind(this));
    }

    /**
     * Handle messages received from the main window.
     * @param {MessageEvent} event - The message event
     * @returns {void}
     */
    handleMainWindowMessage(event) {
        if (event.origin !== window.location.origin) return;
        const {type, data} = event.data;
        try{
            switch (type) {
                case CONFIG.COMMUNICATION.WINDOW.TO_TIMER.INIT:
                    if (data.meetingName) {
                        this.view.updateMeetingInfo(data.meetingName);
                    }
                    if (data.visibleButtons) {
                        this.view.setButtonVisibility(
                            data.visibleButtons.men,
                            data.visibleButtons.women,
                            data.visibleButtons.nonbinary
                        );
                    }
                    break;

                case CONFIG.COMMUNICATION.WINDOW.TO_TIMER.SPEAKER_CHANGE:
                    if (data.gender) {
                        this.startSpeaking(data.gender, false);
                    }
                    break;

                case CONFIG.COMMUNICATION.WINDOW.TO_TIMER.SPEAKER_PAUSED:
                    this.pauseSpeaking(false);
                    break;

                default:
                    console.warn(CONFIG.MESSAGES.CONSOLE.ERROR_UNKNOWN_TYPE, type);
            }
        } catch (error) {
            console.error(CONFIG.MESSAGES.CONSOLE.ERROR_POST_MESSAGE, error);
        }
    }

    /**
     * Starts timing for a specified gender.
     * Updates UI and notifies main window.
     * @param {string} gender - The gender of the current speaker
     * @param {boolean} notifyMainWindow - Whether to notify the main window
     * @returns {void}
     */
    startSpeaking(gender, notifyMainWindow = true) {
        //Stop any current timing
        if (this.interval) {
            this.pauseSpeaking(false);
        }
        //Start new timing
        this.currentSpeaker = gender;
        this.startTime = Date.now();
        this.interval = setInterval(() => this.updateTimer(), CONFIG.TIMER.UPDATE_INTERVAL);

        //Update button states in view
        this.view.updateButtonStates(gender);

        //Notify main window if requested
        if (notifyMainWindow && window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: CONFIG.COMMUNICATION.WINDOW.TO_MAIN.SPEAKER_CHANGE,
                    data: { gender: gender }
                }, window.location.origin);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_NOTIFY_MAIN, error);
            }
        }
    }

    /**
     * Pauses the active speaker timer.
     * Updates UI and notifies main window.
     * @param {boolean} notifyMainWindow - Whether to notify the main window
     * @returns {void}
     */
    pauseSpeaking(notifyMainWindow = true) {
        if (!this.startTime || !this.currentSpeaker) return;

        // Calculate duration
        const duration = (Date.now() - this.startTime) / 1000;

        // Reset timer state
        clearInterval(this.interval);
        this.interval = null;
        this.startTime = null;
        this.currentSpeaker = null;

        // Update UI
        this.view.updateButtonStates(null);
        this.view.updateTimerDisplay(CONFIG.TIMER.DEFAULT_DISPLAY);

        // Notify main window if requested
        if (notifyMainWindow && window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: CONFIG.COMMUNICATION.WINDOW.TO_MAIN.SPEAKER_PAUSED,
                    data: {}
                }, window.location.origin);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_NOTIFY_MAIN, error);
            }
        }
    }

    /**
     * Updates the timer display with the current elapsed time.
     * @returns {void}
     */
    updateTimer() {
        if (!this.startTime) return;

        const elapsed = (Date.now() - this.startTime) / 1000;
        const mins = Math.floor(elapsed / 60);
        const secs = Math.floor(elapsed % 60);

        const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        this.view.updateTimerDisplay(formattedTime);
    }

    /**
     * Ends the meeting and closes the timer window.
     * @returns {void}
     */
    endMeeting() {
        // First pause any ongoing speaking
        if (this.interval) {
            this.pauseSpeaking(true);  // Notify main window
        }

        // Notify main window if open
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: CONFIG.COMMUNICATION.WINDOW.TO_MAIN.MEETING_ENDED,
                    data: {}
                }, window.location.origin);

                // Wait a moment before closing to ensure message is sent
                setTimeout(() => window.close(), 100);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_END_MEETING, error);
                alert(CONFIG.MESSAGES.ALERT.MEETING_COMPLETED);
            }
        } else {
            alert(CONFIG.MESSAGES.ALERT.MEETING_COMPLETED);
        }
    }

    /**
     * Cleans up resources when the controller is no longer needed.
     * @returns {void}
     */
    cleanup() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}