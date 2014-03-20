var UglifyJS = require('uglify-js');
var fs = require('fs');
var i, file, size, result, output, totalSize = 0;
var configFile = process.argv[3] || 'src/game/config.js';

console.log('Building...'.title);

try {
    require(process.cwd() + '/' + configFile);
    console.log('Using config ' + configFile.file);
} catch(e) {
    // Load default config
    console.log('Using default config');
    pandaConfig = {
        sourceFolder: 'src',
        outputFile: 'game.min.js'
    };
    configFile = null;
}

var header = '// Made with Panda.js - http://www.pandajs.net';
var include = ['engine/core.js', 'game/main.js'];
var dir = process.cwd() + '/' + pandaConfig.sourceFolder + '/';

global['game'] = {};
game.modules = [];
game.module = function(name) {
    name = name.replace(/\./g, '/') + '.js';
    if(game.modules.indexOf(name) === -1) game.modules.push(name);
    return game;
};
game.require = function() {
    var i, name, modules = Array.prototype.slice.call(arguments);
    for (i = 0; i < modules.length; i++) {
        name = modules[i].replace(/\./g, '/') + '.js';
        if(game.modules.indexOf(name) === -1) {
            game.modules.push(name);
            require(dir + name);
        }
    }
    return game;
};
game.body = function() {};

for (i = 0; i < include.length; i++) {
    require(dir + include[i]);
}

for (i = 0; i < game.modules.length; i++) {
    file = game.modules[i];
    game.modules[i] = dir + game.modules[i];
    size = fs.statSync(game.modules[i]).size;
    totalSize += size;
    console.log(file.file + ' ' + (size.toString()).number + ' bytes');
}
if(configFile) game.modules.unshift(configFile);

console.log('Total ' + (totalSize.toString()).number + ' bytes');

result = UglifyJS.minify(game.modules);

output = header + '\n';

if(pandaConfig.sitelock) {
    var secret = 0;
    for (i = 0; i < pandaConfig.sitelock.length; i++) {
        secret += pandaConfig.sitelock[i].charCodeAt(0);
    }
    var sitelockFunc = 'var s='+secret+',h=0,n=location.hostname;for(var i=0;i<n.length;i++)h+=n[i].charCodeAt(0);if(s!==h)throw 0;';
    output += sitelockFunc;
}

output += result.code;

fs.writeFile(pandaConfig.outputFile, output, function(err) {
    if(err) console.log(err);
    else {
        var size = fs.statSync(pandaConfig.outputFile).size;
        var percent = Math.round((size / totalSize) * 100);
        console.log('Saved ' + pandaConfig.outputFile.file + ' ' + (size.toString()).number + ' bytes (' + percent + '%)');
    }
});