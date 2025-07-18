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
        this.participantCount = document.getElementById(CONFIG.DOM.SCREENS.PARTICIPANT_COUNT);

        if (this.exportPdfBtn) {
            this.exportPdfBtn.addEventListener('click', () => {

               this.optimizeForPdfExport();

                this.controller.exportToPdf();
            });
        }

        this.controller = new StatsController(this.meeting, this);
    }

    /**
     * Optimize view of statistics for PDF.
     * @returns {void}
     */
    optimizeForPdfExport() {
        const statsContainer = document.querySelector('.stats-container');
        const textStatsElement = document.querySelector('.text-stats');

        if (!statsContainer) return;

        this._originalStyles = {
            containerBorder: statsContainer.style.border,
            containerBoxShadow: statsContainer.style.boxShadow
        };

        statsContainer.style.border = 'none';
        statsContainer.style.boxShadow = 'none';

        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer && !document.getElementById('pdf-footer-page1')) {
            const footer1 = document.createElement('div');
            footer1.id = 'pdf-footer-page1';
            footer1.style.textAlign = 'center';
            footer1.style.marginTop = '20px';
            footer1.style.fontSize = '12px';
            footer1.innerHTML = `
            ${CONFIG.FOOTER.TEXT}<br>
            ${CONFIG.FOOTER.LINK_TEXT}
        `;
            chartContainer.appendChild(footer1);
        }

        if (textStatsElement && !document.getElementById('pdf-footer-page2')) {
            const footer2 = document.createElement('div');
            footer2.id = 'pdf-footer-page2';
            footer2.style.textAlign = 'center';
            footer2.style.marginTop = '20px';
            footer2.style.fontSize = '12px';
            footer2.innerHTML = `
            ${CONFIG.FOOTER.TEXT}<br>
            ${CONFIG.FOOTER.LINK_TEXT}
        `;
            textStatsElement.appendChild(footer2);
        }

        if (textStatsElement) {
            this._originalStyles.textStatsPageBreak = textStatsElement.style.pageBreakBefore;
            textStatsElement.style.pageBreakBefore = 'always';
            textStatsElement.style.breakBefore = 'page';
        }

        if (!document.getElementById('pdf-header')) {
            const header = document.createElement('div');
            header.id = 'pdf-header';
            header.style.textAlign = 'center';
            header.style.marginBottom = '10px';
            header.innerHTML = `
            <h1 style="margin-bottom: 5px; margin-top: 0; color: #183b48;">${this.meeting.name} ${this.meeting.date}</h1>
            <h3 style="margin-bottom: 5px;  margin-top: 5; color: #2f0402; ">MEETING CHARTS</h3>
        `;
            statsContainer.insertBefore(header, statsContainer.firstChild);
        }

        if (textStatsElement && !document.getElementById('pdf-header-page2')) {
            const header2 = document.createElement('div');
            header2.id = 'pdf-header-page2';
            header2.style.textAlign = 'center';
            header2.style.marginBottom = '10px';
            header2.innerHTML = `
            <h1 style="margin-bottom: 5px; margin-top: 0; color: #183b48;">${this.meeting.name} ${this.meeting.date}</h1>
            <h3 style="margin-bottom: 10px; margin-top: 5; color: #2f0402;">MEETING STATISTICS</h3>
        `;
            textStatsElement.insertBefore(header2, textStatsElement.firstChild);
        }


    }

    /**
     * Reinstates view of statistics from before PDF optimization.
     * @returns {void}
     */
    restoreFromPdfOptimization() {

        const statsContainer = document.querySelector('.stats-container');
        const textStatsElement = document.querySelector('.text-stats');

        if (!statsContainer || !this._originalStyles) return;

        statsContainer.style.border = this._originalStyles.containerBorder || '';
        statsContainer.style.boxShadow = this._originalStyles.containerBoxShadow || '';

        if (textStatsElement && this._originalStyles.hasOwnProperty('textStatsPageBreak')) {
            textStatsElement.style.pageBreakBefore = this._originalStyles.textStatsPageBreak || '';
            textStatsElement.style.breakBefore = this._originalStyles.textStatsPageBreak || '';
        }

        const header1 = document.getElementById('pdf-header');
        if (header1) {
            header1.parentNode.removeChild(header1);
        }

        const header2 = document.getElementById('pdf-header-page2');
        if (header2) {
            header2.parentNode.removeChild(header2);
        }

        const footer = document.getElementById('pdf-footer');
        if (footer) {
            footer.parentNode.removeChild(footer);
        }

        const footer1 = document.getElementById('pdf-footer-page1');
        if (footer1) {
            footer1.parentNode.removeChild(footer1);
        }

        const footer2 = document.getElementById('pdf-footer-page2');
        if (footer2) {
            footer2.parentNode.removeChild(footer2);
        }

        this._originalStyles = null;
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
                const totalParticipants = this.meeting.getTotalParticipants();
                const interventions = stats[CONFIG.STATS.STRUCTURE.STATEMENTS_COUNT][gender];
                const avgTime = this.formatTime(stats[CONFIG.STATS.STRUCTURE.AVG_DURATION][gender]);
                const fair = this.formatTime(stats[CONFIG.STATS.STRUCTURE.FAIR_DISTRIBUTION][gender]);

                const actualTime = stats[CONFIG.STATS.STRUCTURE.GENDER_TIME][gender];
                const fairTime = stats[CONFIG.STATS.STRUCTURE.FAIR_DISTRIBUTION][gender];
                const representationStatus = this.getRepresentationStatus(actualTime, fairTime);

                this.participantCount.textContent = `Participant count: ${totalParticipants}`;

                statsDiv.innerHTML = `
                <h3>${CONFIG.GENDERS.labels[gender]}: ${this.meeting.participants[gender]} </h3>
                <p><strong>${representationStatus}</strong></p>
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

    getRepresentationStatus(actualTime, fairTime) {
        const threshold = fairTime * 0.1;

        if (actualTime > fairTime + threshold) {
            return CONFIG.STATS.LABELS.OVERREPRESENTED;
        } else if (actualTime < fairTime - threshold) {
            return CONFIG.STATS.LABELS.UNDERREPRESENTED;
        } else {
            return CONFIG.STATS.LABELS.FAIRLY_REPRESENTED;
        }
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