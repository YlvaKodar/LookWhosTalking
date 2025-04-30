class SpeakingTimer {
    constructor(meeting) {
        this.meeting = meeting;
        this.startTime = null;
        this.interval = null;
        this.currentDuration = 0;
    }

    startTimer(gender) {

        if (this.interval) this.stopTimer();

        this.meeting.currentSpeaker = gender;
        this.startTime = Date.now();
        this.interval = setInterval(() => this.updateTimer(), CONFIG.TIMER.UPDATE_INTERVAL);
    }

    stopTimer() {
        if (!this.startTime) return;

        //Calculate and save speaking time
        const duration = (Date.now() - this.startTime) / 1000; // i sekunder
        const gender = this.meeting.currentSpeaker;

        if (gender) {
            this.meeting.speakingData[gender].push(duration);
        }

        //reset timer.
        clearInterval(this.interval);
        this.interval = null;
        this.startTime = null;
        this.meeting.currentSpeaker = null;
    }

    //Update UI timer.
    updateTimer() {
        if (!this.startTime) return;

        this.currentDuration = (Date.now() - this.startTime) / 1000;
        const formattedTime = this.formatTime(this.currentDuration);

        //Update both timer displays
        const mainDisplay = document.getElementById('timer-display');
        const popupDisplay = document.getElementById('popup-timer-display');

        if (mainDisplay) mainDisplay.textContent = formattedTime;
        if (popupDisplay) popupDisplay.textContent = formattedTime;

        return formattedTime;
    }

    formatTime(seconds) {
        //Time as sec and min.
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}