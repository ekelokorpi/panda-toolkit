var commands = {
    build: 'Build project',
    create: 'Create new project',
    update: 'Update engine',
    lint: 'Validate your code'
    // server: ['Start web server', 'server', 'start', 's'],
    // version: ['Version control', 'version', 'v'],
    // compress: ['Compress image files', 'compress', 'tinypng'],
};

var panda = {
    help: function() {
        var data = require('./package.json');
        console.log(data.description + ' ' + data.version);
        console.log('');
        console.log('Usage: panda <command> [options]');
        console.log('');
        console.log('Commands:');
        for (var name in commands) {
            console.log('       ' + name + '\t' + commands[name]);
        }
    }
};

for (var name in commands) {
    panda[name] = require('./' + name);
}

module.exports = exports = panda;
