class StorageManager {
    static saveMeeting(meeting) {
        localStorage.setItem('currentMeeting', JSON.stringify(meeting));
    }

    static getCurrentMeeting() {
        const data = localStorage.getItem('currentMeeting');
        if (!data) return null;

        // Skapa ett Meeting-objekt UTAN att anropa någon metod som kan orsaka rekursion
        const parsed = JSON.parse(data);
        const meeting = new Meeting(parsed.name, parsed.date);

        // Manuellt kopiera data istället för att anropa metoder som kan orsaka rekursion
        meeting.participants = parsed.participants || { men: 0, women: 0, nonBinary: 0 };
        meeting.speakingData = parsed.speakingData || { men: [], women: [], nonBinary: [] };
        meeting.active = parsed.active || false;
        meeting.currentSpeaker = parsed.currentSpeaker || null;
        meeting.startTime = parsed.startTime || null;

        return meeting;
    }
}