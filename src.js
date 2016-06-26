function type(d) {
  d.birth = +d.birth; // coerce to number
  d.death = +d.death;
  return d;
}

var width = 960, height = 500;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);
var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select('.chart')
    .attr('width', width)
    .attr('height', height);

d3.tsv("data.tsv", type, function(error, data) {
    x.domain(d3.map(data, function(d) { return d.name; }));

    earliest_date = d3.min(data, function(d) { return d.birth; });
    latest_date = d3.max(data, function(d) { return d.death; });
    y.domain([earliest_date - 10, latest_date + 10]);

    var bar = chart.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('translate', function(d) { return 'translate(' + x(d.name) + ', 0)'; })

    bar.append('rect')
        .attr('y', function(d) { return y(d.death); })
        .attr('height', function(d) { return y(d.birth) - y(d.death); })
        .attr('width', x.rangeBand())
        .attr('fill', 'steelblue')
});
