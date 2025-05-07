/**
 * Main controller for the "Look Who's Talking" application.
 * Handles initialization, navigation between screens, and application lifecycle.
 * Coordinates controllers for different application views.
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
        //Store active controllers for resource management
        this.activeControllers = {};

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
                    StorageManager.clearMeetingData(); // Clear all meeting data
                    this.cleanupActiveControllers()
                }
                this.navigateTo(screenId);
            });
        } else {
            console.warn(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + elementId);
        }

    }
    /**
     * Sets up button that requires form validation before navigation.
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
     * Cleans up previous controllers and initializes the correct controller for the new view.
     * @static
     * @param {string} screenId - ID for the destination screen
     * @returns {void}
     */
    static navigateTo(screenId) {
        if (screenId === CONFIG.DOM.SCREENS.MEETING) {
            //Check if there's valid meeting data
            const setupData = StorageManager.getSetupMeetingData();
            const currentMeeting = StorageManager.getCurrentMeeting();

            if (!setupData && !currentMeeting) {
                alert(CONFIG.MESSAGES.ALERT.ERROR_MEETING_DATA_REQUIRED);
                screenId = CONFIG.DOM.SCREENS.SETUP; //Redirect to setup instead
                return;
            }

            //If we have setup data but no active meeting, create a meeting from setup data
            if (setupData && !currentMeeting) {
                const meeting = new Meeting(setupData.name, setupData.date);
                meeting.setParticipants(
                    setupData.participants[CONFIG.GENDERS.types[0]] || 0,
                    setupData.participants[CONFIG.GENDERS.types[1]] || 0,
                    setupData.participants[CONFIG.GENDERS.types[2]] || 0
                );
                StorageManager.saveMeeting(meeting);
            }
        }

        //Clean up any active controllers before changing screens
        this.cleanupActiveControllers();


        document.querySelectorAll('.screen').forEach(element => {
            element.style.display = CONFIG.DOM.DISPLAY.NONE;
        });

        //Show the target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.style.display = CONFIG.DOM.DISPLAY.BLOCK;
        } else {
            console.error(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + screenId);
            return;
        }

        //Initialize the appropriate controller for the screen
        this.initializeController(screenId);
    }

    /**
     * Initializes the appropriate controller for the current screen.
     * Creates the associated view if needed and wires everything together.
     * @static
     * @param {string} screenId - ID for the current screen
     * @returns {void}
     */
    static initializeController(screenId) {
        switch(screenId) {
            case CONFIG.DOM.SCREENS.START:
                //Start screen doesn't need a controller
                break;

            case CONFIG.DOM.SCREENS.SETUP:
                //Create SetupView and store its controller reference
                const setupView = new SetupView();
                //Store controller reference for cleanup
                if (setupView.controller) {
                    this.activeControllers.setup = setupView.controller;
                }
                break;

            case CONFIG.DOM.SCREENS.MEETING:
                //Create MeetingView and store its controller reference
                const meetingView = new MeetingView();
                //Store controller reference for cleanup
                if (meetingView.controller) {
                    this.activeControllers.meeting = meetingView.controller;
                }
                break;

            case CONFIG.DOM.SCREENS.STATS:
                //Create StatsView and store its controller reference
                const statsView = new StatsView();
                //Store controller reference for cleanup
                if (statsView.controller) {
                    this.activeControllers.stats = statsView.controller;
                }
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

                    // Create a proper Meeting object
                    const meeting = new Meeting(
                        meetingData.name || CONFIG.DEFAULTS.MEETING_NAME,
                        meetingData.date || new Date().toISOString().split('T')[0]
                    );

                    // Copy participant data
                    meeting.participants = meetingData.participants || {
                        [CONFIG.GENDERS.types[0]]: 0,
                        [CONFIG.GENDERS.types[1]]: 0,
                        [CONFIG.GENDERS.types[2]]: 0
                    };

                    // Copy speaking data
                    meeting.speakingData = meetingData.speakingData || {
                        [CONFIG.GENDERS.types[0]]: [],
                        [CONFIG.GENDERS.types[1]]: [],
                        [CONFIG.GENDERS.types[2]]: []
                    };

                    // Save the meeting and navigate to stats
                    StorageManager.saveMeeting(meeting);
                    App.navigateTo(CONFIG.DOM.SCREENS.STATS);
                } catch (error) {
                    console.error(CONFIG.MESSAGES.CONSOLE.ERROR_PARSE_MEETING + error);
                    alert(CONFIG.MESSAGES.ALERT.ERROR_LOADING_MEETING);
                }
            }

            //Clear the completed meeting data
            localStorage.removeItem(CONFIG.STORAGE.KEYS.COMPLETED_MEETING);
        }
    }

    /**
     * Cleans up all active controllers to prevent memory leaks.
     * @static
     * @returns {void}
     */
    static cleanupActiveControllers() {
        // Call cleanup methods on any active controllers
        Object.values(this.activeControllers).forEach(controller => {
            if (controller && typeof controller.cleanup === 'function') {
                controller.cleanup();
            }
        });

        // Reset the active controllers object
        this.activeControllers = {};

        //Clean up any Chart.js instances
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