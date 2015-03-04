
var React = require('react');

var LineChart = React.createClass({
    getDefaultProps: function() {
        return {
            width: 600,
            height: 300
        }
    },

    render: function() {
        var data = this.props.data,
        size = { width: this.props.width, height: this.props.height };
        var max = _.chain(data.series1, data.series2, data.series3)
            .zip()
            .map(function(values) {
                return _.reduce(values, function(memo, value) { return Math.max(memo, value.y); }, 0);
            })
            .max()
            .value();
            
             
        var xScale = d3.scale.linear()
            .domain([0, 6])
            .range([0,this.props.width]);
        
        var yScale = d3.scale.linear()
            .domain([0,max])
            .range([this.props.height,0]);
        return (
            <Chart width={this.props.width} height={this.props.height}>
                <DataSeries data={data.series1} size={size} xScale={xScale} yScale={yScale} ref="series1" color="cornflowerblue" />
                <DataSeries data={data.series2} size={size} xScale={xScale} yScale={yScale} ref="series2" color="red" />
                <DataSeries data={data.series3} size={size} xScale={xScale} yScale={yScale} ref="series3" color="green" />
            </Chart>
        );
    }
});

module.exports = LineChart;
