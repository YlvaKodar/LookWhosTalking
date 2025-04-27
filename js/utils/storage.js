import { CONFIG } from '../utils/config.js';
class StorageManager {
    static saveMeeting(meeting) {
        localStorage.setItem(CONFIG.STORAGE.CURRENT_MEETING, JSON.stringify(meeting));
    }

    static getCurrentMeeting() {
        const data = localStorage.getItem(CONFIG.STORAGE.CURRENT_MEETING);
        if (!data) return null;

        const parsed = JSON.parse(data);
        const meeting = new Meeting(parsed.name, parsed.date);

        meeting.participants = parsed.participants || { men: 0, women: 0, nonBinary: 0 };
        meeting.speakingData = parsed.speakingData || { men: [], women: [], nonBinary: [] };
        meeting.active = parsed.active || false;
        meeting.currentSpeaker = parsed.currentSpeaker || null;
        meeting.startTime = parsed.startTime || null;

        return meeting;
    }
}