var data = require('./package.json');

console.log(data.description.title + ' ' + ('v' + data.version).number);
console.log('');
console.log('Usage: ' + 'panda'.command + ' ' + '[command]'.parameter);
console.log('');
console.log('Commands:');
for (var i in commands) {
    console.log('       ' + commands[i][1].command + '\t' + commands[i][0].grey);
}
console.log('');