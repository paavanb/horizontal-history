groupData = require('./utils').groupData


function type(d) {
  d.birth = new Date(d.birth)
  if(d.death != 'PRESENT') {
    d.death = new Date(d.death)
  } else {
    d.death = new Date()
  }
  return d;
}

function nearestTen(n) {
    return parseInt(n / 10) * 10
}


var margin = {
    top: 50,
    right: 10,
    bottom: 10,
    left: 10
}
var width = 600, height = 500;


var chart = d3.select('.chart')
    .attr('width', width + margin.top + margin.bottom)
    .attr('height', height + margin.left + margin.right)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.tsv("data.tsv", type, function(error, data) {
    // Get lower bound of x axis, clamped to nearest ten for prettiness
    var earliest_date = new Date(d3.min(data, function(d) { return d.birth; }).getTime());
    earliest_date.setFullYear(nearestTen(earliest_date.getFullYear() - 10))

    var latest_date = new Date();

    grouped_data = groupData(data)
    var y = d3.scaleBand()
        .paddingOuter(0.1)
        .paddingInner(0.2)
        .domain(_.map(grouped_data, function(d, i) { return i; }))
        .range([0, height], 0.1);

    var x = d3.scaleTime()
        .domain([earliest_date, latest_date])
        .range([0, width]);

    var x_axis = d3.axisTop(x)

    chart
      .append('g')
        .call(x_axis)

    // Create svg groups for bars
    var rows = chart.selectAll('.row')
        .data(grouped_data)
      .enter().append('g')
        .attr('class', 'row')
        .attr('transform', function (d, i) {
            return `translate(0, ${y(i)})`;
        })

    var bars = rows.selectAll('.bar')
        .data(function(d) { return d; })
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d, i) {
            return `translate(${x(d.birth)}, 0)`;
        })

    // Style bars
    bars.append('rect')
        .attr('width', function(d) { return x(d.death) - x(d.birth); })
        .attr('height', y.bandwidth())
        .attr('fill', 'steelblue')

    // Style text on bars
    bars.append('text')
        .text(function(d) { return d.name })
        .attr('dy', y.bandwidth()/2 + 5)
        .attr('dx', 10)
        .attr('fill', 'white')
        .attr('font-family', 'Helvetica')
});
