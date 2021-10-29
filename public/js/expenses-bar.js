// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart: Insert data here
const categoryDatapoints = ['June', 'July', 'Aug', 'Sep', 'Oct', 'Nov'];

var ctx = document.getElementById("expensesBarChart");
var expensesBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: categoryDatapoints,
    datasets: [{
      label: 'Bills',
      data: JSON.parse(billsDatapoints),
      hoverBackgroundColor: '#CA6F1E',
      backgroundColor: '#E67E22'
    }, 
    {
      label: 'Food',
      data:JSON.parse(foodDatapoints),
      hoverBackgroundColor: '#F39C12',
      backgroundColor: '#F5B041'
    }, 
    {
      label: 'Luxury',
      data:JSON.parse(luxuryDatapoints),
      hoverBackgroundColor: '#F1C40F',
      backgroundColor: '#F4D03F'
    }, 
    {
      label: 'Others',
      data:JSON.parse(othersDatapoints),
      hoverBackgroundColor: '#DC7633',
      backgroundColor: '#E59866'
    }, 
    {
      label: 'Transport',
      data:JSON.parse(transportDatapoints),
      hoverBackgroundColor: '#F0B27A',
      backgroundColor: '#F5CBA7'
    }, 
    {
      label: 'Utility',
      data:JSON.parse(utilityDatapoints),
      hoverBackgroundColor: '#B9770E',
      backgroundColor: '#D68910'
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
              return 'Bills: ' + ' $' + data['datasets'][0]['data'][tooltipItem['index']]
          } else if (tooltipItem.datasetIndex === 1) {
              return 'Food: ' + ' $' + data['datasets'][1]['data'][tooltipItem['index']];
          }else if (tooltipItem.datasetIndex === 2) {
            return 'Luxury: ' + ' $' + data['datasets'][2]['data'][tooltipItem['index']];
          }else if (tooltipItem.datasetIndex === 3) {
              return 'Others: ' + ' $' + data['datasets'][3]['data'][tooltipItem['index']];
          }else if (tooltipItem.datasetIndex === 4) {
            return 'Transport: ' + ' $' + data['datasets'][4]['data'][tooltipItem['index']];
          }else if (tooltipItem.datasetIndex === 5) {
            return 'Utility: ' + ' $' + data['datasets'][5]['data'][tooltipItem['index']];
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
