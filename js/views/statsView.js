import { CONFIG } from '../utils/config.js';
class StatsView {
    constructor() {
        this.meeting = StorageManager.getCurrentMeeting();
        this.stats = this.calculateStats();

        this.renderCharts();
        this.displayTextStats();
    }

    calculateStats() {
        const stats = {
            totalDuration: 0,
            totalSpeakingTime: { men: 0, women: 0, nonBinary: 0 },
            totalInterventions: { men: 0, women: 0, nonBinary: 0 },
            averageDuration: { men: 0, women: 0, nonBinary: 0 },
            participantAverages: { men: 0, women: 0, nonBinary: 0 },
            fairDistribution: { men: 0, women: 0, nonBinary: 0 }
        };

        Object.keys(this.meeting.speakingData).forEach(gender => {
            const times = this.meeting.speakingData[gender];
            stats.totalInterventions[gender] = times.length;
            stats.totalSpeakingTime[gender] = times.reduce((sum, time) => sum + time, 0);
            stats.totalDuration += stats.totalSpeakingTime[gender];
        });

        return stats;
    }

    renderCharts() {
        const ctx = document.getElementById(CONFIG.DOM.CHARTS.SPEAKING_TIME).getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [CONFIG.GENDERS.labels.men, CONFIG.GENDERS.labels.women, CONFIG.GENDERS.labels.nonBinary],
                datasets: [{
                    data: [
                        this.stats.totalSpeakingTime.men,
                        this.stats.totalSpeakingTime.women,
                        this.stats.totalSpeakingTime.nonBinary
                    ],
                    backgroundColor: [CONFIG.GENDERS.colors.men, CONFIG.GENDERS.colors.women, CONFIG.GENDERS.labels.nonBinary],
                }]
            },
            options: {
                responsive: true,
                //Fler inställningar ...
            }
        });

        //Skapa fler diagram för andra statistikvyer
    }

    displayTextStats() {
        //Visa textbaserad statistik
        document.getElementById(CONFIG.DOM.STATS.TOTAL_TIME).textContent = this.formatTime(this.stats.totalDuration);
        //Fler statistikelement...
    }

    formatTime(seconds) {
        //Formatera tid i läsbart format
    }
}