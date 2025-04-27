/**
 * Head config for Look Who's Talking app
 */

export const CONFIG = {
    //App info:
    APP_NAME: "Look Who's Talking",
    APP_VERSION: "1.0.0",

    //Genders:
    GENDERS: {
        types: ['men', 'women', 'nonBinary'],
        labels: {
            men: 'Män',
            women: 'Kvinnor',
            nonBinary: 'Icke-binära',
        },
        colors: {
            men: '#322942',
            women: '#5e2d37',
            nonBinary: '#214b4d',
        },
        buttonLabels: {
            men: 'Man talar',
            women: 'Kvinna talar',
            nonBinary: 'Icke-binär talar'
        },
        popupButtonLabels: {
            men: 'Man',
            women: 'Kvinna',
            nonBinary: 'Icke-binär'
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
    }
};