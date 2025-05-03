/**
 * Controller for the statistics view screen.
 * Calculates and displays meeting statistics including speaking time distribution.
 * @class
 */
class StatsView {
    /**
     * Initializes the statistics view with data from completed meeting.
     * Calculates statistics and renders visualizations.
     * @constructor
     */
    constructor() {
        this.meeting = StorageManager.getCurrentMeeting();
        this.stats = this.calculateStats();

        this.renderCharts();
        this.displayTextStats();
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
     * Renders pie chart visualization of speaking time distribution.
     * Uses Chart.js with configuration options from CONFIG.
     * @returns {void}
     */
    renderCharts() {
        const ctx = document.getElementById(CONFIG.DOM.CHARTS.SPEAKING_TIME).getContext('2d');

        const labels = CONFIG.GENDERS.types.map(gender => CONFIG.GENDERS.labels[gender]);
        const data = CONFIG.GENDERS.types.map(gender =>
            this.stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender]);
        const backgroundColor = CONFIG.GENDERS.types.map(gender => CONFIG.GENDERS.colors[gender]);

        new Chart(ctx, {
            type: CONFIG.CHART.TYPES.SPEAKING_TIME_DISTRIBUTION,
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor
                }]
            },
            options: CONFIG.CHART.pieOptions
        });

        //Todo: more visualization
    }

    /**
     * Displays text-based statistics on the page.
     * Shows total time, per-gender stats, and fair distribution analysis.
     * @returns {void}
     */
    displayTextStats() {
        // Display total meeting time
        document.getElementById(CONFIG.DOM.STATS.TOTAL_TIME).textContent =
            this.formatTime(this.stats[CONFIG.STATS.STRUCTURE.TOTAL_TIME]);

        // Display per-gender statistics
        const genderStatsElement = document.getElementById(CONFIG.DOM.STATS.GENDER_STATS);
        genderStatsElement.innerHTML = '';

        CONFIG.GENDERS.types.forEach(gender => {
            const statsDiv = document.createElement('div');
            statsDiv.className = `${CONFIG.STATS.DISPLAY.GENDER_STAT_CLASS_PREFIX}${gender}`;

            const totalTime = this.formatTime(this.stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender]);
            const interventions = this.stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender];
            const avgTime = this.formatTime(this.stats[CONFIG.STATS.STRUCTURE.AVG_DURATION][gender]);

            statsDiv.innerHTML = `
                <h3>${CONFIG.GENDERS.labels[gender]}</h3>
                <p>${CONFIG.STATS.LABELS.SPEAKING_TIME}: ${totalTime}</p>
                <p>${CONFIG.STATS.LABELS.STATEMENTS_COUNT}: ${interventions}</p>
                <p>${CONFIG.STATS.LABELS.AVG_LENGTH}: ${avgTime}</p>
            `;

            genderStatsElement.appendChild(statsDiv);
        });

        // Display fair distribution analysis
        const fairDistElement = document.getElementById(CONFIG.DOM.STATS.FAIR_DISTRIBUTION);
        fairDistElement.innerHTML = `<h3>${CONFIG.STATS.LABELS.FAIR_DISTRIBUTION_HEADER}</h3>`;

        CONFIG.GENDERS.types.forEach(gender => {
            const actual = this.stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender];
            const fair = this.stats[CONFIG.STATS.STRUCTURE.FAIR_DISTRIBUTION][gender];
            const diff = actual - fair;

            const diffText = diff > 0
                ? `${this.formatTime(diff)} ${CONFIG.STATS.LABELS.MORE_THAN_FAIR}`
                : `${this.formatTime(Math.abs(diff))} ${CONFIG.STATS.LABELS.LESS_THAN_FAIR}`;

            const p = document.createElement('p');
            p.innerHTML = `${CONFIG.GENDERS.labels[gender]}: ${this.formatTime(actual)} (${CONFIG.STATS.LABELS.FAIR_LABEL}: ${this.formatTime(fair)})<br>
                           <span class="${diff > 0 ? CONFIG.STATS.DISPLAY.OVER_CLASS : CONFIG.STATS.DISPLAY.UNDER_CLASS}">${diffText}</span>`;

            fairDistElement.appendChild(p);
        });
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
}