// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';


let ctx3 = document.getElementById('expenseLineGraph');
let expenseLineGraph = new Chart(ctx3, {
  type: 'line',
  data: {
    labels: ['May', 'June', 'July', 'Aug', 'Sep', 'Oct'],
    datasets: [{
      label: 'Expenses',
        data: JSON.parse(monthlytotalDatapoints),
        lineTension: 0.3,
        backgroundColor: "rgba(241, 148, 138,0.3)",
        borderColor: "#EC7063",
        pointRadius: 3,
        pointBackgroundColor: "#616161",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#263238",
        pointHitRadius: 50,
        pointBorderWidth: 1,
    }]
  }, 
  options: {
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        beginAtZero: true,
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }, 
    responsive: true,
    tooltips: {
        reponsive: true,
        mode: 'index',
        intersect: true,
        callbacks: {
          label: function(tooltipItem, data) {
            if (tooltipItem.datasetIndex === 0){
              return ' $' + data['datasets'][0]['data'][tooltipItem['index']];
            } 
          }
        }
      }
    }
});
