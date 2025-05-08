/**
 * View for the Meeting Setup screen.
 * Focuses on UI updates and user interactions.
 * Delegates business logic to SetupController.
 * @class
 */
class SetupView {
    /**
     * Initializes the setup screen and form elements.
     * @constructor
     */
    constructor() {
        this.meetingNameInput = document.getElementById(CONFIG.DOM.FORM.MEETING_NAME);
        this.dateInput = document.getElementById(CONFIG.DOM.FORM.MEETING_DATE);
        this.menCount = document.getElementById(CONFIG.DOM.FORM.MEN_COUNT);
        this.womenCount = document.getElementById(CONFIG.DOM.FORM.WOMEN_COUNT);
        this.nonbinaryCount = document.getElementById(CONFIG.DOM.FORM.NONBINARY_COUNT);

        this.controller = new SetupController(this);
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