
var React = require('react');

var _ = require('underscore');

var d3 = require('d3');

var Chart = require( './Chart');

var Line = require( './Line');

var DataSeries = require( './DataSeries');

var MovingLineChart = React.createClass({

    getDefaultProps: function() {
        return {
            width: 600,
            height: 300
        }
    },

    getInitialState: function() {
        return {
            counter: 0
        };
    },

    animate: function(){
        this.state.counter++;
        console.log(this.state.counter);
        d3.select(this.getDOMNode()).select('path').transition().attr('d', this.props.paths[this.state.counter % this.props.paths.length]);
    },
    render: function() {
        var data = this.props.data,
        size = { width: this.props.width, height: this.props.height };
        var max = _.chain(data[0],data[1], data[2])
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

        var paths = [];
        for(var i =0; i < data.length; i++){
            paths.push(
                    d3.svg.line()
                        .x(function(d) { return xScale(d.x); })
                        .y(function(d) { return yScale(d.y); })
                        .interpolate(this.props.interpolate)(data[i])

            );
        }
        this.props.paths = paths;
        return (
                <div><Chart width={this.props.width} height={this.props.height}>
                    <DataSeries data={data[this.state.counter]} size={size} xScale={xScale} yScale={yScale}  ref="series1" color="cornflowerblue"/>
                </Chart>
                <button onClick={this.animate}>Advance</button></div>
            );
    }

});

module.exports = MovingLineChart;
