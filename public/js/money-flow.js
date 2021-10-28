// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
var ctx = document.getElementById("moneyflowChart");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [1,2,3,4,5],
    datasets: [
    {
      label: "IN",
      backgroundColor: [
        'rgb(75, 192, 192, 10)'
        ],
      data: [4215, 5312, 6251, 7841, 9821],
    },
    {
        label: "OUT",
        backgroundColor: [
          'rgb(255, 205, 86, 10)'
          ],
        data: [800, 3200, 3476, 2390, 6500],
      }
    ],
  },
  options: {
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
