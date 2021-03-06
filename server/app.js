var express = require('express');
var app = express();
var path = require('path')
var url = require('url');
require('node-jsx').install({extension: '.jsx'});
var React = require('react');
var App = require('../react/App.jsx');

var api = require('./api.js');

var async = require('async');

const fs = require('fs');
var handlebars = require('handlebars');

const QUANDL_AUTH_TOKEN = process.env.QUANDL_AUTH_TOKEN;


var appTemplate = handlebars.compile( fs.readFileSync(path.join(__dirname + '/../static/','template.html'), 'utf8'));

app.use(express.static(path.resolve(__dirname+ '/../public/')));

app.use('/static',express.static(path.resolve(__dirname+ '/../static/')));

app.use('/output', express.static(path.resolve(__dirname+ '/../output/')));

app.get('/data/:commodity', function(req, res) {
    api.getData(req.params.commodity, {'most_recent' : false, 'callback': function(result) { res.send(result);}});

});
app.get('/data/:commodity/:start/:end', function(req, res) {
    
    res.send(res, api.getData(req.params.commodity, {'start' : req.params.start, 'end' : req.params.end}));

});
app.get('/', function(req, res){
    var path = url.parse(req.url).pathname;
    var content = React.renderTo
    var content = appTemplate({
      content: React.renderToString(React.createElement(App, {path: path}))
      //,payload: encodeTextContent(JSON.stringify(payload))
    });
    res.send(content); 
});

var server = app.listen(3000, function(){
    
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s' , host, port);

});



