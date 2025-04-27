import { CONFIG } from '../utils/config.js';
class Meeting {
    constructor(name, date) {
        this.name = name;
        this.date = date;

        this.participants = { men: 0, women: 0, nonBinary: 0 };
        this.speakingData = { men: [], women: [], nonBinary: [] };
        this.active = false;
        this.currentSpeaker = null;
        this.startTime = null;
    }

    setParticipants(men, women, nonBinary) {
        this.participants.men = men;
        this.participants.women = women;
        this.participants.nonBinary = nonBinary;
    }
    //Fler funktioner för möteshantering
}