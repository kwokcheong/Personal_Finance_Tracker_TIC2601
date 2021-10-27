// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example

const monthLabel = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug'];
const salaryDatapoints = [215, 532, 651, 784, 821,593,123,300];
const freelanceDatapoints = [115, 232, 851, 484, 521,293,423,600];
const allowanceDatapoints = [315, 202, 411, 284, 511,524,180,310];
const othersDatapoints = [415, 132, 251, 184, 421,693,323,361];

var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: monthLabel,
    datasets: [
      {
        label: "Allowance",
        lineTension: 0.3,
        backgroundColor: "rgba(2,117,216,0)",
        borderColor: "#4DB6AC",
        pointRadius: 3,
        pointBackgroundColor: "#616161",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#263238",
        pointHitRadius: 50,
        pointBorderWidth: 1,
        data: allowanceDatapoints
      }, 
      {
        label: "Freelance",
        lineTension: 0.3,
        backgroundColor: "rgba(2,117,216,0)",
        borderColor: "#FF8A80",
        pointRadius: 3,
        pointBackgroundColor: "#616161",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#263238",
        pointHitRadius: 50,
        pointBorderWidth: 1,
        data: freelanceDatapoints
      }, 
      {
        label: "Others",
        lineTension: 0.3,
        backgroundColor: "rgba(2,117,216,0)",
        borderColor: "#64B5F6",
        pointRadius: 3,
        pointBackgroundColor: "#616161",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#263238",
        pointHitRadius: 50,
        pointBorderWidth: 1,
        data: othersDatapoints
      },
      {
      label: "Salary",
      lineTension: 0.2,
      backgroundColor: "rgba(2,117,216,0)",
      borderColor: "#9575CD",
      pointRadius: 3,
      pointBackgroundColor: "#616161",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 4,
      pointHoverBackgroundColor: "#263238",
      pointHitRadius: 50,
      pointBorderWidth: 1,
      data: salaryDatapoints
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
      display: true
    }, 
    responsive: true,
    tooltips: {
        displayColors:true,
        reponsive: true,
        mode: 'index',
        intersect: true,
        callbacks: {
          label: function(tooltipItem, data) {
            if (tooltipItem.datasetIndex === 0){
              return ' Allowance:' + ' $' + data['datasets'][0]['data'][tooltipItem['index']];
            } else if (tooltipItem.datasetIndex === 1){
              return ' Freelance:' + ' $' + data['datasets'][1]['data'][tooltipItem['index']];
            }else if (tooltipItem.datasetIndex === 2){
              return ' Others:' + ' $' + data['datasets'][2]['data'][tooltipItem['index']];
            }else if (tooltipItem.datasetIndex === 3){
              return ' Salary:' + ' $' + data['datasets'][3]['data'][tooltipItem['index']];
            }
          }, 
          labelColor: function(tooltipItem, chart) {
            if (tooltipItem.datasetIndex === 0){
              return {
                backgroundColor: '#9575CD'
              }
            } else if (tooltipItem.datasetIndex === 1){
              return {
                backgroundColor: '#FF8A80'
              }
            } else if (tooltipItem.datasetIndex === 2){
              return {
                backgroundColor: '#4DB6AC'
              }
            } else if (tooltipItem.datasetIndex === 3){
              return {
                backgroundColor: '#64B5F6'
              }
            }
          }
        }
      }
    }
});