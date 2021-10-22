// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

let ctx = document.getElementById('myChart');
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: JSON.parse(labelmonths),
        datasets: [{
            label: 'Spending',
            data: JSON.parse(amount),
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
        }]
    },
    options: {
        reponsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Average Monthly Spending',
            fontSize: 24,
            fontColor: 'grey'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});