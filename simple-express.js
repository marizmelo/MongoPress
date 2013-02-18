// Module dependencies.
var express = require('express');

var app = express();

// Routes
app.get('/', function(req, res) {
    res.send('Hello World');
});

app.listen(4040);