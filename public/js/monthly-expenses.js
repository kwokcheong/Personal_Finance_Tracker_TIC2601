// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("moexpensesChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Bills', 'Food', 'Luxury', 'Others', 'Travel', 'Utility'],
    datasets: [{
      data: [900, 70, 100, 670,402, 812],
      backgroundColor: ['#E67E22', '#F5B041', '#F4D03F', '#E59866', '#F5CBA7','#D68910'],
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