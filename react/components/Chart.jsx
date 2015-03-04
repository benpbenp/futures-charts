var React = require('react');

var Chart = React.createClass({
    render : function(){
        return (
            <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
        );
    }
});

module.exports = Chart;
