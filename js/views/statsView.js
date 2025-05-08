/**
 * View for the statistics screen.
 * Responsible for rendering charts and displaying statistics.
 * Delegates business logic to StatsController.
 * @class
 */
class StatsView {
    /**
     * Initializes the statistics view with necessary DOM elements.
     * Creates associated controller and sets up event handling.
     * @constructor
     */
    constructor() {
        this.meeting = StorageManager.getCurrentMeeting();

        if (!this.meeting) {
            alert(CONFIG.MESSAGES.ALERT.ERROR_MEETING_DATA_REQUIRED);
            App.navigateTo(CONFIG.DOM.SCREENS.START);
            return;
        }

        this.totalTimeElement = document.getElementById(CONFIG.DOM.STATS.TOTAL_TIME);
        this.genderStatsElement = document.getElementById(CONFIG.DOM.STATS.GENDER_STATS);
        this.fairDistElement = document.getElementById(CONFIG.DOM.STATS.FAIR_DISTRIBUTION);
        this.chartCanvas = document.getElementById(CONFIG.DOM.CHARTS.SPEAKING_TIME);

        this.controller = new StatsController(this.meeting, this);
    }

    /**
     * Renders chart visualizations of meeting statistics.
     * Creates three pie charts for participants, speaking time, and interventions.
     * @param {Object} stats - Statistics object calculated by controller
     * @returns {void}
     */
    renderCharts(stats) {
        //this.renderParticipantsChart(stats);
        this.renderSpeakingTimeChart(stats);
        //this.renderInterventionsChart(stats);
    }

    /**
     * Renders pie chart for speaking time distribution by gender.
     * @param {Object} stats - Statistics object calculated by controller
     * @returns {void}
     */
    renderSpeakingTimeChart(stats) {

        const canvas = document.getElementById(CONFIG.DOM.CHARTS.SPEAKING_TIME);
        if (!canvas) {
            console.error(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + CONFIG.DOM.CHARTS.SPEAKING_TIME);
            return;
        }

        //Clean up any existing chart
        const chartInstance = Chart.getChart(CONFIG.DOM.CHARTS.SPEAKING_TIME);
        if (chartInstance) {
            chartInstance.destroy();
        }

        const labels = CONFIG.GENDERS.types.map(gender => CONFIG.GENDERS.labels[gender]);
        const data = CONFIG.GENDERS.types.map(gender =>
            stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender]);
        const backgroundColor = CONFIG.GENDERS.types.map(gender => CONFIG.GENDERS.colors[gender]);


        new Chart(canvas.getContext('2d'), {
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
    }

    /**
     * Displays text-based statistics on the page.
     * Shows total time, per-gender stats, and fair distribution analysis.
     * @param {Object} stats - Statistics object calculated by controller
     * @returns {void}
     */
    displayTextStats(stats) {
        if (!this.totalTimeElement || !this.genderStatsElement || !this.fairDistElement) {
            console.error(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + 'statistics elements');
            return;
        }

        //Total meeting time
        this.totalTimeElement.textContent = this.formatTime(stats[CONFIG.STATS.STRUCTURE.TOTAL_TIME]);

        //Per-gender statistics
        this.genderStatsElement.innerHTML = '';

        CONFIG.GENDERS.types.forEach(gender => {
            const statsDiv = document.createElement('div');
            statsDiv.className = `${CONFIG.STATS.DISPLAY.GENDER_STAT_CLASS_PREFIX}${gender}`;

            const totalTime = this.formatTime(stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender]);
            const interventions = stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender];
            const avgTime = this.formatTime(stats[CONFIG.STATS.STRUCTURE.AVG_DURATION][gender]);

            statsDiv.innerHTML = `
                <h3>${CONFIG.GENDERS.labels[gender]}</h3>
                <p>${CONFIG.STATS.LABELS.SPEAKING_TIME}: ${totalTime}</p>
                <p>${CONFIG.STATS.LABELS.STATEMENTS_COUNT}: ${interventions}</p>
                <p>${CONFIG.STATS.LABELS.AVG_LENGTH}: ${avgTime}</p>
            `;

            this.genderStatsElement.appendChild(statsDiv);
        });

        //Fair distribution analysis
        this.fairDistElement.innerHTML = `<h3>${CONFIG.STATS.LABELS.FAIR_DISTRIBUTION_HEADER}</h3>`;

        CONFIG.GENDERS.types.forEach(gender => {
            const actual = stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender];
            const fair = stats[CONFIG.STATS.STRUCTURE.FAIR_DISTRIBUTION][gender];
            const diff = actual - fair;

            const diffText = diff > 0
                ? `${this.formatTime(diff)} ${CONFIG.STATS.LABELS.MORE_THAN_FAIR}`
                : `${this.formatTime(Math.abs(diff))} ${CONFIG.STATS.LABELS.LESS_THAN_FAIR}`;

            const p = document.createElement('p');
            p.innerHTML = `${CONFIG.GENDERS.labels[gender]}: ${this.formatTime(actual)} (${CONFIG.STATS.LABELS.FAIR_LABEL}: ${this.formatTime(fair)})<br>
                           <span class="${diff > 0 ? CONFIG.STATS.DISPLAY.OVER_CLASS : CONFIG.STATS.DISPLAY.UNDER_CLASS}">${diffText}</span>`;

            this.fairDistElement.appendChild(p);
        });
    }

    /**
     * Formats time in seconds to human-readable MM:SS format.
     * Helper method for display purposes only.
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