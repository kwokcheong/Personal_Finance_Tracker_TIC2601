// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
const budgetCategoryDatapoints =['Bills', 'Food', 'Luxury', 'Others', 'Transport'];
const categoryDatapoints = [12.21, 15.58, 11.25, 8.32, 25];

var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: budgetCategoryDatapoints,
    datasets: [{
      data: categoryDatapoints,
      backgroundColor: ['#1A5276', '#AEB6BF', '#A9CCE3', '#7FB3D5 ', '#797D7F'], 
      hoverBackgroundColor: ['#154360', '#85929E', '#7FB3D5', '#5499C7 ', '#717D7E'], 
      hoverOffset: 9
    }],
  },
  options: {
    reponsive: true,
    tooltips: {
      callbacks: {
        title: function(tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function(tooltipItem, data) {
          return '$' + data['datasets'][0]['data'][tooltipItem['index']];
        },
        afterLabel: function(tooltipItem, data) {
          var dataset = data['datasets'][0];
          var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
          return '(' + percent + '%)';
        }
      },
      backgroundColor: 'rgba(247, 249, 249 ,0.8)',
      titleFontSize: 14,
      titleFontColor: '#17202A',
      bodyFontColor: '#17202A',
      bodyFontSize: 12,
      displayColors: true
    }
  }
});
