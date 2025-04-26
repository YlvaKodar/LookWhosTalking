class MeetingView {
    constructor() {
        this.menButton = document.getElementById('men-speaking');
        this.womenButton = document.getElementById('women-speaking');
        this.nonBinaryButton = document.getElementById('nonbinary-speaking');
        this.pauseButton = document.getElementById('pause-meeting');
        this.endButton = document.getElementById('end-meeting');
        this.timerDisplay = document.getElementById('timer-display');

        this.meeting = StorageManager.getCurrentMeeting();
        this.timer = new SpeakingTimer(this.meeting);

        this.initEventListeners();
        this.updateUI();
    }

    initEventListeners() {
        this.menButton.addEventListener('click', () => this.startSpeaking('men'));
        this.womenButton.addEventListener('click', () => this.startSpeaking('women'));
        this.nonBinaryButton.addEventListener('click', () => this.startSpeaking('nonBinary'));
        this.pauseButton.addEventListener('click', () => this.pauseSpeaking());
        this.endButton.addEventListener('click', () => this.endMeeting());
    }

    startSpeaking(gender) {
        this.timer.startTimer(gender);
        this.updateButtonStates(gender);
    }

    pauseSpeaking() {
        this.timer.stopTimer();
        this.updateButtonStates(null);
    }

    endMeeting() {
        this.timer.stopTimer();
        StorageManager.saveMeeting(this.meeting);
        App.navigateTo('stats');
    }

    updateButtonStates(activeGender) {
        // Uppdatera knapparnas utseende baserat på vem som talar
    }

    updateUI() {
        // Uppdatera mötesinfo på skärmen
    }
}