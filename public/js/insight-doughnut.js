// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

let doughnutDatapoints = JSON.parse(budgetChart);
console.log(doughnutDatapoints)
//doughnut data points should be [total expense for latest month , (budget amount - total expense for latest month)]

let ctx3 = document.getElementById('doughnutChart');
let doughnutChart = new Chart(ctx3, {
    type: 'doughnut',
    data: {
        labels: [
            'Spent',
            'Remaining'
        ],
        datasets: [{
            label: 'info',
            data: doughnutDatapoints,
            backgroundColor: [
                '#0dcaf0',
                'rgb(224, 224, 224)'
            ],
            borderColor:[
                '#0dcaf0',
                'rgb(224, 224, 224)'
            ]
        }]
    },
    options: {
        cutoutPercentage: 87,
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
        }, 
        elements: {
            center: {
            text: daysLeft,
            color: 'rgb(97, 97, 97)', 
            fontStyle: 'em sans-serif',
            sidePadding: 10, // Default is 20 (as a percentage)
            minFontSize: 8, // Default is 20 (in px), set to false and text will not wrap.
            lineHeight: 25 // Default is 25 (in px), used for when text wraps
            }
        }
    }
});

Chart.pluginService.register({
    beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
        // Get ctx from string
        var ctx = chart.chart.ctx;

        // Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'em sans-serif';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var maxFontSize = centerConfig.maxFontSize || 18;
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)

        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
        var minFontSize = centerConfig.minFontSize;
        var lineHeight = centerConfig.lineHeight || 25;
        var wrapText = false;

        if (minFontSize === undefined) {
            minFontSize = 109;
        }

        if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize;
            wrapText = true;
        }

        // Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;

        if (!wrapText) {
            ctx.fillText(txt + ' Days Left', centerX, centerY);
            return;
        }

        var words = txt.split(' ');
        var line = '';
        var lines = [];

        // Break words up into multiple lines if necessary
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
            } else {
            line = testLine;
            }
        }

        // Move the center up depending on line height and number of lines
        centerY -= (lines.length / 2) * lineHeight;

        for (var n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
        }
        //Draw text in center
        ctx.fillText(line, centerX, centerY);
        }
    }
});