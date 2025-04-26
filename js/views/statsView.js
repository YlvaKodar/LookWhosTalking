class StatsView {
    constructor() {
        this.meeting = StorageManager.getCurrentMeeting();
        this.stats = this.calculateStats();

        this.renderCharts();
        this.displayTextStats();
    }

    calculateStats() {
        // Beräkna all statistik baserat på mötet
        const stats = {
            totalDuration: 0,
            totalSpeakingTime: { men: 0, women: 0, nonBinary: 0 },
            totalInterventions: { men: 0, women: 0, nonBinary: 0 },
            averageDuration: { men: 0, women: 0, nonBinary: 0 },
            participantAverages: { men: 0, women: 0, nonBinary: 0 },
            fairDistribution: { men: 0, women: 0, nonBinary: 0 }
        };

        // Beräkna totalvärden
        Object.keys(this.meeting.speakingData).forEach(gender => {
            const times = this.meeting.speakingData[gender];
            stats.totalInterventions[gender] = times.length;
            stats.totalSpeakingTime[gender] = times.reduce((sum, time) => sum + time, 0);
            stats.totalDuration += stats.totalSpeakingTime[gender];
        });

        // Beräkna genomsnitt och "rättvis" fördelning
        // ...

        return stats;
    }

    renderCharts() {
        // Skapa cirkeldiagram för talartid
        const ctx = document.getElementById('speaking-time-chart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Män', 'Kvinnor', 'Icke-binära'],
                datasets: [{
                    data: [
                        this.stats.totalSpeakingTime.men,
                        this.stats.totalSpeakingTime.women,
                        this.stats.totalSpeakingTime.nonBinary
                    ],
                    backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56']
                }]
            },
            options: {
                responsive: true,
                // Fler inställningar...
            }
        });

        // Skapa fler diagram för andra statistikvyer
    }

    displayTextStats() {
        // Visa textbaserad statistik
        document.getElementById('total-time').textContent = this.formatTime(this.stats.totalDuration);
        // Fler statistikelement...
    }

    formatTime(seconds) {
        // Formatera tid i läsbart format
    }
}