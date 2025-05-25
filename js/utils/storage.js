/**
 * Storage manager for the "Look Who's Talking" application.
 * Handles saving and retrieving meeting data using localStorage.
 * @class
 */
class StorageManager {
    /**
     * Saves a meeting object to localStorage.
     * Uses the current meeting key from CONFIG.
     * @static
     * @param {Meeting} meeting - The meeting object to save
     * @returns {void}
     */
    static saveMeeting(meeting) {
        try {
            localStorage.setItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING, JSON.stringify(meeting));
            return true;
        } catch (error) {
            console.error(CONFIG.MESSAGES.ERROR_SAVE_TO_LOCAL, error);
            AlertManager.showAlert(ERROR_SAVE_TO_LOCAL);
            return false;
        }
    }
    /**
     * Retrieves the current meeting from localStorage.
     * Creates a properly instantiated Meeting object with data from storage.
     * @static
     * @returns {Meeting|null} The retrieved meeting object or null if not found
     */
    static getCurrentMeeting() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING);
            if (!data) {

                const setupData = this.getSetupMeetingData();
                if (setupData) {
                    const meeting = new Meeting(setupData.name, setupData.date);
                    meeting.setParticipants(
                        setupData.participants[CONFIG.GENDERS.types[0]] || 0,
                        setupData.participants[CONFIG.GENDERS.types[1]] || 0,
                        setupData.participants[CONFIG.GENDERS.types[2]] || 0
                    );
                    return meeting;
                }
                return null;
            }

            const parsed = JSON.parse(data);
            if (!parsed || typeof parsed !== 'object') {
                return null;
            }

            //Make sure there's valid meeting data with defaults for missing fields
            const meeting = new Meeting(
                parsed.name || CONFIG.DEFAULTS.MEETING_NAME,
                parsed.date || new Date().toISOString().split('T')[0]
            );

            meeting.participants = parsed.participants || {
                [CONFIG.GENDERS.types[0]]: 0,
                [CONFIG.GENDERS.types[1]]: 0,
                [CONFIG.GENDERS.types[2]]: 0
            };

            meeting.speakingData = parsed.speakingData || {
                [CONFIG.GENDERS.types[0]]: [],
                [CONFIG.GENDERS.types[1]]: [],
                [CONFIG.GENDERS.types[2]]: []
            };

            meeting.active = parsed.active || false;
            meeting.currentSpeaker = parsed.currentSpeaker || null;
            meeting.startTime = parsed.startTime || null;

            return meeting;
        } catch (error) {
            console.error(CONFIG.MESSAGES.CONSOLE.ERROR_PARSE_MEETING, error);
            return null;
        }
    }
    /**
     * Saves a completed meeting to localStorage.
     * Uses the completed meeting key from CONFIG.
     * @static
     * @param {Meeting} meeting - The completed meeting to save
     * @returns {void}
     */
    static saveCompletedMeeting(meeting) {
        localStorage.setItem(CONFIG.STORAGE.KEYS.COMPLETED_MEETING, JSON.stringify(meeting));
    }
    /**
     * Clears all meeting data from localStorage.
     * Useful when starting fresh or after processing completed meetings.
     * @static
     * @returns {void}
     */
    static clearMeetingData() {
        localStorage.removeItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING);
        localStorage.removeItem(CONFIG.STORAGE.KEYS.COMPLETED_MEETING);
        localStorage.removeItem(CONFIG.STORAGE.KEYS.SETUP_MEETING_DATA);
    }
    /**
     * Retrieves setup meeting data from localStorage.
     * Used when transitioning from setup to active meeting screens.
     * @static
     * @returns {Object|null} The setup meeting data or null if not found
     */
    static getSetupMeetingData() {
        const data = localStorage.getItem(CONFIG.STORAGE.KEYS.SETUP_MEETING_DATA);
        if (!data) return null;

        try {
            return JSON.parse(data);
        } catch (error) {
            console.error(CONFIG.MESSAGES.CONSOLE.ERROR_PARSE_MEETING, error);
            return null;
        }
    }

    /**
     * Saves user's color theme preference to localStorage.
     * @static
     * @param {string} themeName - The name of the selected theme
     * @returns {boolean} True if saved successfully, false otherwise
     */
    static saveColorThemePreference(themeName) {
        try {
            localStorage.setItem(CONFIG.STORAGE.KEYS.COLOR_THEME_PREFERENCE, themeName);
            return true;
        } catch (error) {
            console.error(CONFIG.MESSAGES.CONSOLE.ERROR_SAVE_TO_LOCAL, error);
            return false;
        }
    }

    /**
     * Retrieves user's color theme preference from localStorage.
     * @static
     * @returns {string|null} The saved theme name or null if not found
     */
    static getColorThemePreference() {
        try {
            return localStorage.getItem(CONFIG.STORAGE.KEYS.COLOR_THEME_PREFERENCE);
        } catch (error) {
            console.error(CONFIG.MESSAGES.CONSOLE.ERROR_LOCALSTORAGE, error);
            return null;
        }
    }

    /**
     * Clears the user's color theme preference from localStorage.
     * @static
     * @returns {boolean} True if cleared successfully
     */
    static clearColorThemePreference() {
        try {
            localStorage.removeItem(CONFIG.STORAGE.KEYS.COLOR_THEME_PREFERENCE);
            return true;
        } catch (error) {
            console.error(CONFIG.MESSAGES.CONSOLE.ERROR_LOCALSTORAGE, error);
            return false;
        }
    }
}