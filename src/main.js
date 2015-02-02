var Chart = React.createClass({
    render : function(){
        return (
            <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
        );
    }
});

/*var Bar = React.createClass({
    getDefaultProps: function(){
        return {
            width: 0,
            height: 0,
            offset: 0,
        }
    },
    render: function() {
        return (
            <rect fill={this.props.color}
            width={this.props.width} height={this.props.height}
            x={this.props.offset} y={this.props.availableHeight - this.props.height} />
            );
    }
});
var DataSeries = React.createClass({
    getDefaultProps: function(){
        return {
            title: '',
            data: []
        }
    },
    render: function() {
        var props = this.props;

        var yScale = d3.scale.linear()
            .domain([0, d3.max(this.props.data)])
            .range([0, this.props.height]);

        var xScale = d3.scale.ordinal()
            .domain(d3.range(this.props.data.length))
            .rangeRoundBands([0, this.props.width], 0.05);

        var bars = _.map(this.props.data, function(point, i) {
            return (
                <Bar height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} color={props.color} key={i} />
                )
        });

        return (
            <g>{bars}</g>
            );
    }
});
var BarChart = React.createClass({
    render: function() {
        return (
            <Chart width={this.props.width} height={this.props.height}>
                <DataSeries data={[30,10,5,8,15,10]} width={this.props.width} height={this.props.height} color="cornflowerblue"/>
            </Chart>
            );
    }
});
*/

var Line = React.createClass({
    getDefaultProps: function() {
        return {
            path: '',
            color: 'blue',
            width: 2
        }
    },

    render: function() {
        return (
            <path d={this.props.path} stroke={this.props.color} strokeWidth={this.props.width} fill="None"/>
            );
    }
});

var DataSeries = React.createClass({
    getDefaultProps: function() {
        return {
            data: [],
            interpolate: 'linear'
        }
    },

    render: function() {
        var self = this,
        props = this.props,
        yScale = props.yScale,
        xScale = props.xScale;
        var path = d3.svg.line()
            .x(function(d) { return xScale(d.x); })
            .y(function(d) { return yScale(d.y); })
            .interpolate(this.props.interpolate);
        
        return (
            <Line path={path(this.props.data)} color={this.props.color} />
            )
    }
});

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
                <Chart width={this.props.width} height={this.props.height}>
                    <DataSeries data={data[this.state.counter]} size={size} xScale={xScale} yScale={yScale}  ref="series1" color="cornflowerblue"/>
                </Chart>
            );
    }

});

var data = { 
      series1: [ { 'x': 0, 'y': 20 }, { 'x': 1, 'y': 30 }, { 'x': 2, 'y': 10 }, { 'x': 3, 'y': 5 }, { 'x': 4, 'y': 8 }, { 'x': 5, 'y': 15 }, { 'x': 6, 'y': 10 } ],
        series2: [ { x: 0, y: 8 }, { x: 1, y: 5 }, { x: 2, y: 20 }, { x: 3, y: 12 }, { x: 4, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 2 } ],
          series3: [ { x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 2 }, { x: 4, y: 6 }, { x: 5, y: 4 }, { x: 6, y: 2 } ]          
};

var timedata = [
        
      [ { 'x': 0, 'y': 20 }, { 'x': 1, 'y': 30 }, { 'x': 2, 'y': 10 }, { 'x': 3, 'y': 5 }, { 'x': 4, 'y': 8 }, { 'x': 5, 'y': 15 }, { 'x': 6, 'y': 10 } ],
      [ { x: 0, y: 8 }, { x: 1, y: 5 }, { x: 2, y: 20 }, { x: 3, y: 12 }, { x: 4, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 2 } ],
      [ { x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 2 }, { x: 4, y: 6 }, { x: 5, y: 4 }, { x: 6, y: 2 } ]          

];
var linechart = React.renderComponent(
    <MovingLineChart data={timedata}/>,
    document.getElementById('container')
    );

d3.select('button').on('click', function(){
    linechart.animate(); 
});
