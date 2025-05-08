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
        this.menButton = document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.MEN);
        this.womenButton = document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.WOMEN);
        this.nonbinaryButton = document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.NON_BINARY);
        this.pauseButton = document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.PAUSE);
        this.endButton = document.getElementById(CONFIG.TIMER_POPOUT_DOM.BUTTONS.END);
        this.timerDisplay = document.getElementById(CONFIG.TIMER_POPOUT_DOM.DISPLAY);
        this.meetingInfo = document.getElementById(CONFIG.TIMER_POPOUT_DOM.MEETING_INFO);

        // Create controller
        this.controller = new TimerPopOutController(this);

        // Set up event listeners
        this.initEventListeners();
    }

    /**
     * Updates the meeting info display with current meeting name.
     * @returns {void}
     */
    updateMeetingName(meetingName) {
        if (meetingName) {
            this.meetingInfo.textContent = meetingName;
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
        } else if (activeGender === CONFIG.GENDERS.types[2] && this.nonbinaryButton) {
            this.nonbinaryButton.classList.add(CONFIG.THEME.CSS_CLASSES.ACTIVE);
        }
    }

    /**
     * Sets the visibility of gender buttons based on participant counts.
     * Only shows buttons for genders that have participants.
     * @param {boolean} showMen - Whether to show the men button
     * @param {boolean} showWomen - Whether to show the women button
     * @param {boolean} showNonbinary - Whether to show the non-binary button
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
    /**
     * Shows an alert message to the user using the custom alert.
     * @param {string} message - The message to display
     * @returns {void}
     */
    showAlert(message) {
        AlertManager.showAlert(message);
    }
}

// Initialize the timer window when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const timerView = new TimerPopOutView();

    //Let opener know window is ready
    if (window.opener) {
        window.opener.postMessage({
            type: 'timerWindow.ready',
            data: {}
        }, window.location.origin);
    }
});
