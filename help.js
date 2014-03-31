var data = require('./package.json');

console.log(data.description.title + ' ' + ('v' + data.version).number);
if(process.argv[2] === 'version') return;

console.log('');
console.log('Usage: ' + 'panda'.command + ' ' + '[command]'.parameter);
console.log('');
console.log('Commands:');
for (var i = 0; i < commands.length; i++) {
    console.log('       ' + commands[i].command);
}
console.log('');