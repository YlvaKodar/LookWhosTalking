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

        this.wakeLockSupported = typeof NoSleep !== 'undefined';
        this.noSleep = null;
        this.wakeLockActive = false;

        if (this.wakeLockSupported) {
            try {
                this.noSleep = new NoSleep();
                console.log('Wake lock support detected in popup timer');
            } catch (error) {
                console.log('Wake lock initialization failed in popup:', error);
                this.wakeLockSupported = false;
            }
        }

        this.setupWindowCommunication();
    }

    /**
     * Sets up window messaging to communicate with the main window.
     * @returns {void}
     */
    setupWindowCommunication() {
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
                        this.view.updateMeetingName(data.meetingName);
                    }
                    if (data.visibleButtons) {
                        this.view.setButtonVisibility(
                            data.visibleButtons.women,
                            data.visibleButtons.nonbinary,
                            data.visibleButtons.men,
                        );
                    }

                    if (data.currentSpeaker && data.elapsedTime > 0) {
                        this.startSpeakingWithOffset(data.currentSpeaker, data.elapsedTime);
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

    startSpeakingWithOffset(gender, elapsedSeconds) {
        this.currentSpeaker = gender;
        this.startTime = Date.now() - (elapsedSeconds * 1000); // Subtract elapsed milliseconds
        this.interval = setInterval(() => this.updateTimer(), CONFIG.TIMER.UPDATE_INTERVAL);

        this.view.updateButtonStates(gender);

        this.updateTimer();
    }

    /**
     * Starts timing for a specified gender.
     * Updates UI and notifies main window.
     * @param {string} gender - The gender of the current speaker
     * @param {boolean} notifyMainWindow - Whether to notify the main window
     * @returns {void}
     */
    startSpeaking(gender, notifyMainWindow = true) {

        if (this.interval) {
            this.pauseSpeaking(false);
        }

        if (!this.wakeLockActive && this.wakeLockSupported && this.noSleep) {
            try {
                this.noSleep.enable();
                this.wakeLockActive = true;
                console.log('✅ Wake lock activated in popup timer');
            } catch (error) {
                console.log('❌ Wake lock activation failed in popup (not critical):', error);
            }
        }

        this.currentSpeaker = gender;
        this.startTime = Date.now();
        this.interval = setInterval(() => this.updateTimer(), CONFIG.TIMER.UPDATE_INTERVAL);

        this.view.updateButtonStates(gender);

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

        clearInterval(this.interval);
        this.interval = null;
        this.startTime = null;
        this.currentSpeaker = null;

        this.view.updateButtonStates(null);
        this.view.updateTimerDisplay(CONFIG.TIMER.DEFAULT_DISPLAY);

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
        if (this.interval) {
            this.pauseSpeaking(true);
        }

        //This a good place ..?
        this.cleanup();

        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: CONFIG.COMMUNICATION.WINDOW.TO_MAIN.MEETING_ENDED,
                    data: {}
                }, window.location.origin);

            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_END_MEETING, error);
            }
        }
    }

    /**
     * Cleans up resources when the controller is no longer needed.
     * @returns {void}
     */
    cleanup() {

        if (this.noSleep && this.wakeLockActive && this.wakeLockSupported) {
            try {
                this.noSleep.disable();
                this.wakeLockActive = false;
                console.log('✅ Wake lock deactivated in popup timer');
            } catch (error) {
                console.log('❌ Error deactivating wake lock in popup (not critical):', error);
            }
        }

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}