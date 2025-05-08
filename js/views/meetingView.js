/**
 * View for the active meeting screen.
 * Focuses on UI updates and user interactions.
 * Delegates business logic to MeetingController.
 * @class
 */
class MeetingView {
    /**
     * Initializes the meeting view with all necessary DOM elements.
     * @constructor
     */
    constructor() {
        this.menButton = document.getElementById(CONFIG.DOM.BUTTONS.MEN);
        this.womenButton = document.getElementById(CONFIG.DOM.BUTTONS.WOMEN);
        this.nonbinaryButton = document.getElementById(CONFIG.DOM.BUTTONS.NON_BINARY);
        this.pauseButton = document.getElementById(CONFIG.DOM.BUTTONS.PAUSE);
        this.endButton = document.getElementById(CONFIG.DOM.BUTTONS.END_MEETING);
        this.timerDisplay = document.getElementById(CONFIG.DOM.TIMER.DISPLAY);
        this.popOutButton = document.getElementById(CONFIG.DOM.BUTTONS.TIMER_POPOUT);
        this.howToUseButton = document.getElementById(CONFIG.DOM.BUTTONS.HOW_TO_USE_TIMER);

        if (!this.popOutButton) {
            this.popOutButton = document.createElement('button');
            this.popOutButton.id = CONFIG.DOM.BUTTONS.TIMER_POPOUT;
            this.popOutButton.textContent = CONFIG.LABELS.TIMER_POPOUT_BUTTON;
            this.popOutButton.className = CONFIG.TIMER_POPOUT_DOM.BUTTON_CLASS;
            this.timerDisplay.parentNode.insertBefore(this.popOutButton, this.timerDisplay.nextSibling);
        }
        // Load meeting data with error handling
        this.meeting = StorageManager.getCurrentMeeting();

        if (!this.meeting) {
            alert(CONFIG.MESSAGES.ALERT.ERROR_MEETING_DATA_REQUIRED);
            App.navigateTo(CONFIG.DOM.SCREENS.SETUP);
            return;
        }

        this.controller = new MeetingController(this.meeting, this);

        this.initEventListeners();

        this.updateUI();
    }
    /**
     * Initializes all event listeners for the meeting view buttons.
     * @returns {void}
     */
    initEventListeners() {
        this.menButton.addEventListener('click', () => this.controller.startSpeaking(CONFIG.GENDERS.types[0]));
        this.womenButton.addEventListener('click', () => this.controller.startSpeaking(CONFIG.GENDERS.types[1]));
        this.nonbinaryButton.addEventListener('click', () => this.controller.startSpeaking(CONFIG.GENDERS.types[2]));
        this.pauseButton.addEventListener('click', () => this.controller.pauseSpeaking());
        this.endButton.addEventListener('click', () => this.controller.endMeeting());
        this.popOutButton.addEventListener('click', () => this.controller.openTimerWindow());
        this.howToUseButton.addEventListener('click', () => { AlertManager.showAlert(CONFIG.MESSAGES.ALERT.HOW_TO_USE_TIMER.CONTENT) })
    }
    /**
     * Updates the user interface with current meeting data.
     * @returns {void}
     */
    updateUI() {
        // Update meeting title
        if (this.meeting && this.meeting.name) {
            const meetingTitle = document.getElementById('meeting-title');
            if (meetingTitle) {
                meetingTitle.textContent = this.meeting.name;
            }
        }
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

        // Add active class to the button for the currently speaking gender
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

        //Add class container on element to adjust layout
        const speakerButtonsContainer = document.querySelector('.speaker-buttons');
        if (speakerButtonsContainer) {
            const visibleCount = [showMen, showWomen, showNonbinary].filter(Boolean).length;

            //remove earlier classes
            speakerButtonsContainer.classList.remove('one-button', 'two-buttons', 'three-buttons');

            //add classes for visible buttons
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
    /**
     * Shows a confirm message to the user using the custom alert.
     * @param {string} message - The message to display
     * @returns {void}
     */
    showConfirm(message) {
        AlertManager.showAlert(message);
    }
}