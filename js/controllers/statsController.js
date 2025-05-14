/**
 * Controller for the statistics view screen.
 * Handles statistics calculation and formatting for meeting data.
 * Coordinates with StatsView for display and visualization.
 * @class
 */
class StatsController {
    /**
     * Initializes the statistics controller with model data and view reference.
     * @param {Meeting} meeting - The meeting model object containing speaking data
     * @param {StatsView} view - The associated view for UI updates
     * @constructor
     */
    constructor(meeting, view) {
        if (!meeting || typeof meeting !== 'object') {
            throw new Error(CONFIG.MESSAGES.CONSOLE.ERROR_PARSE_MEETING);
        }

        this.meeting = meeting;
        this.view = view;
        this.stats = this.calculateStats();

        this.initEventSubscriptions();
        this.updateView();
    }

    /**
     * Subscribe to relevant events on the EventBus.
     * Sets up communication channels with other components.
     * @returns {void}
     */
    initEventSubscriptions() {
        // Subscribe to events that might require re-calculation of statistics
        eventBus.subscribe(CONFIG.COMMUNICATION.ACTIONS.MEETING_ENDED, () => {
            this.refreshData();
        });
    }

    /**
     * Refreshes the meeting data from storage and recalculates statistics.
     * Called when meeting data may have been updated externally.
     * @returns {void}
     */
    refreshData() {
        const updatedMeeting = StorageManager.getCurrentMeeting();
        if (updatedMeeting) {
            this.meeting = updatedMeeting;
            this.stats = this.calculateStats();
            this.updateView();
        }
    }

    /**
     * Updates the view with current statistics data.
     * Triggers chart rendering and text statistics display.
     * @returns {void}
     */
    updateView() {
        if (this.view && this.stats) {
            this.view.renderCharts(this.stats);
            this.view.displayTextStats(this.stats);
        }
    }

    /**
     * Calculates comprehensive meeting statistics based on speaking data.
     * Processes raw speaking time data to provide insights about gender distribution,
     * speaking patterns, and fairness analysis of participation.
     *
     * @returns {Object} Statistics object containing various metrics defined in CONFIG.STATS.STRUCTURE
     */
    calculateStats() {
        const stats = {};
        //Initialize stats object structure using CONFIG
        stats[CONFIG.STATS.STRUCTURE.TOTAL_TIME] = 0;
        stats[CONFIG.STATS.STRUCTURE.GENDER_TIME] = {};
        stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT] = {};
        stats[CONFIG.STATS.STRUCTURE.AVG_DURATION] = {};
        stats[CONFIG.STATS.STRUCTURE.TIME_PER_PARTICIPANT] = {};
        stats[CONFIG.STATS.STRUCTURE.FAIR_DISTRIBUTION] = {};

        //Initialize with gender types from config
        CONFIG.GENDERS.types.forEach(gender => {
            stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender] = 0;
            stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender] = 0;
            stats[CONFIG.STATS.STRUCTURE.AVG_DURATION][gender] = 0;
            stats[CONFIG.STATS.STRUCTURE.TIME_PER_PARTICIPANT][gender] = 0;
            stats[CONFIG.STATS.STRUCTURE.FAIR_DISTRIBUTION][gender] = 0;
        });

        //Calculate statistics for each gender
        CONFIG.GENDERS.types.forEach(gender => {
            const times = this.meeting.speakingData[gender];
            stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender] = times.length;
            stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender] = times.reduce((sum, time) => sum + time, 0);
            stats[CONFIG.STATS.STRUCTURE.TOTAL_TIME] += stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender];
        });

        //Calculate average statement duration for each gender (per statement and per participant)
        CONFIG.GENDERS.types.forEach(gender => {
            //speaking time / number of statements = avrg. statement duration
            if (stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender] > 0) {
                stats[CONFIG.STATS.STRUCTURE.AVG_DURATION][gender] =
                    stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender] /
                    stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender];
            }

            //speaking time / number of participants = avrg. speaking time per participant
            const participantCount = this.meeting.participants[gender];
            if (participantCount > 0) {
                stats[CONFIG.STATS.STRUCTURE.TIME_PER_PARTICIPANT][gender] =
                    stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender] / participantCount;
            }
        });

        //Calculate fair distribution based on participant counts (for comparison)
        const totalParticipants = CONFIG.GENDERS.types.reduce(
            (sum, gender) => sum + this.meeting.participants[gender], 0);

        if (totalParticipants > 0) {
            CONFIG.GENDERS.types.forEach(gender => {
                const fairPercentage = this.meeting.participants[gender] / totalParticipants;
                stats[CONFIG.STATS.STRUCTURE.FAIR_DISTRIBUTION][gender] =
                    stats[CONFIG.STATS.STRUCTURE.TOTAL_TIME] * fairPercentage;
            });
        }
        return stats;
    }

    /**
     * Formats time in seconds to human-readable MM:SS format.
     * Uses configuration settings for consistent formatting.
     * @param {number} seconds - Time duration in seconds
     * @returns {string} Formatted time string (MM:SS)
     */
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return CONFIG.FORMATTING.TIME.DEFAULT_DISPLAY;

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${mins.toString().padStart(CONFIG.FORMATTING.TIME.PAD_LENGTH, CONFIG.FORMATTING.TIME.PAD_CHAR)}${CONFIG.FORMATTING.TIME.TIME_SEPARATOR}${secs.toString().padStart(CONFIG.FORMATTING.TIME.PAD_LENGTH, CONFIG.FORMATTING.TIME.PAD_CHAR)}`;
    }

    /**
     * Exports the meeting statistics as a PDF file.
     * Uses the html2pdf library to generate a PDF from the statistics content.
     * @returns {Promise<void>} A promise that resolves when the PDF has been generated
     */
    async exportToPdf() {
        try {
            console.log('Starting PDF export process...');

            // Get the stats container element that's already in the DOM
            const statsContainer = document.querySelector('.stats-container');

            if (!statsContainer) {
                console.error('Stats container not found in DOM');
                this.view.showAlert('Error: Stats container not found');
                return;
            }

            console.log('Stats container found:', statsContainer);

            // Basic PDF options
            const options = {
                margin: 10, // Behåll detta oförändrat för tillfället
                filename: 'meeting-stats.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    scrollY: 0, // Viktigt - förhindrar tomrum från scroll-position
                    y: 0        // Viktigt - börjar från toppen av elementet
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            console.log('Generating PDF with options:', options);

            // Generate and download the PDF
            await html2pdf()
                .from(statsContainer)
                .set(options)
                .save();

            console.log('PDF generated successfully');
            this.view.showAlert('PDF exported successfully!');

        } catch (error) {
            console.error('Error exporting PDF:', error);
            this.view.showAlert('Error exporting PDF: ' + error.message);
        }
    }

    /**
     * Cleans up resources when the controller is no longer needed.
     * Unsubscribes from events to prevent memory leaks.
     * @returns {void}
     */
    cleanup() {
        eventBus.clear(CONFIG.COMMUNICATION.ACTIONS.MEETING_ENDED);
    }
}