var WebSocketServer = require('ws').Server;
var port = process.argv[3] || 8080;

var wss = new WebSocketServer({port: port});

var getTimestamp = function() {
    var date = new Date();
    
    var hours = date.getHours().toString();
    if(hours.length === 1) hours = '0' + hours;

    var minutes = date.getMinutes().toString();
    if(minutes.length === 1) minutes = '0' + minutes;

    var seconds = date.getSeconds().toString();
    if(seconds.length === 1) seconds = '0' + seconds;

    var timestamp = hours + ':' + minutes + ':' + seconds;

    return timestamp;
};

var clientId = 0;

wss.on('connection', function(client) {
    client.id = clientId++;

    console.log((client.id+' ').red + 'Client connected.'.yellow);
    client.on('message', function(data, flags) {
        console.log((client.id+' ').red + getTimestamp().number + ' > '.grey + data);
    });
});

console.log(('Debug server started on port ' + port).title);