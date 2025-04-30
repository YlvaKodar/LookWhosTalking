/**
 * Head config for Look Who's Talking app
 */

const CONFIG = {
    //App info:
    APP_NAME: "Look Who's Talking",
    APP_VERSION: "1.0.0",

    //Genders:
    GENDERS: {
        types: ['men', 'women', 'nonbinary'],
        labels: {
            men: 'Män',
            women: 'Kvinnor',
            nonbinary: 'Icke-binära',
        },
        colors: {
            men: '#d5680d',
            women: '#2f0402',
            nonbinary: '#701e11',
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

    //Local keys:
    STORAGE: {
        CURRENT_MEETING: 'currentMeeting',
        COMPLETED_MEETING: 'completedMeeting',
        SETUP_MEETING_DATA: 'setupMeetingData'
    },

    // Timer-settings
    TIMER: {
        UPDATE_INTERVAL: 100, // millisekunder
        UPDATE_ANIMATION_FRAME: true, // använd requestAnimationFrame istället för setInterval om true
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
        }
    },

    //Error messages:
    ERRORS: {
        MIN_PARTICIPANTS: 'Inget möte utan minst två deltagare.',
        MEETING_NAME_REQUIRED: 'Vad ska vi kalla mötet?',
        DATE_REQUIRED: 'Vilken dag är det?',
        POPUP_BLOCKED: 'Timer-fönstret blockerades. Kontrollera dina popup-inställningar.',
        TIMER_COMMUNICATION: 'Problem med kommunikationen mellan timer-fönster och huvudfönster.'
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
            MEN: 'men-speaking',
            WOMEN: 'women-speaking',
            NON_BINARY: 'nonbinary-speaking',
            PAUSE: 'pause-meeting',
            END: 'end-meeting',
            POPUP_MEN: 'popup-men-speaking',
            POPUP_WOMEN: 'popup-women-speaking',
            POPUP_NON_BINARY: 'popup-nonbinary-speaking',
            POPUP_PAUSE: 'popup-pause-meeting',
            POPUP_END: 'popup-end-meeting'
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
        }
    },

    // URL settings:
    URLS: {
        TIMER_WINDOW: 'timer.html',
        TIMER_WINDOW_FEATURES: 'width=300,height=400,resizable=yes,status=no,location=no,menubar=no'
    },

    // UI Theme configuration
    THEME: {
        // Colors
        COLORS: {
            PRIMARY: 'rgb(213,104,13)',
            PRIMARY_HOVER: '#672907',
            HEADER_BG: '#2f0402',
            BORDER: '#2f0402',
            POPUP_BORDER: '#2f0402',
            POPUP_BUTTON: '#d5680d',
            ACTIVE_BORDER: '#fdecdf'
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
        }
    }
};