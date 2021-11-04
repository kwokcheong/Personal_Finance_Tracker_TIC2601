 // Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("moincomeChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Allowance', 'Freelance', 'Others','Salary'],
    datasets: [{
      data: JSON.parse(incomePie),
      backgroundColor: ['#45B39D', '#76D7C4', '#73C6B6', '#5DADE2'],
    }]
  },
  options:{
    reponsive: true,
    tooltips: {
        callbacks: {
            title: function(tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
            },
            label: function(tooltipItem, data) {
                return ' $ ' + data['datasets'][0]['data'][tooltipItem['index']];
            }
        }
    }
  }
});