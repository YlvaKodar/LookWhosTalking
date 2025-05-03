/**
 * Head config for Look Who's Talking app
 */

const CONFIG = {
    //App info:
    APP_NAME: "Look Who's Talking",
    APP_VERSION: "1.0.0",

    LABELS: {
        PARTICIPANTS: "deltagare",
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
            men: 'Man talar',
            women: 'Kvinna talar',
            nonbinary: 'Icke-binär talar'
        },
        popupButtonLabels: {
            men: 'Man',
            women: 'Kvinna',
            nonbinary: 'Icke-binär'
        }
    },
    //Meeting settings
    MEETING: {
        MIN_PARTICIPANTS: 2,
    },

    //Local keys:
    STORAGE: {
        KEYS: {
            CURRENT_MEETING: 'currentMeeting',
            COMPLETED_MEETING: 'completedMeeting',
            SETUP_MEETING_DATA: 'setupMeetingData'
        }
    },

    // Timer settings
    TIMER: {
        UPDATE_INTERVAL: 100,
        SAVE_INTERVAL: 1000,
        DEFAULT_DISPLAY: "00:00",
        UPDATE_ANIMATION_FRAME: true,
    },

    COMMUNICATION: {
        ACTIONS: {
            SPEAKER_CHANGE: 'speakerChange',
            SPEAKER_PAUSED: 'speakerPaused',
            MEETING_ENDED: 'meetingEnded'
        }
    },

    //Popup
    TIMER_POPUP: {
        TITLE: 'Tiny timer tool',
        BUTTON_TEXT: 'Pop Out Timer',
        BUTTON_CLASS: 'pop-out-btn',
        DOM: {
            TITLE: 'timer-popup-title',
            MEETING_INFO: 'meeting-info',
            BODY_CLASS: 'timer-popup-body'
        },
        LABELS: {
            get MEN_BUTTON() {
              return `${CONFIG.GENDERS.buttonLabels.men}`;
            },
            get WOMEN_BUTTON() {
                return `${CONFIG.GENDERS.buttonLabels.women}`;
            },
            get NONBINARY_BUTTON() {
                return `${CONFIG.GENDERS.buttonLabels.nonbinary}`;
            },
            PAUSE_BUTTON: "Paus",
            END_BUTTON: "Avsluta möte"
        }
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
            ERROR_NOTIFY_MAIN: "Error: Could not notify main window: ",
            ERROR_END_MEETING: "Error: Could not end meeting: ",
            UPDATE_TIMER_WINDOW: "Received update from timer window: ",
            ERROR_TIMER_COMMUNICATION: 'Could not communicate with timer window.',
            ERROR_UPDATE_TIMER_WINDOW: "Error updating timer window: ",
        },

        CONFIRM: {
            VIEW_STATS: 'Det finns statistik från ett avslutat möte. Vill du se den?',
        },

        ALERT: {
            MEETING_COMPLETED: "Mötet avslutas. Återvänd till huvudfönstret för att se mötesstatistiken.",
            ERROR_PARSE_MEETING: 'Mötet kan inte hittas.',
            ERROR_POPUP_BLOCKED: 'Timer-fönstret blockerades. Kontrollera dina popup-inställningar.',
            ERROR_MEETING_NAME_REQUIRED: 'Vad ska vi kalla mötet?',
            ERROR_DATE_REQUIRED: 'Vilken dag är det?',
            get ERROR_MIN_PARTICIPANTS() {
                return `Inget möte utan minst ${CONFIG.MEETING.MIN_PARTICIPANTS} deltagare.`;
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
            POPUP_DISPLAY: 'popup-timer-display'
        },
        BUTTONS: {
            NEW_MEETING: 'new-meeting-btn',
            BACK_TO_START: 'back-to-start',
            END_MEETING: 'end-meeting',
            MEN: 'men-speaking',
            WOMEN: 'women-speaking',
            NON_BINARY: 'nonbinary-speaking',
            PAUSE: 'pause-meeting',
            POPUP_MEN: 'popup-men-speaking',
            POPUP_WOMEN: 'popup-women-speaking',
            POPUP_NON_BINARY: 'popup-nonbinary-speaking',
            POPUP_PAUSE: 'popup-pause-meeting',
            POPUP_END: 'popup-end-meeting',
            TIMER_POPUP: 'timer-popup-btn'
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