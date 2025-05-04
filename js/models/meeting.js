/**
 * Meeting class for the "Look Who's Talking" application.
 * Represents a meeting with participants and their speaking data.
 * Uses configuration values from CONFIG for consistency across the application.
 * @class
 */
class Meeting {
    /**
     * Creates a new Meeting instance with the specified name and date.
     * Initializes participants counts and speaking data structures for each gender.
     * @param {string} name - The name of the meeting
     * @param {string} date - The date of the meeting in YYYY-MM-DD format
     * @constructor
     */
    constructor(name, date) {
        this.name = name;
        this.date = date;

        this.participants = {
            [CONFIG.GENDERS.types[0]]: 0,
            [CONFIG.GENDERS.types[1]]: 0,
            [CONFIG.GENDERS.types[2]]: 0
        };

        this.speakingData = {
            [CONFIG.GENDERS.types[0]]: [],
            [CONFIG.GENDERS.types[1]]: [],
            [CONFIG.GENDERS.types[2]]: []
        };


        this.active = false;
        this.currentSpeaker = null;
        this.startTime = null;
    }
    /**
     * Sets the number of participants for each gender.
     * @param {number} men - Number of men participants
     * @param {number} women - Number of women participants
     * @param {number} nonBinary - Number of non-binary participants
     * @returns {void}
     */
    setParticipants(men, women, nonbinary) {
        this.participants[CONFIG.GENDERS.types[0]] = men;
        this.participants[CONFIG.GENDERS.types[1]] = women;
        this.participants[CONFIG.GENDERS.types[2]] = nonbinary;
    }
    /**
     * Calculates the total number of participants in the meeting.
     * @returns {number} Total number of participants
     */
    getTotalParticipants() {
        return Object.values(this.participants).reduce((sum, count) => sum + count, 0);
    }
    /**
     * Calculates the total speaking time for a specific gender.
     * @param {string} gender - The gender to calculate time for (from CONFIG.GENDERS.types)
     * @returns {number} Total speaking time in seconds
     */
    //Loose or use?
    getTotalSpeakingTime(gender) {
        if (!this.speakingData[gender]) {
            return 0;
        }
        return this.speakingData[gender].reduce((sum, duration) => sum + duration, 0);
    }
    /**
     * Calculates the total speaking time across all genders.
     * @returns {number} Total speaking time in seconds
     */
    //Loose or use?
    getAllSpeakingTime() {
        let totalTime = 0;
        CONFIG.GENDERS.types.forEach(gender => {
            totalTime += this.getTotalSpeakingTime(gender);
        });
        return totalTime;
    }
}