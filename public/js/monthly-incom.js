// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("moincomeChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["Sallary", "Gift", "Bonus", "Love"],
    datasets: [{
      data: [2900, 500, 4000, 520],
      backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745'],
    }],
  },
});