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


        this.wakeLockSupported = typeof NoSleep !== 'undefined';
        this.noSleep = null;
        this.wakeLockActive = false;

        if (this.wakeLockSupported) {
            try {
                this.noSleep = new NoSleep();
                console.log('Wake lock support detected');
            } catch (error) {
                console.log('Wake lock initialization failed:', error);
                this.wakeLockSupported = false;
            }
        } else {
            console.log('NoSleep.js not loaded - app will work normally without wake lock');
        }


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
        if (!this.wakeLockActive) {
            this.activateWakeLock();
        }

        this.timer.startTimer(gender);
        this.view.updateButtonStates(gender);

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
        this.deactivateWakeLock();

        this.timer.stopTimer();
        this.view.updateButtonStates(null);

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
                        women: this.meeting.participants[CONFIG.GENDERS.types[0]] > 0,
                        nonbinary: this.meeting.participants[CONFIG.GENDERS.types[1]] > 0,
                        men: this.meeting.participants[CONFIG.GENDERS.types[2]] > 0
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
                App.navigateTo(CONFIG.DOM.SCREENS.STATS);
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
        const womenCount = this.meeting.participants[CONFIG.GENDERS.types[0]];
        const nonbinaryCount = this.meeting.participants[CONFIG.GENDERS.types[1]];
        const menCount = this.meeting.participants[CONFIG.GENDERS.types[2]];

        this.view.setButtonVisibility(
            womenCount > 0,
            nonbinaryCount > 0,
            menCount > 0,
        );
    }

    /**
     * Activates wake lock with error handling
     * @returns {void}
     */
    activateWakeLock() {
        if (!this.wakeLockSupported || !this.noSleep || this.wakeLockActive) {
            return;
        }

        try {
            this.noSleep.enable();
            this.wakeLockActive = true;
            console.log('✅ Wake lock activated - screen will stay awake');

        } catch (error) {
            console.log('❌ Wake lock activation failed (not critical):', error);
        }
    }

    /**
     * inactivates wake lock safly
     * @returns {void}
     */
    deactivateWakeLock() {
        if (!this.wakeLockSupported || !this.noSleep || !this.wakeLockActive) {
            return;
        }

        try {
            this.noSleep.disable();
            this.wakeLockActive = false;
            console.log('✅ Wake lock deactivated - normal screen timeout resumed');
        } catch (error) {
            console.log('❌ Wake lock deactivation failed (not critical):', error);
        }
    }

    /**
     * Cleans up resources when the controller is no longer needed.
     * Removes event listeners and closes any open windows.
     * @returns {void}
     */
    cleanup() {
        this.deactivateWakeLock();

        if (this.timer) {
            this.timer.cleanup();
        }

        if (this.timerWindow && !this.timerWindow.closed) {
            this.timerWindow.close();
            this.timerWindow = null;
        }
        window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }
}