var port = process.argv[3] || 5975;
var express = require('express');
var app = express();
var dir = process.cwd();

console.log('Starting Panda.js server...'.title);
app.configure(function() {
    var hourMs = 1000 * 60 * 60;
    app.use(express.static(dir, { maxAge: hourMs }));
    app.use(express.directory(dir));
    app.use(express.errorHandler());
});

app.listen(port);
console.log('Server started at ' + ('http://localhost:' + port).url);