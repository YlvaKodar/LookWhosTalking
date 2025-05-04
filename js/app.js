/**
 * Main controller for the "Look Who's Talking" application.
 * Handles initialization, navigation between screens, and application lifecycle.
 * @class
 */
class App {
    /**
     * Initializes the app by setting up navigation listeners and checking for saved meetings.
     * Shows the start screen when complete.
     * @static
     * @returns {void}
     */
    static init() {
        this.setupGlobalNavigationListener(CONFIG.DOM.BUTTONS.NEW_MEETING, CONFIG.DOM.SCREENS.SETUP);
        this.setupGlobalNavigationListener(CONFIG.DOM.BUTTONS.END_MEETING, CONFIG.DOM.SCREENS.STATS);
        this.setupGlobalNavigationListener(CONFIG.DOM.BUTTONS.BACK_TO_START, CONFIG.DOM.SCREENS.START);

        this.checkForCompletedMeetings();

        this.navigateTo(CONFIG.DOM.SCREENS.START);
    }
    /**
     * Sets up navigation for elements that don't require validation.
     * @static
     * @param {string} elementId - ID for the navigation triggering element.
     * @param {string} screenId - ID for the destination screen.
     * @returns {void}
     */
    static setupGlobalNavigationListener(elementId, screenId){
        if (document.getElementById(elementId)){
            document.getElementById(elementId).addEventListener('click', () => {
                if (elementId === CONFIG.DOM.BUTTONS.BACK_TO_START) {
                    StorageManager.clearMeetingData(); // Rensa alla mötesdata
                    this.cleanupActiveProcesses();
                }
                this.navigateTo(screenId);
            });
        } else {
            console.warn(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + elementId);
        }

    }
    /**
     * Sets up a buttons that requires form validation before navigation.
     * @static
     * @param {string} buttonId - ID for the button element that triggers navigation.
     * @param {string} targetScreenId - ID for the destination screen.
     * @param {Function} validationCallback - Optional validation function that returns a boolean.
     * @returns {void}
     */
    static registerFormNavigation(buttonId, targetView, validationCallback){

        if (document.getElementById(buttonId)){
            document.getElementById(buttonId).addEventListener('click', (event) => {
                if (validationCallback && !validationCallback()) { //If there is a VC && the return is false:
                    return;
                }
                this.navigateTo(targetView);
            });
        }else {
        console.warn(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + buttonId);
        }
    }
    /**
     * Switches to the specified screen view.
     * @static
     * @param {string} screenId - ID for the destination screen.
     * @returns {void}
     */
    static navigateTo(screenId) {
        document.querySelectorAll('.screen').forEach(element => {
            element.style.display = CONFIG.DOM.DISPLAY.NONE;
        });

        if (document.getElementById(`${screenId}`)) {
            document.getElementById(`${screenId}`).style.display = CONFIG.DOM.DISPLAY.BLOCK;
        } else {
            console.error(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + screenId);
            return;
        }
        this.initializeView(screenId);
    }
    /**
     * Initializes the appropriate view controller for the current screen.
     * @static
     * @param {string} screenId - ID for the current screen.
     * @returns {void}
     */
    static initializeView(screenId){
        this.cleanupActiveProcesses();
        switch(screenId) {
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
            default:
                console.warn(CONFIG.MESSAGES.CONSOLE.VIEW_UNDEFINED + screenId);
        }
    }
    /**
     * Checks for previously completed meetings and handles them appropriately.
     * If found, asks user if they want to view statistics or delete the data.
     * @static
     * @returns {void}
     */
    static checkForCompletedMeetings() {
        const completedMeetingData = localStorage.getItem(CONFIG.STORAGE.KEYS.COMPLETED_MEETING);

        if (completedMeetingData) {
            if (confirm(CONFIG.MESSAGES.CONFIRM.VIEW_STATS)) {
                try {
                    const meetingData = JSON.parse(completedMeetingData);

                    const meeting = new Meeting(meetingData.name, meetingData.date);
                    meeting.participants = meetingData.participants || {
                        [CONFIG.GENDERS.types.MEN]: 0,
                        [CONFIG.GENDERS.types.WOMEN]: 0,
                        [CONFIG.GENDERS.types.NON_BINARY]: 0
                    };
                    meeting.speakingData = meetingData.speakingData || {
                        [CONFIG.GENDERS.types.MEN]: [],
                        [CONFIG.GENDERS.types.WOMEN]: [],
                        [CONFIG.GENDERS.types.NON_BINARY]: []
                    };

                    StorageManager.saveMeeting(meeting);
                    App.navigateTo(CONFIG.DOM.SCREENS.STATS);
                } catch (error) {
                    console.error(CONFIG.MESSAGES.CONSOLE.ERROR_PARSE_MEETING + error);
                    alert(CONFIG.MESSAGES.ALERT.ERROR_LOADING_MEETING);
                }
            }

            //Clear the data regardless of user choice
            localStorage.removeItem(CONFIG.STORAGE.KEYS.COMPLETED_MEETING);
        }
    }
    /**
     * Cleans up resources and saves data before changing views.
     * Stops active timers and processes to prevent memory leaks.
     * @static
     * @returns {void}
     */
    static cleanupActiveProcesses() {
        //todo: clean up resources, save stuff, stop timers etc.
        const chartIds = [CONFIG.DOM.CHARTS.SPEAKING_TIME];
        chartIds.forEach(id => {
            const chartInstance = Chart.getChart(id);
            if (chartInstance) {
                chartInstance.destroy();
            }
        });
    }
}
// Initializes the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    applyThemeFromConfig();
    App.init();
});