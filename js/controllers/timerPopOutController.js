/**
 * Controller for the timer popout window.
 * Handles timer functionality and communication with the main window.
 * @class
 */
class TimerPopOutController {
    /**
     * Initializes the timer controller with a view and meeting data.
     * @param {Meeting} meeting - The meeting model object
     * @param {TimerPopOutView} view - The associated view for UI updates
     * @constructor
     */
    constructor(meeting, view) {
        this.meeting = meeting;
        this.view = view;
        this.startTime = null;
        this.interval = null;
        this.currentSpeaker = null;

        //Setup messaging with parent window
        this.setupWindowCommunication();

        //Set initial button visibility based on participants
        this.updateVisibleButtons();
    }

    /**
     * Sets up window messaging to communicate with the main window.
     * @returns {void}
     */
    setupWindowCommunication() {
        //Listen for messages from main window
        window.addEventListener('message', this.handleMainWindowMessage.bind(this));

        //Notify main window that we're ready
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: CONFIG.COMMUNICATION.MESSAGE_TYPES.EVENT,
                eventName: CONFIG.COMMUNICATION.WINDOW.TIMER.SPEAKER_PAUSED,
                data: {}
            }, window.location.origin);
        }
    }

    /**
     * Handle messages received from the main window.
     * @param {MessageEvent} event - The message event
     * @returns {void}
     */
    handleMainWindowMessage(event) {
        //Verify message origin for security
        if (event.origin !== window.location.origin) return;

        const { type, eventName, data } = event.data;

        //Handle initialization message
        if (type === CONFIG.COMMUNICATION.MESSAGE_TYPES.INIT) {
            //Update meeting data
            if (data.meeting) {
                this.meeting = data.meeting;
                this.view.updateMeetingInfo();
            }

            //Update button visibility if info provided
            if (data.visibleButtons) {
                this.view.setButtonVisibility(
                    data.visibleButtons.men,
                    data.visibleButtons.women,
                    data.visibleButtons.nonbinary
                );
            }
            return;
        }

        //Handle event messages
        if (type === CONFIG.COMMUNICATION.MESSAGE_TYPES.EVENT) {
            switch(eventName) {
                case CONFIG.COMMUNICATION.WINDOW.MAIN.SPEAKER_CHANGE:
                    if (data.gender) {
                        this.startSpeaking(data.gender, false);
                    }
                    break;

                case CONFIG.COMMUNICATION.WINDOW.MAIN.SPEAKER_PAUSED:
                    this.pauseSpeaking(false);
                    break;

                case CONFIG.COMMUNICATION.WINDOW.MAIN.MEETING_ENDED:
                    this.endMeeting();
                    break;
            }
        }
    }

    /**
     * Updates which gender buttons are visible based on participation.
     * Only shows buttons for genders that have participants.
     * @returns {void}
     */
    updateVisibleButtons() {
        //Get participant counts
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
     * Starts timing for a specified gender.
     * Updates model, timer and UI elements.
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
                    type: CONFIG.COMMUNICATION.MESSAGE_TYPES.EVENT,
                    eventName: CONFIG.COMMUNICATION.WINDOW.TIMER.SPEAKER_CHANGE,
                    data: {
                        gender: gender,
                        meeting: this.meeting
                    }
                }, window.location.origin);
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_NOTIFY_MAIN, error);
                // Fallback to localStorage communication if postMessage fails
                localStorage.setItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING, JSON.stringify(this.meeting));
            }
        }
    }

    /**
     * Pauses the active speaker timer.
     * Updates model, timer and UI elements.
     * @param {boolean} notifyMainWindow - Whether to notify the main window
     * @returns {void}
     */
    pauseSpeaking(notifyMainWindow = true) {
        if (!this.startTime || !this.currentSpeaker) return;

        //Calculate duration and add to meeting data
        const duration = (Date.now() - this.startTime) / 1000;

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
        this.view.updateButtonStates(null);
        this.view.updateTimerDisplay(CONFIG.TIMER.DEFAULT_DISPLAY);

        //Save data to localStorage as fallback
        localStorage.setItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING, JSON.stringify(this.meeting));

        //Notify main window if requested
        if (notifyMainWindow && window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: CONFIG.COMMUNICATION.MESSAGE_TYPES.EVENT,
                    eventName: CONFIG.COMMUNICATION.WINDOW.TIMER.SPEAKER_PAUSED,
                    data: {
                        duration: duration,
                        meeting: this.meeting
                    }
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
        //Pause ongoing speaking
        if (this.interval) {
            this.pauseSpeaking(false);
        }

        //Mark meeting as complete
        localStorage.setItem(CONFIG.STORAGE.KEYS.COMPLETED_MEETING, JSON.stringify(this.meeting));

        //Notify main window if open
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: CONFIG.COMMUNICATION.MESSAGE_TYPES.EVENT,
                    eventName: CONFIG.COMMUNICATION.WINDOW.TIMER.MEETING_ENDED,
                    data: {
                        meeting: this.meeting
                    }
                }, window.location.origin);

                //Wait a moment before closing to ensure message is sent
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