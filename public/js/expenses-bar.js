// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart: Insert data here
const categoryDatapoints = ['May', 'June', 'July', 'Aug', 'Sep', 'Oct'];

var ctx = document.getElementById("expensesBarChart");
var expensesBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: categoryDatapoints,
    datasets: [{
      label: 'Bills',
      data:[413,709,132,662,790,830],
      hoverBackgroundColor: '#CA6F1E',
      backgroundColor: '#E67E22'
    }, 
    {
      label: 'Food',
      data:[313,509,332,652,720,430],
      hoverBackgroundColor: '#F39C12',
      backgroundColor: '#F5B041'
    }, 
    {
      label: 'Luxury',
      data:[113,209,142,262,590,130],
      hoverBackgroundColor: '#F1C40F',
      backgroundColor: '#F4D03F'
    }, 
    {
      label: 'Others',
      data:[445,369,352,232,590,270],
      hoverBackgroundColor: '#DC7633',
      backgroundColor: '#E59866'
    }, 
    {
      label: 'Travel',
      data:[345,169,852,332,490,570],
      hoverBackgroundColor: '#F0B27A',
      backgroundColor: '#F5CBA7'
    }, 
    {
      label: 'Utility',
      data:[145,329,452,239,490,280],
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
            return 'Travel: ' + ' $' + data['datasets'][4]['data'][tooltipItem['index']];
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
          // ticks: {
          //   min: 0,
          //   max: Math.ceil(parseInt(max)/100)*100
          // },
          gridLines: {
              display:true
          }   
        }]
    }
  }
});
