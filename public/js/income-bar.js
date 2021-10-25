// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
const label = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June'];
const incomeDatapoints = [215, 532, 651, 784, 821,593,123,300];

var ctx = document.getElementById("myBarChart");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: label,
    datasets: [{
      backgroundColor: [
        'rgb(75, 99, 132, 10)',
        'rgb(75, 192, 192, 10)',
        'rgb(255, 205, 86, 10)',
        'rgb(206, 147, 216, 10)',
        'rgb(54, 162, 235, 10)', 
        'rgb(229, 115, 115, 10)', 
        ],
      data: incomeDatapoints
    }],
  },
  options: {
    reponsive: true,
    tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            if (tooltipItem.datasetIndex === 0) {
                return ' $ ' + data['datasets'][0]['data'][tooltipItem['index']]
            } else if (tooltipItem.datasetIndex === 1) {
                return ' $ ' + data['datasets'][1]['data'][tooltipItem['index']];
            } else if (tooltipItem.datasetIndex === 2) {
              return ' $ ' + data['datasets'][2]['data'][tooltipItem['index']];
            } else if (tooltipItem.datasetIndex === 3) {
              return ' $ ' + data['datasets'][3]['data'][tooltipItem['index']];
            } else if (tooltipItem.datasetIndex === 4) {
              return ' $ ' + data['datasets'][4]['data'][tooltipItem['index']];
            } else if (tooltipItem.datasetIndex === 5) {
              return ' $ ' + data['datasets'][5]['data'][tooltipItem['index']];
            }
          }
        }
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: true
        }
      }],
    },
  }
});
