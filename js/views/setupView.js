class SetupView {
    constructor() {
        this.meetingNameInput = document.getElementById('meeting-name');
        this.dateInput = document.getElementById('meeting-date');
        this.menCount = document.getElementById('men-count');
        this.womenCount = document.getElementById('women-count');
        this.nonBinaryCount = document.getElementById('nonbinary-count');

        App.registerFormNavigation('start-meeting', 'meeting', () => this.validateForm());

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
            alert('Vad ska vi kalla mötet?');
            return false;
        }

        if (!this.dateInput || !this.dateInput.value) {
            alert('Vilken dag är det?');
            return false;
        }

        //Meeting needs meeters.
        const menCount = parseInt(this.menCount?.value || 0);
        const womenCount = parseInt(this.womenCount?.value || 0);
        const nonBinaryCount = parseInt(this.nonBinaryCount?.value || 0);

        if (menCount + womenCount + nonBinaryCount < 2) {
            alert('Inget möte utan minst två deltagare.');
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

        // Spara i temporär lagring för övergång till MeetingView
        localStorage.setItem('setupMeetingData', JSON.stringify(meetingData));

        return true;
    }
}