// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
var ctx = document.getElementById("moneyflowChart");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['May', 'June', 'July', 'Aug', 'Sep', 'Oct'],
    datasets: [
    {
      label: "Income",
      backgroundColor: '#3498DB',
      data: [4215, 5312, 6251, 7841, 9821,3023],
    },
    {
        label: "Expenses",
        backgroundColor: '#EC7063',
        data: [800, 3200, 3476, 2390, 6500,8013],
      }
    ],
  },
  options: {
    tooltips: {
      mode: 'index',
      callbacks: {
      label: function(tooltipItem, data) {
          if (tooltipItem.datasetIndex === 0) {
              return 'Income: ' + ' $' + data['datasets'][0]['data'][tooltipItem['index']]
          } else if (tooltipItem.datasetIndex === 1) {
              return 'Expenses: ' + ' $' + data['datasets'][1]['data'][tooltipItem['index']];
          }
        }
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 15000,
          maxTicksLimit: 5
        },
        gridLines: {
          display: true
        }
      }],
    },
  }
});
