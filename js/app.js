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
        this.activeControllers = {};

        this.setupGlobalNavigationListener(CONFIG.DOM.BUTTONS.NEW_MEETING, CONFIG.DOM.SCREENS.SETUP);
        this.setupGlobalNavigationListener(CONFIG.DOM.BUTTONS.END_MEETING, CONFIG.DOM.SCREENS.STATS);
        this.setupGlobalNavigationListener(CONFIG.DOM.BUTTONS.BACK_TO_START, CONFIG.DOM.SCREENS.START);

        this.setUpStartScreenButtons();

        this.navigateTo(CONFIG.DOM.SCREENS.START);
        this.checkForCurrentMeeting();
    }
    /**
     * Sets up navigation for elements that don't require validation.
     * @static
     * @param {string} elementId - ID for the navigation triggering element.
     * @param {string} screenId - ID for the destination screen.
     * @returns {void}
     */
    static setUpStartScreenButtons(){
        document.getElementById(CONFIG.DOM.BUTTONS.ABOUT).addEventListener('click', () => {
            AlertManager.showAlert(CONFIG.MESSAGES.ALERT.ABOUT.CONTENT);
        })

        document.getElementById(CONFIG.DOM.BUTTONS.HOW_TO_USE).addEventListener('click', () => {
            AlertManager.showAlert(CONFIG.MESSAGES.ALERT.HOW_TO_USE.CONTENT);
        });
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
                    StorageManager.clearMeetingData();
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
                if (validationCallback && !validationCallback()) {
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

            const setupData = StorageManager.getSetupMeetingData();
            const currentMeeting = StorageManager.getCurrentMeeting();

            if (!setupData && !currentMeeting) {
                alert(CONFIG.MESSAGES.ALERT.ERROR_MEETING_DATA_REQUIRED);
                screenId = CONFIG.DOM.SCREENS.SETUP;
                return;
            }

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

        this.cleanupActiveControllers();


        document.querySelectorAll('.screen').forEach(element => {
            element.style.display = CONFIG.DOM.DISPLAY.NONE;
        });

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.style.display = CONFIG.DOM.DISPLAY.BLOCK;
        } else {
            console.error(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + screenId);
            return;
        }

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
                break;

            case CONFIG.DOM.SCREENS.SETUP:
                const setupView = new SetupView();
                if (setupView.controller) {
                    this.activeControllers.setup = setupView.controller;
                }
                break;

            case CONFIG.DOM.SCREENS.MEETING:
                const meetingView = new MeetingView();
                if (meetingView.controller) {
                    this.activeControllers.meeting = meetingView.controller;
                }
                break;

            case CONFIG.DOM.SCREENS.STATS:
                const statsView = new StatsView();
                if (statsView.controller) {
                    this.activeControllers.stats = statsView.controller;
                }
                break;

            default:
                console.warn(CONFIG.MESSAGES.CONSOLE.VIEW_UNDEFINED + screenId);
        }
    }

    /**
     * Checks for active current meetings and handles them appropriately.
     * If found, asks user if they want to continue meeting, else delete the data.
     * @static
     * @returns {void}
     */
    static checkForCurrentMeeting() {

        const data = localStorage.getItem(CONFIG.STORAGE.KEYS.CURRENT_MEETING);

        if (data){
            try {
                const meeting = JSON.parse(data);

                if (meeting && meeting.active){
                    AlertManager.showConfirm(CONFIG.MESSAGES.CONFIRM.CONTINUE_MEETING, (confirmed) => {
                        if (confirmed) {
                            this.navigateTo(CONFIG.DOM.SCREENS.MEETING);
                        } else {
                            StorageManager.clearMeetingData();
                        }
                    });
                } else if (meeting) {
                    StorageManager.clearMeetingData();
                }

            } catch (error) {
                console.error(CONFIG.MESSAGES.CONSOLE.ERROR_PARSE_MEETING, error);
                AlertManager.showAlert(CONFIG.MESSAGES.ALERT.ERROR_LOADING_MEETING);
                StorageManager.clearMeetingData();
            }
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
        const chartIds = [
            CONFIG.DOM.CHARTS.PARTICIPANTS,
            CONFIG.DOM.CHARTS.SPEAKING_TIME,
            CONFIG.DOM.CHARTS.INTERVENTIONS
        ];
        chartIds.forEach(id => {
            const chartInstance = Chart.getChart(id);
            if (chartInstance) {
                chartInstance.destroy();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyThemeFromConfig();
    App.init();
});