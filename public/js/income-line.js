// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example

const monthLabel = ['June', 'July', 'Aug', 'Sep', 'Oct', 'Nov'];
let baramountCompare = JSON.parse(baramountDatapoint)
let maxAmount = Math.max(...baramountCompare);

var ctx = document.getElementById("myAreaChart");
var myAreaChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: monthLabel,
    datasets: [ {
      label: 'Income',
      lineTension: 0.3,
      backgroundColor: "rgba(93, 173, 226,0.3)",
      borderColor: "#3498DB",
      pointRadius: 3,
      pointBackgroundColor: "#616161",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 4,
      pointHoverBackgroundColor: "#263238",
      pointHitRadius: 50,
      pointBorderWidth: 1,
      data: JSON.parse(baramountDatapoint)
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
          min: 0
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