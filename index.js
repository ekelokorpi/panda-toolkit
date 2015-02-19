var commands = {
    build: 'Build project',
    create: 'Create new project'
    // server: ['Start web server', 'server', 'start', 's'],
    // cache: ['Create cache manifest', 'cache', 'offline', 'c'],
    // check: ['Check code style', 'check', 'lint', 'valid', 'jscs', 'test', 'l'],
    // update: ['Update engine', 'update', 'u'],
    // version: ['Version control', 'version', 'v'],
    // compress: ['Compress image files', 'compress', 'tinypng'],
};

var pandajs = {
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
	pandajs[name] = require('./' + name);
}

module.exports = exports = pandajs;
