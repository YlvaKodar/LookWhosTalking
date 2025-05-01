/**
 * Controller for the Meeting Setup screen.
 * Handles input validation and creation of a new meeting.
 * @class
 */
class SetupView {
    /**
     * Initializes the setup screen and form elements.
     * Sets up event listeners and default values.
     * @constructor
     */
    constructor() {
        this.meetingNameInput = document.getElementById(CONFIG.DOM.FORM.MEETING_NAME);
        this.dateInput = document.getElementById(CONFIG.DOM.FORM.MEETING_DATE);
        this.menCount = document.getElementById(CONFIG.DOM.FORM.MEN_COUNT);
        this.womenCount = document.getElementById(CONFIG.DOM.FORM.WOMEN_COUNT);
        this.nonBinaryCount = document.getElementById(CONFIG.DOM.FORM.NONBINARY_COUNT);

        App.registerFormNavigation(
            CONFIG.DOM.FORM.START_BUTTON,
            CONFIG.DOM.SCREENS.MEETING,
            () => this.validateForm()
        );

        this.initializeDefaults();
    }
    /**
     * Sets default values for the form fields.
     * Sets today's date as the default meeting date.
     * @returns {void}
     */
    initializeDefaults() {
        if (this.dateInput) {
            const today = new Date();
            const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            this.dateInput.value = dateString;
        }

        //Don't think I want this.
        //const savedMeeting = StorageManager.getCurrentMeeting();
        // if (savedMeeting) {
        //     //Om det finns ett sparat möte, fyll i formuläret med dess värden
        //     if (this.meetingNameInput) this.meetingNameInput.value = savedMeeting.name || '';
        //     if (this.menCount) this.menCount.value = savedMeeting.participants?.men || 0;
        //     if (this.womenCount) this.womenCount.value = savedMeeting.participants?.women || 0;
        //     if (this.nonBinaryCount) this.nonBinaryCount.value = savedMeeting.participants?.nonBinary || 0;
        // }
    }
    /**
     * Validates the form input before creating a new meeting.
     * Checks for required fields and minimum participant count.
     * @returns {boolean} True if validation passes, false otherwise
     */
    validateForm() {
        if (!this.meetingNameInput || !this.meetingNameInput.value.trim()) {
            alert(CONFIG.MESSAGES.ERROR_MEETING_NAME_REQUIRED);
            return false;
        }

        if (!this.dateInput || !this.dateInput.value) {
            alert(CONFIG.MESSAGES.ERROR_DATE_REQUIRED);
            return false;
        }

        const menCount = parseInt(this.menCount?.value || 0);
        const womenCount = parseInt(this.womenCount?.value || 0);
        const nonBinaryCount = parseInt(this.nonBinaryCount?.value || 0);

        if (menCount + womenCount + nonBinaryCount < CONFIG.MEETING.MIN_PARTICIPANTS) {
            alert(CONFIG.MESSAGES.ERROR_MIN_PARTICIPANTS);
            return false;
        }

        this.saveMeetingData();
        return true;
    }
    /**
     * Saves the meeting configuration data to local storage.
     * Creates a meeting data object with name, date and participant counts.
     * @returns {boolean} True if saving was successful
     */
    saveMeetingData() {
        const meetingData = {
            name: this.meetingNameInput.value,
            date: this.dateInput.value,
            participants: {
                [CONFIG.GENDERS.types[0]]: parseInt(this.menCount.value || 0),
                [CONFIG.GENDERS.types[1]]: parseInt(this.womenCount.value || 0),
                [CONFIG.GENDERS.types[2]]: parseInt(this.nonBinaryCount.value || 0)
            }
        };

        // Save to temporary storage for transition to MeetingView
        localStorage.setItem(CONFIG.STORAGE.SETUP_MEETING_DATA, JSON.stringify(meetingData));

        return true;
    }
}