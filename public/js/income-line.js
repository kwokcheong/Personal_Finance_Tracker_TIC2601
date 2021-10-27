// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example

const monthLabel = ['May', 'June', 'July', 'Aug', 'Sep', 'Oct'];

var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: monthLabel,
    datasets: [ {
      label: 'Income',
      lineTension: 0.3,
      backgroundColor: "rgba(2,117,216,0)",
      borderColor: "#3498DB",
      pointRadius: 3,
      pointBackgroundColor: "#616161",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 4,
      pointHoverBackgroundColor: "#263238",
      pointHitRadius: 50,
      pointBorderWidth: 1,
      data: [1000, 200, 200, 100, 500, 320]
    }
  ]},
  options: {
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        beginAtZero: true,
        ticks: {
          min: 0,
          max: Math.ceil(parseInt(max)/100)*100
        },
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