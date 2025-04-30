/**
 * Head controller for the application.
 * Handles initialization and navigation between screens.
 */

class App {
    /**
     * Initializes the app by setting up navigation listeners.
     * Shows the start screen when complete.
     */
    static init() {
        this.setupGlobalNavigationListener('new-meeting-btn', CONFIG.DOM.SCREENS.SETUP);
        this.setupGlobalNavigationListener('end-meeting', CONFIG.DOM.SCREENS.STATS);
        this.setupGlobalNavigationListener('back-to-start', CONFIG.DOM.SCREENS.START);

        //Check for completed meetings
        this.checkForCompletedMeetings();

        this.navigateTo(CONFIG.DOM.SCREENS.START);
    }
    /**
     * Sets up navigation for elements that don't require validation.
     * @param {string} element - ID for the navigation triggering element.
     * @param {string} screen - ID for the destination screen.
     * @returns {void}
     */
    static setupGlobalNavigationListener(element, screen){
        if (document.getElementById(element)){
            document.getElementById(element).addEventListener('click', () => {
                this.navigateTo(screen);
            });
        } else {
            console.warn(`Element ${element} not found.`);
        }
    }
    /**
     * Sets up a button that requires form validation before navigation.
     * @param {string} formId - ID for the navigation triggering element.
     * @param {string} targetView - ID for the destination screen.
     * @param {Function} validationCallback - Optional validation function that returns a boolean.
     * @returns {void}
     */
    static registerFormNavigation(formId, targetView, validationCallback){

        if (document.getElementById(formId)){
            document.getElementById(formId).addEventListener('click', (event) => {
                if (validationCallback && !validationCallback()) { //If there is a VC && the return is false:
                    return;
                }
                this.navigateTo(targetView);
            });
        }
    }
    /**
     * Switches to the specified screen view.
     * @param {string} screen - ID for the destination screen.
     * @returns {void}
     */
    static navigateTo(screen) {
        //Hide all screens
        document.querySelectorAll('.screen').forEach(element => {
            element.style.display = 'none';
        });

        //Show $screen or error
        if (document.getElementById(`${screen}`)) {
            document.getElementById(`${screen}`).style.display = 'block';
        } else {
            console.error(`Skärm med ID '${screen}' hittades inte!`);
            return;
        }
        this.initializeView(screen);
    }
    /**
     * Initializes the appropriate view for the current screen.
     * @param {string} screen - ID for the current screen.
     * @returns {void}
     */
    static initializeView(screen){
        this.cleanupActiveProcesses();
        switch(screen) {
            case CONFIG.DOM.SCREENS.START:
                break;
            case CONFIG.DOM.SCREENS.SETUP:
                new SetupView();
                break;
            case CONFIG.DOM.SCREENS.MEETING:
                new MeetingView();
                break;
            case CONFIG.DOM.SCREENS.STATS:
                new StatsView();
                break;
        }
    }
    /**
     * If previous meeting statistics are find, asks user if they want to see them.
     * Then either creates a meeting object for displaying data or deletes data.
     * @returns {void}
     */
    static checkForCompletedMeetings() {
        const completedMeeting = localStorage.getItem(CONFIG.STORAGE.COMPLETED_MEETING);

        if (completedMeeting) {
            //Ask user if they want to view the results
            if (confirm("A completed meeting was found. Would you like to view the statistics?")) {
                const meetingData = JSON.parse(completedMeeting);

                //Create a Meeting object with the saved data
                const meeting = new Meeting(meetingData.name, meetingData.date);
                meeting.participants = meetingData.participants || { men: 0, women: 0, nonBinary: 0 };
                meeting.speakingData = meetingData.speakingData || { men: [], women: [], nonBinary: [] };

                //Save to storage and show stats
                StorageManager.saveMeeting(meeting);
                App.navigateTo('stats');

            }
                //Clear the data
                localStorage.removeItem(CONFIG.STORAGE.COMPLETED_MEETING);
        }
    }
    /**
     * Cleans up resources and saves data before changing views.
     * @returns {void}
     */
    static cleanupActiveProcesses() {
        //todo: clean up resources, save stuff, stop timers etc.
    }
}
// Initializes the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    applyThemeFromConfig();
    App.init();
});