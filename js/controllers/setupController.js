/**
 * Controller for the meeting setup screen.
 * Handles form validation and creation of a new meeting.
 * @class
 */
class SetupController {
    /**
     * Initializes the setup controller with a view reference.
     * @param {SetupView} view - The associated view for UI updates
     * @constructor
     */
    constructor(view) {
        this.view = view;

        this.initEventSubscriptions();
        this.initializeDefaults();
        this.initColorThemeListeners();
    }

    /**
     * Subscribe to relevant events on the EventBus.
     * Sets up communication channels with other components.
     * @returns {void}
     */
    initEventSubscriptions() {
        App.registerFormNavigation(
            CONFIG.DOM.FORM.START_BUTTON,
            CONFIG.DOM.SCREENS.MEETING,
            () => this.validateForm()
        );
    }

    /**
     * Sets default values for the form fields.
     * Sets today's date as the default meeting date.
     * @returns {void}
     */
    initializeDefaults() {
        if (this.view.dateInput) {
            const today = new Date();
            const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            this.view.dateInput.value = dateString;
        }
    }

    /**
     * Sets up event listeners for color theme selection.
     * Applies theme immediately when user selects it.
     * @returns {void}
     */
    initColorThemeListeners() {
        setTimeout(() => {
            const colorThemeInputs = document.querySelectorAll('input[name="colorTheme"]');

            colorThemeInputs.forEach(input => {
                input.addEventListener('change', (event) => {
                    const selectedTheme = event.target.value;

                    applyGenderColorTheme(selectedTheme);

                    StorageManager.saveColorThemePreference(selectedTheme);

                    console.log(`Color theme changed to: ${selectedTheme}`);
                });
            });
        }, 100);
    }

    /**
     * Validates the form input before creating a new meeting.
     * Checks for required fields and minimum participant count.
     * @returns {boolean} True if validation passes, false otherwise
     */
    validateForm() {
        if (!this.view.meetingNameInput || !this.view.meetingNameInput.value.trim()) {
            this.view.showAlert(CONFIG.MESSAGES.ALERT.ERROR_MEETING_NAME_REQUIRED);
            return false;
        }

        if (!this.view.dateInput || !this.view.dateInput.value) {
            this.view.showAlert(CONFIG.MESSAGES.ALERT.ERROR_DATE_REQUIRED);
            return false;
        }

        const womenCount = parseInt(this.view.womenCount?.value || 0);
        const nonbinaryCount = parseInt(this.view.nonbinaryCount?.value || 0);
        const menCount = parseInt(this.view.menCount?.value || 0);

        if (menCount + womenCount + nonbinaryCount < CONFIG.MEETING.MIN_PARTICIPANTS) {
            this.view.showAlert(CONFIG.MESSAGES.ALERT.ERROR_MIN_PARTICIPANTS);
            return false;
        }
        return this.saveMeetingData();
    }

    /**
     * Saves the meeting configuration data to local storage.
     * Creates a meeting data object with name, date, participant counts, and color theme.
     * @returns {boolean} True if saving was successful
     */
    saveMeetingData() {
        try {
            //Get colour theme
            const selectedThemeInput = document.querySelector('input[name="colorTheme"]:checked');
            const selectedTheme = selectedThemeInput ? selectedThemeInput.value : Object.keys(CONFIG.GENDER_COLOR_THEMES)[0];

            const meetingData = {
                name: this.view.meetingNameInput.value,
                date: this.view.dateInput.value,
                participants: {
                    [CONFIG.GENDERS.types[0]]: parseInt(this.view.womenCount.value || 0),
                    [CONFIG.GENDERS.types[1]]: parseInt(this.view.nonbinaryCount.value || 0),
                    [CONFIG.GENDERS.types[2]]: parseInt(this.view.menCount.value || 0)
                },
                colorTheme: selectedTheme
            };

            localStorage.setItem(CONFIG.STORAGE.KEYS.SETUP_MEETING_DATA, JSON.stringify(meetingData));

            //Save theme preference for future meetings
            StorageManager.saveColorThemePreference(selectedTheme);

            //Apply selected theme
            applyGenderColorTheme(selectedTheme);

            eventBus.publish('setupCompleted', meetingData);

            return true;
        } catch (error) {
            console.error(CONFIG.MESSAGES.CONSOLE.ERROR_SAVE_TO_LOCAL, error);
            this.view.showAlert(CONFIG.MESSAGES.ALERT.ERROR_SAVE_TO_LOCAL);
            return false;
        }
    }

    /**
     * Gets the currently selected color theme from the form.
     * @returns {string} The selected theme name or default theme
     */
    getSelectedColorTheme() {
        const selectedThemeInput = document.querySelector('input[name="colorTheme"]:checked');
        return selectedThemeInput ? selectedThemeInput.value : Object.keys(CONFIG.GENDER_COLOR_THEMES)[0] || 'original';
    }

    /**
     * Cleans up resources when the controller is no longer needed.
     * @returns {void}
     */
    cleanup() {
        const colorThemeInputs = document.querySelectorAll('input[name="colorTheme"]');
        colorThemeInputs.forEach(input => {
            input.removeEventListener('change', this.handleColorThemeChange);
        });
    }
}