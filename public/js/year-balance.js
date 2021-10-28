// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

var ctx = document.getElementById('yearbalanceChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"],
        datasets: [{
            label: 'Amount',
            data: [7500, 8900, 9000, 10010, 2060, 8970, 4500],
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
        }]
    },
    options: {
        roptions: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            }
        }
    }
});
