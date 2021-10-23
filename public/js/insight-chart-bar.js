// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart: Insert data here
const categoryDatapoints = ['Allowance', 'Freelance', 'Salary', 'Others'];
const budgetDatapoints = [1000, 200, 200, 100];
const expensesDatapoints = [800, 59.94, 53, 30];

var ctx = document.getElementById("barChart");
var barChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: categoryDatapoints,
    datasets: [{
      label: 'Budget',
      data: budgetDatapoints,
      hoverBackgroundColor: 'rgb(1, 87, 155)',
      backgroundColor: 'rgb(2, 119, 189)'
    }, {
      label: 'Spent',
      data: expensesDatapoints,
      hoverBackgroundColor: 'rgb(0, 131, 143)',
      backgroundColor: 'rgb(0, 151, 167)'
    }]
  },
  options: {
    reponsive: true,
    tooltips: {
        mode: 'index',
        callbacks: {
            label: function(tooltipItem, data) {
                if (tooltipItem.datasetIndex === 0) {
                    return ' $ ' + data['datasets'][0]['data'][tooltipItem['index']]
                } else if (tooltipItem.datasetIndex === 1) {
                    return ' $ ' + data['datasets'][1]['data'][tooltipItem['index']];
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
            gridLines: {
                display:true
            }   
        }]
    }
  }
});
