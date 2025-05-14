/**
 * Head config for Look Who's Talking app
 */
const COLOR_PALETTE = {
    PRIMARY: '#281848',
    PRIMARY_HOVER: '#42277c',

    SECONDARY: '#183b48',
    SECONDARY_HOVER: '#296d85',

    TERTIARY: '#2f0402',
    TERTIARY_HOVER: '#690905',

    // Secondary/UI colors
    HEADER_BG: '#a82b05',
    BORDER: '#420407',
    ACTIVE_BORDER: '#2f1848',

    // Gender-specific colors
    MEN: '#be7e0a',
    WOMEN: '#a82b05',
    NONBINARY: '#420407',

    // Text colors
    TEXT_DARK: '#333333',
    TEXT_LIGHT: '#ffffff',

    // Background and overlay colors
    BG_LIGHT: '#ffffff',
    OVERLAY: 'rgba(0, 0, 0, 0.5)',

    // Shadows
    SHADOW_MEDIUM: '0 0 10px rgba(0, 0, 0, 0.3)'
};

const CONFIG = {
    //App info:
    APP_NAME: "Look Who's Talking",
    APP_VERSION: "1.0.0",

    LABELS: {
        PARTICIPANTS: "participants",

        NEW_MEETING_BUTTON: "New meeting",
        ABOUT_BUTTON: "About",
        HOW_TO_USE_BUTTON: "How to use",

        TIMER_POPOUT_BUTTON: "Open tiny timer",
        HOW_TO_USE_TIMER_BUTTON: "How to use",
        PAUSE_MEETING_BUTTON: "Pause",
        END_MEETING_BUTTON: "Meeting ended",

        BACK_TO_START: "Back to start",
        START_BUTTON: "Start meeting",

        ALERT_OK_BUTTON: "OK",
        ALERT_OK_BUTTON_CONFIRM: "Yes please",
        ALERT_CANCEL_BUTTON: "Cancel",

        HEADINGS: {
            START_HEAD_FIRST: 'LOOK WHO\'S TALKING',
            START_HEAD_SEC: 'Timing tool for mixed-gender conversations',

            SETUP_HEAD: 'LET\' S SET IT UP',
            SETUP_FORM_HEAD_FIRST: 'About this meeting:',
            SETUP_FORM_HEAD_SEC: 'We\'ll need a participant count:',

            STATS_HEAD: 'MEETING STATISTICS',
        },

        CHART_TITLES: {
            PARTICIPANTS: 'Meeting participants:',
            SPEAKING_TIME: 'Speaking time distribution:',
            INTERVENTIONS: 'Statement distribution:',
        },
    },

    //Genders:
    GENDERS: {
        types: ['men', 'women', 'nonbinary'],
        labels: {
            men: 'Men',
            women: 'Women',
            nonbinary: 'Non-binary',
        },
        colors: {
            men: COLOR_PALETTE.MEN,
            women: COLOR_PALETTE.WOMEN,
            nonbinary: COLOR_PALETTE.NONBINARY,
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
            ERROR_POPOUT_BLOCKED: 'Tiny timer tool is blocked. Please check your browser settings or use the main window timer.',
            ERROR_MEETING_NAME_REQUIRED: 'Your meeting needs a name.',
            ERROR_DATE_REQUIRED: 'What day is it?',
            ERROR_MEETING_DATA_REQUIRED: 'No meeting find ... Please fill out the form.',
            ERROR_SAVE_TO_LOCAL: 'We\' re sorry but we fail to save to the local storage ... Maybe check your browser settings (privacy, incognito or storage settings may cause this) or try another browser.',
            get ERROR_MIN_PARTICIPANTS() {
                return `No meeting without at least ${CONFIG.MEETING.MIN_PARTICIPANTS} meeters.`;
            },

            ABOUT: {
                TITLE: "About Look Who's Talking",
                CONTENT: "This web app is a prototype timing tool intended to help you see how speaking time " +
                "is distributed in your meetings. It is free to use, but please remember that this is a prototype " +
                "app, and still under evaluation.",
            },
            HOW_TO_USE: {
                TITLE: "How to use this app",
                CONTENT: "To use this app, just click the \"New meeting\" button and fill in the details. " +
                " (Don't worry, you won't be asked to leave any personal information or create an account.)"  +
                    "Then click \"Start meeting\" and use the timer or the tiny popout timer tool as instructed. " +
                    "Note: Do not close the main window while using the app. \n When the meeting is over, " +
                    "click the \"End meeting\" button to see the statistics.",
            },

            HOW_TO_USE_TIMER: {
                TITLE: "How to use the timer",
                CONTENT: "Easy! Just click the corresponding gender button every time someone new starts talking. " +
                    "Hit the pause button when nobody talks. Look Who's Talking will keep " +
                    "track both of the spoken time and the amount of statements made per gender. " +
                    "\n\nUse the timer in the main window or push the \"Open tiny timer\" button for a " +
                    "smaller timer tool window. But keep in mind that the popout is nothing but a remote control, " +
                    "so do not close the main window." +
                    "\n\n(Tip: You might check your browser settings for options such as \"Always on top\".)",
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
            START_HEAD_FIRST: 'start_heading',
            START_HEAD_SEC: 'start_heading_second',

            SETUP: 'setup-screen',
            SETUP_HEAD: 'setup_heading',
            SETUP_FORM_HEAD_FIRST: 'setup_form_head_1',
            SETUP_FORM_HEAD_SEC: 'setup_form_head_2',


            MEETING: 'meeting-screen',

            STATS: 'stats-screen',
            STATS_HEAD: 'stats_heading',

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
            TIMER_POPOUT: 'timer-popup-btn',
            ABOUT: 'about-btn',
            HOW_TO_USE: 'how-to-use-btn',
            HOW_TO_USE_TIMER: 'how-to-use-timer-btn',
            EXPORT_PDF: 'export-pdf-btn',
        },
        CHARTS: {
            PARTICIPANTS: 'participants-chart',
            SPEAKING_TIME: 'speaking-time-chart',
            INTERVENTIONS: 'interventions-chart',
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
            FAIR_DISTRIBUTION_HEADER: 'Who got there fair share of speaky speaks?',
            SPEAKING_TIME: 'Speaking time',
            STATEMENTS_COUNT: 'Number of statements',
            AVG_LENGTH: 'Average length of statement',
            MORE_THAN_FAIR: 'More than fair share',
            LESS_THAN_FAIR: 'Less than fair share',
            FAIR_LABEL: 'Fair share'
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
            PRIMARY: COLOR_PALETTE.PRIMARY,
            PRIMARY_HOVER: COLOR_PALETTE.PRIMARY_HOVER,
            SECONDARY: COLOR_PALETTE.SECONDARY,
            SECONDARY_HOVER: COLOR_PALETTE.SECONDARY_HOVER,
            TERTIARY: COLOR_PALETTE.TERTIARY,
            TERTIARY_HOVER: COLOR_PALETTE.TERTIARY_HOVER,
            HEADER_BG: COLOR_PALETTE.HEADER_BG,
            BORDER: COLOR_PALETTE.BORDER,
            POPUP_BORDER: COLOR_PALETTE.POPUP_BORDER,
            POPUP_BUTTON: COLOR_PALETTE.SECONDARY,
            ACTIVE_BORDER: COLOR_PALETTE.ACTIVE_BORDER,
            HEADER_FIRST: COLOR_PALETTE.TERTIARY,
            HEADER_SEC: COLOR_PALETTE.SECONDARY,
            HEADER_THIRD: COLOR_PALETTE.PRIMARY,
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
            POPOUT_TIMER_FONT_SIZE: '28px',
            BUTTON_FONT_SIZE: '16px',
            SPEAKER_BUTTON_FONT_SIZE: '18px',
            POPOUT_FONT_SIZE: '14px'
        },

        // Border styling
        BORDERS: {
            RADIUS: '4px',
            POPUP_RADIUS: '6px',
            ACTIVE_BORDER_WIDTH: '3px'
        },

        //Responsive breakpoints
        BREAKPOINTS: {
            MOBILE: '600px'
        },

        CSS_CLASSES: {
            ACTIVE: 'active',
        },

        POPOUT: {
            PADDING: '15px',
            MAX_WIDTH: '300px',
            HEADING_SCALE: 0.8,
        },

        ALERTS: {
            BG_COLOR: COLOR_PALETTE.BG_LIGHT,
            TEXT_COLOR: COLOR_PALETTE.TEXT_DARK,
            OVERLAY_COLOR: COLOR_PALETTE.OVERLAY,
            SHADOW: COLOR_PALETTE.SHADOW_MEDIUM,
            MIN_WIDTH: '300px',
            MAX_WIDTH: '90%',
            PADDING: '20px',
            FONT_SIZE: '16px',
            MARGIN_BOTTOM: '20px',
            OK_BG_COLOR: COLOR_PALETTE.PRIMARY,
            OK_HOVER_COLOR: COLOR_PALETTE.PRIMARY_HOVER,
            CANCEL_BG_COLOR: COLOR_PALETTE.SECONDARY,
            CANCEL_HOVER_COLOR: COLOR_PALETTE.SECONDARY_HOVER,
            BUTTON_MIN_WIDTH: '80px',
            BUTTON_GAP: '10px',
            BORDER_COLOR: COLOR_PALETTE.PRIMARY,
            BORDER_WIDTH: '4px',
            BORDER_STYLE: 'solid',
            Z_INDEX_OVERLAY: 9999,
            Z_INDEX_ALERT: 10000,
        },
    }
};