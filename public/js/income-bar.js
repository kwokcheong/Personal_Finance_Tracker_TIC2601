// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart: Insert data here
const categoryDatapoints = ['May', 'June', 'July', 'Aug', 'Sep', 'Oct'];

var ctx = document.getElementById("myBarChart");
var barChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: categoryDatapoints,
    datasets: [{
      label: 'Allowance',
      data:JSON.parse(allowanceDatapoints),
      hoverBackgroundColor: '#16A085',
      backgroundColor: '#45B39D'
    }, 
    {
      label: 'Freelance',
      data: JSON.parse(freelanceDatapoints),
      hoverBackgroundColor: '#48C9B0',
      backgroundColor: '#76D7C4'
    }, 
    {
      label: 'Others',
      data: JSON.parse(othersDatapoints),
      hoverBackgroundColor: '#45B39D',
      backgroundColor: '#73C6B6'
    }, 
    {
      label: 'Salary',
      data: JSON.parse(salaryDatapoints),
      hoverBackgroundColor: '#3498DB',
      backgroundColor: '#5DADE2'
    }
  ]
  },
  options: {
    reponsive: true,
    tooltips: {
      mode: 'index',
      callbacks: {
      label: function(tooltipItem, data) {
          if (tooltipItem.datasetIndex === 0) {
              return 'Allowance: ' + ' $' + data['datasets'][0]['data'][tooltipItem['index']]
          } else if (tooltipItem.datasetIndex === 1) {
              return 'Freelance: ' + ' $' + data['datasets'][1]['data'][tooltipItem['index']];
          }else if (tooltipItem.datasetIndex === 2) {
            return 'Others: ' + ' $' + data['datasets'][2]['data'][tooltipItem['index']];
          }else if (tooltipItem.datasetIndex === 3) {
              return 'Salary: ' + ' $' + data['datasets'][3]['data'][tooltipItem['index']];
          }
        }
      }
    },
    scales: {
        xAxes: [{
          gridLines: {
              display:false
          }
        }],
        yAxes: [{
          ticks: {
            min: 0
          },
          gridLines: {
              display:true
          }   
        }]
    }
  }
});
