/**
 * TimerWindow class
 * Controller for the timer popup window that syncs with the main meeting view.
 * Allows tracking speaker time from a separate window for better visibility during meetings.
 * @class
 */
class TimerPopOutView {
    /**
     * Initializes the timer popout view with UI elements and event handlers.
     * @constructor
     */
    constructor() {
        // Get DOM elements
        this.menButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_MEN);
        this.womenButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_WOMEN);
        this.nonbinaryButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_NON_BINARY);
        this.pauseButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_PAUSE);
        this.endButton = document.getElementById(CONFIG.DOM.BUTTONS.POPUP_END);
        this.timerDisplay = document.getElementById(CONFIG.DOM.TIMER.POPUP_DISPLAY);
        this.meetingInfo = document.getElementById(CONFIG.TIMER_POPUP.DOM.MEETING_INFO);

        // Load meeting data
        this.meeting = this.loadMeetingData();

        // Create controller
        this.controller = new TimerPopOutController(this.meeting, this);

        // Set up event listeners
        this.initEventListeners();

        // Update meeting info
        this.updateMeetingInfo();
    }

    /**
     * Loads meeting data from the opener window or local storage.
     * @returns {Meeting} The meeting data object
     */
    loadMeetingData() {
        // First try to get meeting data from the opener window
        if (window.opener && !window.opener.closed) {
            try {
                const openerMeetingData = localStorage.getItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING);
                if (openerMeetingData) {
                    const parsedData = JSON.parse(openerMeetingData);
                    const meeting = new Meeting(
                        parsedData.name || CONFIG.DEFAULTS.MEETING_NAME,
                        parsedData.date || new Date().toISOString().split('T')[0]
                    );

                    meeting.participants = parsedData.participants || {
                        [CONFIG.GENDERS.types[0]]: 0,
                        [CONFIG.GENDERS.types[1]]: 0,
                        [CONFIG.GENDERS.types[2]]: 0
                    };

                    meeting.speakingData = parsedData.speakingData || {
                        [CONFIG.GENDERS.types[0]]: [],
                        [CONFIG.GENDERS.types[1]]: [],
                        [CONFIG.GENDERS.types[2]]: []
                    };

                    return meeting;
                }
            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_OPENER_ACCESS, error);
            }
        }

        //Fallback to localStorage
        try {
            const savedMeeting = localStorage.getItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING);
            if (savedMeeting) {
                const parsedData = JSON.parse(savedMeeting);
                const meeting = new Meeting(
                    parsedData.name || CONFIG.DEFAULTS.MEETING_NAME,
                    parsedData.date || new Date().toISOString().split('T')[0]
                );

                meeting.participants = parsedData.participants || {
                    [CONFIG.GENDERS.types[0]]: 0,
                    [CONFIG.GENDERS.types[1]]: 0,
                    [CONFIG.GENDERS.types[2]]: 0
                };

                meeting.speakingData = parsedData.speakingData || {
                    [CONFIG.GENDERS.types[0]]: [],
                    [CONFIG.GENDERS.types[1]]: [],
                    [CONFIG.GENDERS.types[2]]: []
                };

                return meeting;
            }
        } catch (error) {
            console.error(CONFIG.MESSAGES.CONSOLE.ERROR_LOCALSTORAGE, error);
        }

        //If all else fails, create a basic meeting object
        return new Meeting(CONFIG.DEFAULTS.MEETING_NAME, new Date().toISOString().split('T')[0]);
    }

    /**
     * Updates the meeting info display with current meeting name and participant count.
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
     * Sets up event listeners for all buttons.
     * @returns {void}
     */
    initEventListeners() {
        this.menButton.addEventListener('click', () =>
            this.controller.startSpeaking(CONFIG.GENDERS.types[0]));

        this.womenButton.addEventListener('click', () =>
            this.controller.startSpeaking(CONFIG.GENDERS.types[1]));

        this.nonbinaryButton.addEventListener('click', () =>
            this.controller.startSpeaking(CONFIG.GENDERS.types[2]));

        this.pauseButton.addEventListener('click', () =>
            this.controller.pauseSpeaking());

        this.endButton.addEventListener('click', () =>
            this.controller.endMeeting());
    }

    /**
     * Updates the timer display with formatted time.
     * @param {string} formattedTime - The formatted time string (MM:SS)
     * @returns {void}
     */
    updateTimerDisplay(formattedTime) {
        this.timerDisplay.textContent = formattedTime;
    }

    /**
     * Updates the visual state of speaker buttons based on which gender is currently active.
     * @param {string|null} activeGender - The currently active gender, or null if no one is speaking
     * @returns {void}
     */
    updateButtonStates(activeGender) {
        // Remove active class from all buttons
        [this.menButton, this.womenButton, this.nonbinaryButton].forEach(button => {
            if (button) button.classList.remove(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        });

        // Add active class to the appropriate button
        if (activeGender === CONFIG.GENDERS.types[0] && this.menButton) {
            this.menButton.classList.add(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        } else if (activeGender === CONFIG.GENDERS.types[1] && this.womenButton) {
            this.womenButton.classList.add(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        } else if (activeGender === CONFIG.GENDERS.types[2] && this.nonBinaryButton) {
            this.nonbinaryButton.classList.add(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        }
    }

    /**
     * Sets the visibility of gender buttons based on participant counts.
     * Only shows buttons for genders that have participants.
     * @param {boolean} showMen - Whether to show the men button
     * @param {boolean} showWomen - Whether to show the women button
     * @param {boolean} showNonBinary - Whether to show the non-binary button
     * @returns {void}
     */
    setButtonVisibility(showMen, showWomen, showNonbinary) {
        if (this.menButton) {
            this.menButton.style.display = showMen ? CONFIG.DOM.DISPLAY.BLOCK : CONFIG.DOM.DISPLAY.NONE;
        }

        if (this.womenButton) {
            this.womenButton.style.display = showWomen ? CONFIG.DOM.DISPLAY.BLOCK : CONFIG.DOM.DISPLAY.NONE;
        }

        if (this.nonbinaryButton) {
            this.nonbinaryButton.style.display = showNonbinary ? CONFIG.DOM.DISPLAY.BLOCK : CONFIG.DOM.DISPLAY.NONE;
        }

        // Update container class based on visible button count
        const speakerButtonsContainer = document.querySelector('.speaker-buttons');
        if (speakerButtonsContainer) {
            const visibleCount = [showMen, showWomen, showNonbinary].filter(Boolean).length;

            // Remove previous classes
            speakerButtonsContainer.classList.remove('one-button', 'two-buttons', 'three-buttons');

            // Add class based on visible count
            speakerButtonsContainer.classList.add(`${visibleCount}-buttons`);
        }
    }
}

// Initialize the timer window when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimerView();
});
