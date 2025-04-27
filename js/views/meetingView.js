/**
 * Timer window view:
 * Initializes timer window and syncs between timerView and meetingView
 */
import { CONFIG } from '../utils/config.js';
class MeetingView {
    /**
     * Initializes meetingView element.
     */
    constructor() {
        this.menButton = document.getElementById(CONFIG.DOM.BUTTONS.MEN);
        this.womenButton = document.getElementById(CONFIG.DOM.BUTTONS.WOMEN);
        this.nonBinaryButton = document.getElementById(CONFIG.DOM.BUTTONS.NON_BINARY);
        this.pauseButton = document.getElementById(CONFIG.DOM.BUTTONS.PAUSE);
        this.endButton = document.getElementById(CONFIG.DOM.BUTTONS.END);
        this.timerDisplay = document.getElementById(CONFIG.DOM.TIMER.DISPLAY);

        //Pop-out timer button
        //Wanna move this ...
        this.popOutButton = document.createElement('button');
        this.popOutButton.textContent = "Pop Out Timer";
        this.popOutButton.className = "pop-out-btn";
        this.popOutButton.addEventListener('click', () => this.openTimerWindow());
        this.timerDisplay.parentNode.insertBefore(this.popOutButton, this.timerDisplay.nextSibling);

        //Rest of your constructor
        this.meeting = StorageManager.getCurrentMeeting();
        this.timer = new SpeakingTimer(this.meeting);
        this.timerWindow = null;

        this.initEventListeners();
        this.updateUI();

        //Current meeting accessible globally (for the pop-out window)
        window.getCurrentMeeting = () => this.meeting;

        //Set up to receive updates from timer window
        window.updateFromTimerWindow = (action, data) => this.handleTimerWindowUpdate(action, data);
    }
    /**
     * Initialize listeners.
     * @returns {void}
     */
    initEventListeners() {
        this.menButton.addEventListener('click', () => this.startSpeaking('men'));
        this.womenButton.addEventListener('click', () => this.startSpeaking('women'));
        this.nonBinaryButton.addEventListener('click', () => this.startSpeaking('nonBinary'));
        this.pauseButton.addEventListener('click', () => this.pauseSpeaking());
        this.endButton.addEventListener('click', () => this.endMeeting());
    }
    /**
     * Opens timerWindow.
     * @returns {void}
     */
    openTimerWindow() {
        this.timerWindow = window.open('timer.html', 'MeetingTimer',
            'width=300,height=400,resizable=yes,status=no,location=no,menubar=no');

        if (!this.timerWindow) {
            alert("Unable to open timer window. Please check your popup blocker settings.");
        }
    }
    /**
     * Handels updates from timerWindow.
     * @param {string} action - determines action for update.

     * @returns {void}
     */
    handleTimerWindowUpdate(action, data) {
        console.log("Received update from timer window:", action, data);

        switch(action) {
            case 'speakerChange':
                //Update the main UI to match the timer window
                this.startSpeaking(data.gender, false); //false means don't update the timer window
                break;

            case 'speakerPaused':
                //Update the main UI
                this.pauseSpeaking(false);
                break;

            case 'meetingEnded':
                //Update our meeting object and navigate to stats
                if (data.meeting) {
                    this.meeting = data.meeting;
                    StorageManager.saveMeeting(this.meeting);
                    App.navigateTo('stats');
                }
                break;
        }
    }

    startSpeaking(gender, updateTimerWindow = true) {
        this.timer.startTimer(gender);
        this.updateButtonStates(gender);

        //Also update the timer window if it's open
        if (updateTimerWindow && this.timerWindow && !this.timerWindow.closed) {
            try {
                this.timerWindow.timerWindow.startSpeaking(gender);
            } catch (error) {
                console.error("Error updating timer window:", error);
            }
        }
    }

    pauseSpeaking(updateTimerWindow = true) {
        this.timer.stopTimer();
        this.updateButtonStates(null);

        // Also update the timer window if it's open
        if (updateTimerWindow && this.timerWindow && !this.timerWindow.closed) {
            try {
                this.timerWindow.timerWindow.pauseSpeaking();
            } catch (error) {
                console.error("Error updating timer window:", error);
            }
        }
    }

    endMeeting() {
        this.timer.stopTimer();
        StorageManager.saveMeeting(this.meeting);
        App.navigateTo('stats');
    }

    updateButtonStates(activeGender) {
        //Remove active class from all buttons
        if (this.menButton) this.menButton.classList.remove('active');
        if (this.womenButton) this.womenButton.classList.remove('active');
        if (this.nonBinaryButton) this.nonBinaryButton.classList.remove('active');

        //Also update popup buttons
        if (this.popupMenButton) this.popupMenButton.classList.remove('active');
        if (this.popupWomenButton) this.popupWomenButton.classList.remove('active');
        if (this.popupNonBinaryButton) this.popupNonBinaryButton.classList.remove('active');

        //Add active class to the button for the currently speaking gender
        if (activeGender === 'men' && this.menButton) {
            this.menButton.classList.add('active');
        } else if (activeGender === 'women' && this.womenButton) {
            this.womenButton.classList.add('active');
        } else if (activeGender === 'nonBinary' && this.nonBinaryButton) {
            this.nonBinaryButton.classList.add('active');
        }

    }

    updateUI() {

    }
}