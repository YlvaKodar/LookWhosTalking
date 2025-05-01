
class SetupView {
    constructor() {
        this.meetingNameInput = document.getElementById(CONFIG.DOM.FORM.MEETING_NAME);
        this.dateInput = document.getElementById(CONFIG.DOM.FORM.MEETING_DATE);
        this.menCount = document.getElementById(CONFIG.DOM.FORM.MEN_COUNT);
        this.womenCount = document.getElementById(CONFIG.DOM.FORM.WOMEN_COUNT);
        this.nonBinaryCount = document.getElementById(CONFIG.DOM.FORM.NONBINARY_COUNT);

        App.registerFormNavigation(CONFIG.DOM.FORM.START_BUTTON, CONFIG.DOM.SCREENS.MEETING, () => this.validateForm());

        this.initializeDefaults();
    }

    initializeDefaults() {
        if (this.dateInput) {
            const today = new Date();
            const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            this.dateInput.value = dateString;
        }

        //Don't think I want this.
        //const savedMeeting = StorageManager.getCurrentMeeting();
        // if (savedMeeting) {
        //     // Om det finns ett sparat möte, fyll i formuläret med dess värden
        //     if (this.meetingNameInput) this.meetingNameInput.value = savedMeeting.name || '';
        //     if (this.menCount) this.menCount.value = savedMeeting.participants?.men || 0;
        //     if (this.womenCount) this.womenCount.value = savedMeeting.participants?.women || 0;
        //     if (this.nonBinaryCount) this.nonBinaryCount.value = savedMeeting.participants?.nonBinary || 0;
        // }
    }

    validateForm() {
        //Meeting needs name and date.
        if (!this.meetingNameInput || !this.meetingNameInput.value.trim()) {
            alert(CONFIG.MESSAGES.ERROR_MEETING_NAME_REQUIRED);
            return false;
        }

        if (!this.dateInput || !this.dateInput.value) {
            alert(CONFIG.MESSAGES.ERROR_DATE_REQUIRED);
            return false;
        }

        //Meeting needs meeters.
        const menCount = parseInt(this.menCount?.value || 0);
        const womenCount = parseInt(this.womenCount?.value || 0);
        const nonBinaryCount = parseInt(this.nonBinaryCount?.value || 0);

        if (menCount + womenCount + nonBinaryCount < 2) {
            alert(CONFIG.MESSAGES.ERROR_MIN_PARTICIPANTS);
            return false;
        }

        //Save if ok.
        this.saveMeetingData();
        return true;
    }

    saveMeetingData() {
        const meetingData = {
            name: this.meetingNameInput.value,
            date: this.dateInput.value,
            participants: {
                men: parseInt(this.menCount.value || 0),
                women: parseInt(this.womenCount.value || 0),
                nonBinary: parseInt(this.nonBinaryCount.value || 0)
            }
        };

        //Spara i temporär lagring för övergång till MeetingView
        localStorage.setItem(CONFIG.STORAGE.SETUP_MEETING_DATA, JSON.stringify(meetingData));

        return true;
    }
}