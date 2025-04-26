class SpeakingTimer {
    constructor(meeting) {
        this.meeting = meeting;
        this.startTime = null;
        this.interval = null;
        this.currentDuration = 0;
    }

    startTimer(gender) {
        // Stoppa eventuell pågående timer
        if (this.interval) this.stopTimer();

        // Starta ny timer för angiven könskategori
        this.meeting.currentSpeaker = gender;
        this.startTime = Date.now();
        this.interval = setInterval(() => this.updateTimer(), 100);
    }

    stopTimer() {
        if (!this.startTime) return;

        // Beräkna talartiden och spara
        const duration = (Date.now() - this.startTime) / 1000; // i sekunder
        const gender = this.meeting.currentSpeaker;

        if (gender) {
            this.meeting.speakingData[gender].push(duration);
        }

        // Återställ timer
        clearInterval(this.interval);
        this.interval = null;
        this.startTime = null;
        this.meeting.currentSpeaker = null;
    }

    // Funktion för att uppdatera UI-timer
    updateTimer() {
        if (!this.startTime) return;

        this.currentDuration = (Date.now() - this.startTime) / 1000;
        const formattedTime = this.formatTime(this.currentDuration);

        // Uppdatera all timer-displayer (anropar en metod i MeetingView)
        return formattedTime;
    }

    formatTime(seconds) {
        // Formatera tid som mm:ss
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}