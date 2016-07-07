function type(d) {
  d.birth = new Date(+d.birth, 0, 1)
  d.death = new Date(+d.death, 0, 1)
  return d;
}

var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 50
}
var width = 960, height = 500;


var chart = d3.select('.chart')
    .attr('width', width + margin.top + margin.bottom)
    .attr('height', height + margin.left + margin.right)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.tsv("data.tsv", type, function(error, data) {
    var earliest_date = new Date(d3.min(data, function(d) { return d.birth; }).getTime());
    earliest_date.setFullYear(earliest_date.getFullYear() - 10)

    var latest_date = new Date(d3.max(data, function(d) { return d.death; }).getTime());
    latest_date.setFullYear(latest_date.getFullYear() + 10)

    var x = d3.scaleBand()
        .paddingOuter(0.1)
        .paddingInner(0.2)
        .domain(d3.map(data, function(d) { return d.name; }).keys())
        .range([0, 100], 0.1);

    var y = d3.scaleTime()
        .domain([earliest_date, latest_date])
        .range([height, 0]);

    var y_axis = d3.axisLeft(y)

    chart
      .append('g')
        .call(y_axis)

    var bar = chart.selectAll('.bar')
        .data(data)
        .enter().append('g')
        .attr('transform', function(d) { return `translate( ${x(d.name)} , 0)`; })

    bar.append('rect')
        .attr('y', function(d) { return y(d.death); })
        .attr('height', function(d) { return y(d.birth) - y(d.death); })
        .attr('width', x.bandwidth())
        .attr('fill', 'steelblue')
});
