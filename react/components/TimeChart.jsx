
var React = require('react');

var _ = require('underscore');

var d3 = require('d3');

var request = require('superagent');

var Chart = require( './Chart');

var Line = require( './Line');

var DataSeries = require( './DataSeries');
var TimeChart = React.createClass({
    getDefaultProps: function() {
        return {
            width: 600,
            height: 300
        }
    },

    getInitialState: function() {

        return {
            data: [{price_date:0,data:[]}],
            price_date: 0,
        }
    },
    

    animate: function(){
        var current_index = this.state.price_dates.indexOf(this.state.price_date);
        var next_index = (current_index + 1) % this.state.price_dates.length;
        this.setState({'price_date': this.state.price_dates[next_index]});
        //d3.select(this.getDOMNode()).select('path').transition().attr('d', this.props.paths[this.state.counter % this.props.paths.length]);
    },
    componentDidMount: function() {
        var component = this;
        request.get('/data/cl',
            function(res) { 
                var fulldata = JSON.parse(res.text);
                fulldata = fulldata.map( function(set) { return {price_date: set.price_date, data: set.data.map( function(point) { return {x: new Date(point.x), y: point.y}; } )}; });
                var price_dates = fulldata.map(function (set) { return set.price_date;});
                component.setState(
                    {'data' : fulldata, 'price_date' : price_dates[1900], 'price_dates' : price_dates }
               );
            });

    },

    render: function() {
        var component = this;
        var data = _.find(this.state.data, function(item) { return item.price_date == component.state.price_date}).data,

        size = { width: this.props.width, height: this.props.height };
        var maxx = _.max(data, function(point) { return point.x; }).x;
        var maxy = _.max(data, function(point) { return point.y; }).y;

        var minx = _.min(data, function(point) { return point.x; }).x;
        var miny = _.min(data, function(point) { return point.y; }).y;
      
        var display_date = this.state.price_date == 0 ? "" : new Date(this.state.price_date * 1000).toDateString();

       
        var date_display = function(date){ return new Date(date * 1000);}; 
        console.log(this.props.display_date);
        var xScale = d3.time.scale()
            .domain([minx, maxx])
            .range([0,this.props.width]);
       
        var yScale = d3.scale.linear()
            .domain([miny,maxy])
            .range([this.props.height,0]);

         var xAxis = d3.svg.axis().scale(xScale).tickSize(-this.props.height).tickSubdivide(true),
             yAxis = d3.svg.axis().scale(yScale).ticks(4).orient("right");


        return (
            <div>
            <Chart width={this.props.width} height={this.props.height}>
                <DataSeries data={data} size={size} xScale={xScale} yScale={yScale} ref="series1" color="cornflowerblue" />
            </Chart>
            <h1>{display_date}</h1>
            <button onClick={this.animate}>Animate</button>
            </div>
        );
    }
});

module.exports = TimeChart;
