// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("moexpensesChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["Food", "MRT", "Grab", "Cloth"],
    datasets: [{
      data: [900, 70, 100, 670],
      backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745'],
    }],
  },
});