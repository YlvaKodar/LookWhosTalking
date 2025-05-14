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
        this.exportPdfBtn = document.getElementById(CONFIG.DOM.BUTTONS.EXPORT_PDF);

        if (this.exportPdfBtn) {
            this.exportPdfBtn.addEventListener('click', () => {

               this.optimizeForPdfExport();

                this.controller.exportToPdf();

                setTimeout(() => this.restoreFromPdfOptimization(), 1000);

            });
        }

        this.controller = new StatsController(this.meeting, this);
    }



    /**
     * Optimizes the statistics display for PDF export.
     * Makes temporary changes to improve PDF appearance.
     * @returns {void}
     */
    optimizeForPdfExport() {
        console.log('Optimizing view for PDF export...');

        // Get the stats container
        const statsContainer = document.querySelector('.stats-container');
        if (!statsContainer) return;

        // Save original styles to restore later
        this._originalStyles = {
            width: statsContainer.style.width,
            padding: statsContainer.style.padding,
            backgroundColor: statsContainer.style.backgroundColor,
            fontFamily: statsContainer.style.fontFamily,
            maxWidth: statsContainer.style.maxWidth
        };

        // Apply PDF-friendly styles
        statsContainer.style.width = 'auto';
        statsContainer.style.maxWidth = '100%';
        statsContainer.style.padding = '20px';
        statsContainer.style.backgroundColor = 'white';
        statsContainer.style.fontFamily = 'Arial, sans-serif';

        // Add meeting title and date if not present
        if (!document.getElementById('pdf-header')) {
            const header = document.createElement('div');
            header.id = 'pdf-header';
            header.style.textAlign = 'center';
            header.style.marginBottom = '20px';
            header.innerHTML = `
            <h1 style="margin-bottom: 5px;">${this.meeting.name}</h1>
            <p style="color: #666;">Date: ${this.meeting.date}</p>
        `;
            statsContainer.insertBefore(header, statsContainer.firstChild);
        }
    }

    /**
     * Restores the statistics display after PDF export.
     * Removes temporary changes made for PDF optimization.
     * @returns {void}
     */
    restoreFromPdfOptimization() {
        console.log('Restoring view after PDF export...');

        // Get the stats container
        const statsContainer = document.querySelector('.stats-container');
        if (!statsContainer) return;

        // Restore original styles
        if (this._originalStyles) {
            Object.keys(this._originalStyles).forEach(key => {
                statsContainer.style[key] = this._originalStyles[key];
            });
        }

        // Remove the temporary header
        const header = document.getElementById('pdf-header');
        if (header) {
            header.parentNode.removeChild(header);
        }
    }















    /**
     * Renders chart visualizations of meeting statistics.
     * Creates three pie charts for participants, speaking time, and interventions.
     * @param {Object} stats - Statistics object calculated by controller
     * @returns {void}
     */
    renderCharts(stats) {
        this.renderParticipantsChart(stats);
        this.renderSpeakingTimeChart(stats);
        this.renderInterventionsChart(stats);
    }

    /**
     * Renders pie chart for participant distribution by gender.
     * @param {Object} stats - Statistics object calculated by controller
     * @returns {void}
     */
    renderParticipantsChart(stats) {
        const canvas = document.getElementById(CONFIG.DOM.CHARTS.PARTICIPANTS);
        if (!canvas) {
            console.error(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + CONFIG.DOM.CHARTS.PARTICIPANTS);
            return;
        }

        // Clean up any existing chart
        const chartInstance = Chart.getChart(CONFIG.DOM.CHARTS.PARTICIPANTS);
        if (chartInstance) {
            chartInstance.destroy();
        }

        const labels = CONFIG.GENDERS.types.map(gender => CONFIG.GENDERS.labels[gender]);
        const data = CONFIG.GENDERS.types.map(gender => this.meeting.participants[gender]);
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
     * Renders pie chart for intervention count distribution by gender.
     * @param {Object} stats - Statistics object calculated by controller
     * @returns {void}
     */
    renderInterventionsChart(stats) {
        const canvas = document.getElementById(CONFIG.DOM.CHARTS.INTERVENTIONS);
        if (!canvas) {
            console.error(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + CONFIG.DOM.CHARTS.INTERVENTIONS);
            return;
        }

        // Clean up any existing chart
        const chartInstance = Chart.getChart(CONFIG.DOM.CHARTS.INTERVENTIONS);
        if (chartInstance) {
            chartInstance.destroy();
        }

        const labels = CONFIG.GENDERS.types.map(gender => CONFIG.GENDERS.labels[gender]);
        const data = CONFIG.GENDERS.types.map(gender =>
            stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender]);
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
        if (!this.totalTimeElement || !this.genderStatsElement) {
            console.error(CONFIG.MESSAGES.CONSOLE.ELEMENT_NOT_FOUND + 'statistics elements');
            return;
        }

        this.totalTimeElement.textContent = this.formatTime(stats[CONFIG.STATS.STRUCTURE.TOTAL_TIME]);

        this.genderStatsElement.innerHTML = '';

        CONFIG.GENDERS.types.forEach(gender => {
            const hasParticipants = this.meeting && this.meeting.participants && this.meeting.participants[gender] > 0;

            if (hasParticipants) {
                const statsDiv = document.createElement('div');

                statsDiv.className = `${CONFIG.STATS.DISPLAY.GENDER_STAT_CLASS_PREFIX}${gender}`;

                const totalTime = this.formatTime(stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender]);
                const interventions = stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender];
                const avgTime = this.formatTime(stats[CONFIG.STATS.STRUCTURE.AVG_DURATION][gender]);
                const fair = this.formatTime(stats[CONFIG.STATS.STRUCTURE.FAIR_DISTRIBUTION][gender]);

                statsDiv.innerHTML = `
                <h3>${CONFIG.GENDERS.labels[gender]}</h3>
                <p>${CONFIG.STATS.LABELS.SPEAKING_TIME}: ${totalTime} min.</p>
                <p>${CONFIG.STATS.LABELS.STATEMENTS_COUNT}: ${interventions}.</p>
                <p>${CONFIG.STATS.LABELS.AVG_LENGTH}: ${avgTime} min.</p>
                
                <p><br>Fair share of speaking time for ${gender} would have been ${fair} min.<br></p>
            `;

                this.genderStatsElement.appendChild(statsDiv);
            }
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

    /**
     * Shows an alert message to the user using the custom alert.
     * @param {string} message - The message to display
     * @returns {void}
     */
    showAlert(message) {
        AlertManager.showAlert(message);
    }
}