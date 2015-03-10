
var React = require('react');

var MovingLineChart = require( './components/MovingLineChart');

var TimeChart = require('./components/TimeChart');

var request = require('superagent');
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

//var timedata1 = request.get('/data/cl/', function(error, response, body) {
//    console.log(error, response, body);
//});

console.log(typeof(window));

var App = React.createClass({
    render: function(){
        return (<div><TimeChart data={timedata}/>
        </div>
        )
    }

});

module.exports = App;
