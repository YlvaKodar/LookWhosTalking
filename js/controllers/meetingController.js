/**
 * Controller for active meeting functionality.
 * Handles business logic for meeting timing, speaker tracking, and coordination
 * between the main view and timer popup.
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

        this.initEventSubscriptions();

        this.updateVisibleButtons();
    }

    /**
     * Subscribe to relevant events on the EventBus.
     * Sets up communication channels with other components.
     * @returns {void}
     */
    initEventSubscriptions() {
        //Listen for timer window events
        eventBus.subscribe('timerWindow.speakerChange', (data) => {
            this.startSpeaking(data.gender, false); // false = don't update timer window
        });

        eventBus.subscribe('timerWindow.speakerPaused', () => {
            this.pauseSpeaking(false); // false = don't update timer window
        });

        eventBus.subscribe('timerWindow.meetingEnded', (data) => {
            if (data.meeting) {
                this.meeting = data.meeting;
                StorageManager.saveMeeting(this.meeting);
                App.navigateTo(CONFIG.DOM.SCREENS.STATS);
            }
        });
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

        // Update timer window if open and if requested
        if (updateTimerWindow && this.timerWindow && !this.timerWindow.closed) {
            try {
                // Use postMessage for communication
                this.timerWindow.postMessage({
                    type: 'event',
                    eventName: 'mainWindow.speakerChange',
                    data: { gender: gender }
                }, window.location.origin);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_UPDATE_TIMER_WINDOW, error);
            }
        }
        // Notify other components about the speaker change
        eventBus.publish('speakerChange', {
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

        // Update timer window if open and if requested
        if (updateTimerWindow && this.timerWindow && !this.timerWindow.closed) {
            try {
                this.timerWindow.postMessage({
                    type: 'event',
                    eventName: 'mainWindow.speakerPaused',
                    data: {}
                }, window.location.origin);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_UPDATE_TIMER_WINDOW, error);
            }
        }

        // Notify other components
        eventBus.publish('speakerPaused', {
            meeting: this.meeting
        });
    }
    /**
     * Opens a timer popup window and establishes communication.
     * @returns {Window|null} Reference to the opened window or null if blocked
     */
    openTimerWindow() {
        this.timerWindow = window.open(CONFIG.URLS.TIMER_WINDOW, 'MeetingTimer',
            CONFIG.URLS.TIMER_WINDOW_FEATURES);

        if (!this.timerWindow) {
            this.view.showError(CONFIG.MESSAGES.ALERT.ERROR_POPUP_BLOCKED);
            return null;
        }

        // Setup communication when window loads
        this.timerWindow.onload = () => {
            // Send initial meeting data and visible button info
            this.timerWindow.postMessage({
                type: 'init',
                meeting: this.meeting,
                visibleButtons: {
                    men: this.meeting.participants[CONFIG.GENDERS.types[0]] > 0,
                    women: this.meeting.participants[CONFIG.GENDERS.types[1]] > 0,
                    nonbinary: this.meeting.participants[CONFIG.GENDERS.types[2]] > 0
                }
            }, window.location.origin);

            // If there's an active speaker, sync it
            if (this.timer.currentSpeaker) {
                this.timerWindow.postMessage({
                    type: 'event',
                    eventName: 'mainWindow.speakerChange',
                    data: { gender: this.timer.currentSpeaker }
                }, window.location.origin);
            }
        };

        // Listen for window closing
        this.timerWindow.addEventListener('beforeunload', () => {
            this.timerWindow = null;
        });

        return this.timerWindow;
    }
    /**
     * Handles messages from the timer popup window.
     * @param {MessageEvent} event - The message event from the popup
     * @returns {void}
     */
    handleTimerWindowMessage(event) {
        //Verify origin for security
        if (event.origin !== window.location.origin) return;

        const { type, eventName, data } = event.data;

        if (type === 'event') {
            switch(eventName) {
                case 'timerWindow.speakerChange':
                    this.startSpeaking(data.gender, false);
                    break;

                case 'timerWindow.speakerPaused':
                    this.pauseSpeaking(false);
                    break;

                case 'timerWindow.meetingEnded':
                    if (data.meeting) {
                        this.meeting = data.meeting;
                        StorageManager.saveMeeting(this.meeting);
                        App.navigateTo(CONFIG.DOM.SCREENS.STATS);
                    }
                    break;
            }
        }
    }
    /**
     * Ends the current meeting and transitions to statistics view.
     * @returns {void}
     */
    endMeeting() {
        this.timer.stopTimer();
        StorageManager.saveMeeting(this.meeting);

        // Close timer window if open
        if (this.timerWindow && !this.timerWindow.closed) {
            this.timerWindow.close();
        }

        eventBus.publish('meetingEnded', {
            meeting: this.meeting
        });

        App.navigateTo(CONFIG.DOM.SCREENS.STATS);
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
        const nonBinaryCount = this.meeting.participants[CONFIG.GENDERS.types[2]];

        // Tell view to update button visibility
        this.view.setButtonVisibility(
            menCount > 0,
            womenCount > 0,
            nonBinaryCount > 0
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

        // Remove message listener
        window.removeEventListener('message', this.handleTimerWindowMessage);
    }
}