var commands = {
    // file: [desc, alias1, alias2, alias3...]
    build: 'Build project',
    // server: ['Start web server', 'server', 'start', 's'],
    // cache: ['Create cache manifest', 'cache', 'offline', 'c'],
    // check: ['Check code style', 'check', 'lint', 'valid', 'jscs', 'test', 'l'],
    // update: ['Update engine', 'update', 'u'],
    // version: ['Version control', 'version', 'v'],
    // compress: ['Compress image files', 'compress', 'tinypng'],
    create: 'Create new project'
};

var pandajs = {
	help: function() {
		var data = require('./package.json');

		console.log(data.description.title + ' ' + (data.version).number);
		console.log('');
		console.log('Usage: ' + 'panda'.command + ' ' + '[command]'.parameter);
		console.log('');
		console.log('Commands:');
		for (var name in commands) {
		    console.log('       ' + name.command + '\t' + commands[name].grey);
		}
		console.log('');
	}
};

for (var name in commands) {
	pandajs[name] = require('./' + name);
}

module.exports = exports = pandajs;
