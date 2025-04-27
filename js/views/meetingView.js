class MeetingView {
    constructor() {
        this.menButton = document.getElementById('men-speaking');
        this.womenButton = document.getElementById('women-speaking');
        this.nonBinaryButton = document.getElementById('nonbinary-speaking');
        this.pauseButton = document.getElementById('pause-meeting');
        this.endButton = document.getElementById('end-meeting');
        this.timerDisplay = document.getElementById('timer-display');

        //Setup and show the popup
        PopupManager.setupPopup('timer-popup', '.popup-header');
        PopupManager.showPopup('timer-popup');

        //Setup popup buttons too
        this.popupMenButton = document.getElementById('popup-men-speaking');
        this.popupWomenButton = document.getElementById('popup-women-speaking');
        this.popupNonBinaryButton = document.getElementById('popup-nonbinary-speaking');
        this.popupPauseButton = document.getElementById('popup-pause-meeting');
        this.popupTimerDisplay = document.getElementById('popup-timer-display');

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

        //Add listeners for popup buttons
        this.popupMenButton.addEventListener('click', () => this.startSpeaking('men'));
        this.popupWomenButton.addEventListener('click', () => this.startSpeaking('women'));
        this.popupNonBinaryButton.addEventListener('click', () => this.startSpeaking('nonBinary'));
        this.popupPauseButton.addEventListener('click', () => this.pauseSpeaking());
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
        // Remove active class from all buttons
        this.menButton.classList.remove('active');
        this.womenButton.classList.remove('active');
        this.nonBinaryButton.classList.remove('active');

        //Also update popup buttons
        this.popupMenButton.classList.remove('active');
        this.popupWomenButton.classList.remove('active');
        this.popupNonBinaryButton.classList.remove('active');

        //Add active class to the button for the currently speaking gender
        if (activeGender === 'men') {
            this.menButton.classList.add('active');
            this.popupMenButton.classList.add('active');
        } else if (activeGender === 'women') {
            this.womenButton.classList.add('active');
            this.popupWomenButton.classList.add('active');
        } else if (activeGender === 'nonBinary') {
            this.nonBinaryButton.classList.add('active');
            this.popupNonBinaryButton.classList.add('active');
        }
    }

    updateUI() {

    }
}