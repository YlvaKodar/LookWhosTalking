/**
 * SpeakingTimer class for the "Look Who's Talking" application.
 * Handles timing functionality for speaker tracking during meetings.
 * Uses configuration values from CONFIG for consistent behavior across the application.
 * @class
 */
class SpeakingTimer {
    /**
     * Creates a new SpeakingTimer instance associated with a meeting.
     * Initializes timing state variables.
     * @param {Meeting} meeting - The meeting object to track timing for
     * @constructor
     */
    constructor(meeting) {
        this.meeting = meeting;
        this.startTime = null;
        this.interval = null;
        this.currentDuration = 0;
        this.currentSpeaker = null;
    }
    /**
     * Starts the timer for the specified gender, stopping any current timer first.
     * Updates the meeting state and starts interval-based timer updates.
     * @param {string} gender - The gender identifier of the current speaker (from CONFIG.GENDERS.types)
     * @returns {void}
     */
    startTimer(gender) {
        //Stop existing timer
        if (this.interval) {
            this.stopTimer();
        }

        //Update state with new speaker
        this.currentSpeaker = gender;
        this.meeting.currentSpeaker = gender;
        this.startTime = Date.now();

        //Update interval
        if (CONFIG.TIMER.UPDATE_ANIMATION_FRAME) {
            //Use requestAnimationFrame for better performance if configured
            this.animationFrameId = requestAnimationFrame(() => this.updateTimerWithAnimationFrame());
        } else {
            //Otherwise use traditional interval
            this.interval = setInterval(() => this.updateTimer(), CONFIG.TIMER.UPDATE_INTERVAL);
        }
    }
    /**
     * Updates the timer using requestAnimationFrame for smoother updates.
     * Only used if CONFIG.TIMER.UPDATE_ANIMATION_FRAME is true.
     * @returns {void}
     */
    updateTimerWithAnimationFrame() {
        this.updateTimer();
        if (this.startTime) {
            this.animationFrameId = requestAnimationFrame(() => this.updateTimerWithAnimationFrame());
        }
    }
    /**
     * Stops the current timer and records the speaking duration.
     * Adds the speaking segment to the meeting data and resets timer state.
     * @returns {void}
     */
    stopTimer() {
        if (!this.startTime) return;

        //Calculate duration
        const duration = (Date.now() - this.startTime) / 1000;
        const gender = this.meeting.currentSpeaker;

        //Save speaking data
        if (gender && this.meeting.speakingData && this.meeting.speakingData[gender]) {
            this.meeting.speakingData[gender].push(duration);
        }

        //Reset timer state
        if (CONFIG.TIMER.UPDATE_ANIMATION_FRAME && this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        } else if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.startTime = null;
        this.currentSpeaker = null;
        this.meeting.currentSpeaker = null;

        //Reset displays to default
        this.updateTimerDisplays(CONFIG.TIMER.DEFAULT_DISPLAY);
    }

    /**
     * Updates the timer displays with the current elapsed time.
     * Called periodically while timing is active.
     * @returns {string} The formatted time string
     */
    updateTimer() {
        if (!this.startTime) return CONFIG.TIMER.DEFAULT_DISPLAY;

        this.currentDuration = (Date.now() - this.startTime) / 1000;
        const formattedTime = this.formatTime(this.currentDuration);

        // Update displays
        this.updateTimerDisplays(formattedTime);

        return formattedTime;
    }
    /**
     * Updates all timer displays with the given formatted time.
     * Separates display updating from time calculation.
     * @param {string} formattedTime - The formatted time to display
     * @returns {void}
     */
    updateTimerDisplays(formattedTime) {
        const mainDisplay = document.getElementById(CONFIG.DOM.TIMER.DISPLAY);
        const popupDisplay = document.getElementById(CONFIG.DOM.TIMER.POPUP_DISPLAY);

        if (mainDisplay) mainDisplay.textContent = formattedTime;
        if (popupDisplay) popupDisplay.textContent = formattedTime;
    }

    /**
     * Formats a duration in seconds to a human-readable time string.
     * Uses configuration format settings for consistent display.
     * @param {number} seconds - The duration in seconds to format
     * @returns {string} Formatted time string (MM:SS with leading zeros)
     */
    formatTime(seconds) {
        if (isNaN(seconds)) return CONFIG.TIMER.DEFAULT_DISPLAY;

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${mins.toString().padStart(CONFIG.FORMATTING.TIME.PAD_LENGTH, CONFIG.FORMATTING.TIME.PAD_CHAR)}${CONFIG.FORMATTING.TIME.TIME_SEPARATOR}${secs.toString().padStart(CONFIG.FORMATTING.TIME.PAD_LENGTH, CONFIG.FORMATTING.TIME.PAD_CHAR)}`;
    }

    /**
     * Gets the current elapsed time of the active speaker, if any.
     * @returns {number|null} Current duration in seconds, or null if no active timer
     */
    getCurrentDuration() {
        if (!this.startTime) return null;
        return (Date.now() - this.startTime) / 1000;
    }

    /**
     * Cleans up timer resources when destroying the timer instance.
     * Important to prevent memory leaks when navigating away.
     * @returns {void}
     */
    cleanup() {
        if (CONFIG.TIMER.UPDATE_ANIMATION_FRAME && this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        } else if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = null;
        this.animationFrameId = null;
    }
}