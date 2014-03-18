var port = process.argv[3] || 5975;
var express = require('express');
var app = express();
var dir = process.cwd();

app.configure(function() {
    var hourMs = 1000 * 60 * 60;
    app.use(express.static(dir, { maxAge: hourMs }));
    app.use(express.directory(dir));
    app.use(express.errorHandler());
});

app.listen(port);
console.log('Panda.js server started at http://localhost:' + port);