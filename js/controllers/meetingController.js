/**
 * Controller for active meeting functionality.
 * Handles business logic for meeting timing, speaker tracking, and coordination
 * between the main view and timer popout.
 * @class
 */
class MeetingController {
    /**
     * Initializes the meeting controller with model data and view reference.
     * @param {Meeting} meeting - The meeting model object
     * @param {MeetingView} view - The associated view for UI updates
     * @constructor
     */
    constructor(meeting, view) {
        if (!meeting || typeof meeting !== 'object') {
            throw new Error('Invalid meeting object provided to MeetingController');
        }

        this.meeting = meeting;
        this.view = view;
        this.timer = new SpeakingTimer(meeting);
        this.timerWindow = null;
        this.meeting.active = true;
        StorageManager.saveMeeting(this.meeting);

        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

        this.initEventSubscriptions();

        this.updateVisibleButtons();
    }

    handleBeforeUnload(event) {
        //Warning before closing window
        if (this.meeting.active) {
            event.preventDefault();
            event.returnValue = CONFIG.MESSAGES.CONFIRM.CLOSE_WINDOW;
            return CONFIG.MESSAGES.CONFIRM.CLOSE_WINDOW;
        }
    }

    /**
     * Subscribe to relevant events on the EventBus.
     * Sets up communication channels with other components.
     * @returns {void}
     */
    initEventSubscriptions() {
        // Setup window message listener for communication with popup
        window.addEventListener('message', this.handleTimerWindowMessage.bind(this));
    }
    /**
     * Starts timing for a specified gender.
     * Updates model, timer and UI elements.
     * @param {string} gender - The gender of the current speaker
     * @param {boolean} updateTimerWindow - Whether to sync with timer popup
     * @returns {void}
     */
    startSpeaking(gender, updateTimerWindow = true) {
        this.timer.startTimer(gender);
        this.view.updateButtonStates(gender);

        //Update popout timer
        if (updateTimerWindow && this.timerWindow && !this.timerWindow.closed) {
            try {
                this.timerWindow.postMessage({
                    type: CONFIG.COMMUNICATION.WINDOW.TO_TIMER.SPEAKER_CHANGE,
                    data: { gender: gender }
                }, window.location.origin);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_UPDATE_TIMER_WINDOW, error);
            }
        }
        //Notify other subscribers
        eventBus.publish(CONFIG.COMMUNICATION.ACTIONS.SPEAKER_CHANGE, {
            gender: gender,
            meeting: this.meeting
        });
    }
    /**
     * Pauses the active speaker timer.
     * Updates model, timer and UI elements.
     * @param {boolean} updateTimerWindow - Whether to sync with timer popup
     * @returns {void}
     */
    pauseSpeaking(updateTimerWindow = true) {
        this.timer.stopTimer();
        this.view.updateButtonStates(null);

        // Save current state
        StorageManager.saveMeeting(this.meeting);

        //Update popout timer
        if (updateTimerWindow && this.timerWindow && !this.timerWindow.closed) {
            try {
                this.timerWindow.postMessage({
                    type: CONFIG.COMMUNICATION.WINDOW.TO_TIMER.SPEAKER_PAUSED,
                    data: {}
                }, window.location.origin);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_UPDATE_TIMER_WINDOW, error);
            }
        }
        //Notify other subscribers
        eventBus.publish(CONFIG.COMMUNICATION.ACTIONS.SPEAKER_CHANGE, {
            meeting: this.meeting
        });
    }
    /**
     * Opens a timer popout window and establishes communication.
     * @returns {Window|null} Reference to the opened window or null if blocked
     */
    openTimerWindow() {
        this.timerWindow = window.open(CONFIG.URLS.TIMER_WINDOW, 'MeetingTimer',
            CONFIG.URLS.TIMER_WINDOW_FEATURES);

        if (!this.timerWindow) {
            this.view.showAlert(CONFIG.MESSAGES.ALERT.ERROR_POPOUT_BLOCKED);
            return null;
        }

        this.timerWindow.addEventListener('beforeunload', () => {
            this.timerWindow = null;
        });

        return this.timerWindow;
    }

    initializeTimerWindow() {
        if (this.timerWindow && !this.timerWindow.closed) {

            let currentDuration = 0;
            if (this.timer.currentSpeaker) {
                currentDuration = this.timer.getCurrentDuration() || 0;
            }

            this.timerWindow.postMessage({
                type: CONFIG.COMMUNICATION.WINDOW.TO_TIMER.INIT,
                data: {
                    meetingName: this.meeting.name,
                    visibleButtons: {
                        men: this.meeting.participants[CONFIG.GENDERS.types[0]] > 0,
                        women: this.meeting.participants[CONFIG.GENDERS.types[1]] > 0,
                        nonbinary: this.meeting.participants[CONFIG.GENDERS.types[2]] > 0
                    },

                    currentSpeaker: this.timer.currentSpeaker,
                    elapsedTime: currentDuration
                }
            }, window.location.origin);
        }
    }


    /**
     * Handles messages from the timer popup window.
     * @param {MessageEvent} event - The message event from the popup
     * @returns {void}
     */
    handleTimerWindowMessage(event) {
        //Verify origin for security
        if (event.origin !== window.location.origin) return;

        const { type, data } = event.data;

        switch(type) {
            case CONFIG.COMMUNICATION.WINDOW.TO_MAIN.WINDOW_READY:
                this.initializeTimerWindow();
                break;

            case CONFIG.COMMUNICATION.WINDOW.TO_MAIN.SPEAKER_CHANGE:
                if (data.gender) {
                    this.startSpeaking(data.gender, false);
                }
                break;

            case  CONFIG.COMMUNICATION.WINDOW.TO_MAIN.SPEAKER_PAUSED:
                this.pauseSpeaking(false);
                break;

            case CONFIG.COMMUNICATION.WINDOW.TO_MAIN.MEETING_ENDED:
                this.endMeeting()
                break;

        }
    }

    /**
     * Ends the current meeting and transitions to statistics view.
     * @returns {void}
     */
    endMeeting() {
        this.timer.stopTimer();
        this.meeting.active = false;
        StorageManager.saveMeeting(this.meeting);

        // Close timer window if open
        if (this.timerWindow && !this.timerWindow.closed) {
            this.timerWindow.close();
        }

        eventBus.publish(CONFIG.COMMUNICATION.ACTIONS.MEETING_ENDED, {
            meeting: this.meeting
        });
    }
    /**
     * Updates which gender buttons are visible based on participation.
     * Only show buttons for genders that have participants.
     * @returns {void}
     */
    updateVisibleButtons() {
        // Get participant counts
        const menCount = this.meeting.participants[CONFIG.GENDERS.types[0]];
        const womenCount = this.meeting.participants[CONFIG.GENDERS.types[1]];
        const nonbinaryCount = this.meeting.participants[CONFIG.GENDERS.types[2]];

        // Tell view to update button visibility
        this.view.setButtonVisibility(
            menCount > 0,
            womenCount > 0,
            nonbinaryCount > 0
        );
    }
    /**
     * Cleans up resources when the controller is no longer needed.
     * Removes event listeners and closes any open windows.
     * @returns {void}
     */
    cleanup() {
        // Stop any active timers
        if (this.timer) {
            this.timer.cleanup();
        }

        // Close timer window if open
        if (this.timerWindow && !this.timerWindow.closed) {
            this.timerWindow.close();
            this.timerWindow = null;
        }

        window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        // Remove message listener        window.removeEventListener('message', this.handleTimerWindowMessage);
    }
}