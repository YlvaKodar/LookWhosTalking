/**
 * Head config for Look Who's Talking app
 */

const CONFIG = {
    //App info:
    APP_NAME: "Look Who's Talking",
    APP_VERSION: "1.0.0",

    LABELS: {
        PARTICIPANTS: "participants",

        TIMER_POPOUT_BUTTON: "Open popout timer tool",
        PAUSE_MEETING_BUTTON: "Pause",
        END_MEETING_BUTTON: "Meeting ended",
        NEW_MEETING_BUTTON: "New meeting",
        BACK_TO_START: "Back to start",
        START_BUTTON: "Start meeting",


    },

    //Genders:
    GENDERS: {
        types: ['men', 'women', 'nonbinary'],
        labels: {
            men: 'Män',
            women: 'Kvinnor',
            nonbinary: 'Icke-binära',
        },
        colors: {
            men: '#D68D0A',
            women: '#a82b05',
            nonbinary: '#420407',
        },
        buttonLabels: {
            men: 'Man speaking',
            women: 'Woman speaking',
            nonbinary: 'Non-binary speaking',
        },
    },
    //Meeting settings
    MEETING: {
        MIN_PARTICIPANTS: 2,
    },

    //Local keys:
    STORAGE: {
        KEYS: {
            CURRENT_MEETING: 'currentMeeting',
            SETUP_MEETING_DATA: 'setupMeetingData'
        }
    },

    // Timer settings
    TIMER: {
        UPDATE_INTERVAL: 100,
        SAVE_INTERVAL: 1000,
        DEFAULT_DISPLAY: "00:00",
        UPDATE_ANIMATION_FRAME: false,
    },

    COMMUNICATION: {
        ACTIONS: {
            SPEAKER_CHANGE: 'speakerChange',
            SPEAKER_PAUSED: 'speakerPaused',
            MEETING_ENDED: 'meetingEnded'
        },
        WINDOW: {
            TO_TIMER: {
                INIT: 'timerWindow.init',
                SPEAKER_CHANGE: 'toTimerWindow.speakerChanged',
                SPEAKER_PAUSED: 'toTimerWindow.speakerPaused',
            },
            TO_MAIN: {
                SPEAKER_CHANGE: 'toMainWindow.speakerChanged',
                SPEAKER_PAUSED: 'toMainWindow.speakerPaused',
                MEETING_ENDED: 'toMainWindow.meetingEnded',
                WINDOW_READY: 'timerWindow.ready',
            }
        },
        MESSAGE_TYPES: {
            EVENT: 'event',
            INIT: 'init'
        },
        INIT_DATA: {
            MEETING: 'meeting',
            VISIBLE_BUTTONS: 'visibleButtons'
        }
    },

    //Popout
    TIMER_POPOUT_DOM: {
        TITLE: 'timer-popup-title',
        TITLE_LABEL: 'TINY TIMER TOOL',
        BUTTON_TEXT: 'Pop Out Timer',
        BUTTON_CLASS: 'pop-out-btn',
        MEETING_INFO: 'meeting-info',
        BODY_CLASS: 'timer-popup-body',
        DISPLAY: 'popup-timer-display',
        BUTTONS: {
            MEN: 'popup-men-speaking',
            WOMEN: 'popup-women-speaking',
            NON_BINARY: 'popup-nonbinary-speaking',
            PAUSE: 'popup-pause-meeting',
            END: 'popup-end-meeting',
        },
    },

    // Chart.js settings:
    CHART: {
        pieOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        },
        COLORS: {
            OVER: '#ff6666',  // For showing speaking over fair time
            UNDER: '#66ff66'  // For showing speaking under fair time
        },
        TYPES: {
            SPEAKING_TIME_DISTRIBUTION: 'pie'
        },
    },

    //Messages:
    MESSAGES: {
        CONSOLE: {
            ELEMENT_NOT_FOUND: 'Error: The following element could not be found: ',
            VIEW_UNDEFINED: 'No view controller defined for screen: ',
            ERROR_PARSE_MEETING: 'Error parsing completed meeting data: ',
            ERROR_OPENER_ACCESS: 'Error: Could not access window opener: ',
            ERROR_LOCALSTORAGE: "Error: Could not load from localStorage: ",
            ERROR_SAVE_TO_LOCAL: "Error: Could not save to localStorage: ",
            ERROR_NOTIFY_MAIN: "Error: Could not notify main window: ",
            ERROR_END_MEETING: "Error: Could not end meeting: ",
            UPDATE_TIMER_WINDOW: "Received update from timer window: ",
            ERROR_TIMER_COMMUNICATION: 'Could not communicate with timer window.',
            ERROR_UPDATE_TIMER_WINDOW: "Error updating timer window: ",
            ERROR_EVENT_SUBSCRIBER: 'Error in event subscriber for this event: ',
            ERROR_UNKNOWN_TYPE: 'Error: Unknown message type: ',
            ERROR_POST_MESSAGE:'Error: Could not handle posted message: ',
        },

        CONFIRM: {
            CONTINUE_MEETING: 'Oh dear, looks like we have data from an interrupded meeting. Wanna pick up where you left off?',
            CLOSE_WINDOW: 'If you close this window, you might loose all data from this meeting. Is it really worth it?',
        },

        ALERT: {
            MEETING_COMPLETED: "Meeting completed. Head back to the main window to see meeting statistics.",
            ERROR_PARSE_MEETING: 'Sorry, we can\'t find your meeting.',
            ERROR_POPUP_BLOCKED: 'Tiny timer tool is blocked. Please check your browser settings or use the main window timer.',
            ERROR_MEETING_NAME_REQUIRED: 'Your meeting needs a name.',
            ERROR_DATE_REQUIRED: 'What day is it?',
            ERROR_MEETING_DATA_REQUIRED: 'No meeting find ... Please fill out the form.',
            ERROR_SAVE_TO_LOCAL: 'We\' re sorry but we fail to save to the local storage ... Maybe check your browser settings or try another browser.',
            get ERROR_MIN_PARTICIPANTS() {
                return `No meeting without at least ${CONFIG.MEETING.MIN_PARTICIPANTS} meeters.`;
            },
        },
    },

    //Default values:
    DEFAULTS: {
        MEETING_NAME: 'Ett högt berg.'
    },

    // Element ID for important DOM elements:
    DOM: {
        SCREENS: {
            START: 'start-screen',
            SETUP: 'setup-screen',
            MEETING: 'meeting-screen',
            STATS: 'stats-screen'
        },
        TIMER: {
            DISPLAY: 'timer-display',
        },
        BUTTONS: {
            NEW_MEETING: 'new-meeting-btn',
            BACK_TO_START: 'back-to-start',
            END_MEETING: 'end-meeting',
            MEN: 'men-speaking',
            WOMEN: 'women-speaking',
            NON_BINARY: 'nonbinary-speaking',
            PAUSE: 'pause-meeting',
            TIMER_POPOUT: 'timer-popup-btn'
        },
        LABELS: {

        },
        CHARTS: {
            SPEAKING_TIME: 'speaking-time-chart'
        },
        STATS: {
            TOTAL_TIME: 'total-time',
            GENDER_STATS: 'gender-stats',
            FAIR_DISTRIBUTION: 'fair-distribution'
        },
        FORM: {
            MEETING_NAME: 'meeting-name',
            MEETING_DATE: 'meeting-date',
            MEN_COUNT: 'men-count',
            WOMEN_COUNT: 'women-count',
            NONBINARY_COUNT: 'nonbinary-count',
            START_BUTTON: 'start-meeting'
        },
        DISPLAY: {
            NONE: 'none',
            BLOCK: 'block',
        }
    },

    STATS: {
        STRUCTURE: {
            TOTAL_TIME: 'totalSpeakingTime',
            GENDER_TIME: 'genderSpeakingTime',
            STATEMENTS_COUNT: 'genderStatmentCount',
            AVG_DURATION: 'genderStatmentDurationAverage',
            TIME_PER_PARTICIPANT: 'genderSpeakingTimePerParticipant',
            FAIR_DISTRIBUTION: 'fairDistribution'
        },
        DISPLAY: {
            HEADER_CLASSES: 'stats-header',
            GENDER_STAT_CLASS_PREFIX: 'stats-',
            OVER_CLASS: 'over',
            UNDER_CLASS: 'under'
        },
        LABELS: {
            FAIR_DISTRIBUTION_HEADER: 'Rättvis fördelning',
            SPEAKING_TIME: 'Talartid',
            STATEMENTS_COUNT: 'Antal inlägg',
            AVG_LENGTH: 'Genomsnittlig längd',
            MORE_THAN_FAIR: 'mer än rättvist',
            LESS_THAN_FAIR: 'mindre än rättvist',
            FAIR_LABEL: 'rättvist'
        },
    },

    // URL settings:
    URLS: {
        TIMER_WINDOW: 'timer.html',
        TIMER_WINDOW_FEATURES: 'width=300,height=400,resizable=yes,status=no,location=no,menubar=no'
    },

    FORMATTING: {
        TIME: {
            DEFAULT_DISPLAY: '00:00',
            TIME_SEPARATOR: ':',
            PAD_CHAR: '0',
            PAD_LENGTH: 2
        }
    },

    // UI Theme configuration
    THEME: {
        // Colors
        COLORS: {
            PRIMARY: '#385b13',
            PRIMARY_HOVER: '#5a9120',
            HEADER_BG: '#2f0402',
            BORDER: '#1f0b0a',
            POPUP_BORDER: '#2f0402',
            POPUP_BUTTON: '#882b07',
            ACTIVE_BORDER: '#442d6b'
        },

        // Sizing and dimensions
        SIZING: {
            BODY_MAX_WIDTH: '800px',
            CONTAINER_PADDING: '20px',
            ELEMENT_GAP: '20px',
            BUTTON_PADDING: '10px 20px',
            POPUP_MIN_WIDTH: '250px',
            POPUP_MIN_HEIGHT: '200px',
            CHART_MAX_WIDTH: '400px'
        },

        // Typography
        TYPOGRAPHY: {
            TIMER_FONT_SIZE: '48px',
            POPUP_TIMER_FONT_SIZE: '28px',
            BUTTON_FONT_SIZE: '16px',
            SPEAKER_BUTTON_FONT_SIZE: '18px',
            POPUP_FONT_SIZE: '14px'
        },

        // Border styling
        BORDERS: {
            RADIUS: '4px',
            POPUP_RADIUS: '6px',
            ACTIVE_BORDER_WIDTH: '3px'
        },

        // Responsive breakpoints
        BREAKPOINTS: {
            MOBILE: '600px'
        },

        CSS_CLASSES: {
            ACTIVE: 'active',
        },

        POPUP: {
            BG_COLOR: '#ffffff',
            TEXT_COLOR: '#333333',
            TITLE_COLOR: '#2f0402',
            PADDING: '15px',
            MAX_WIDTH: '300px',
            TITLE_FONT_SIZE: '18px',
            INFO_FONT_SIZE: '14px'
        }
    }
};