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

// Process the raw data, grouping non-overlapping events
function processData(data) {
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
    // Get upper and lower bounds of x axis, clamped to nearest ten for prettiness
    var earliest_date = new Date(d3.min(data, function(d) { return d.birth; }).getTime());
    earliest_date.setFullYear(nearestTen(earliest_date.getFullYear() - 10))

    var latest_date = new Date();

    var y = d3.scaleBand()
        .paddingOuter(0.1)
        .paddingInner(0.2)
        .domain(d3.map(data, function(d) { return d.name; }).keys())
        .range([0, height], 0.1);

    var x = d3.scaleTime()
        .domain([earliest_date, latest_date])
        .range([0, width]);

    var x_axis = d3.axisTop(x)

    chart
      .append('g')
        .call(x_axis)

    // Create groups for bars
    var bars = chart.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d) { return `translate( ${x(d.birth)} , ${y(d.name)})`; })

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