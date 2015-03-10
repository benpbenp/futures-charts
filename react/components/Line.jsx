
var React = require('react');

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

module.exports = Line;
