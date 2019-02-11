module.exports = exports = function(dir, callback, arguments) {
    console.log('Building project...');
    arguments = arguments || [];
    
    if (!dir) return callback('Directory not set');

    var UglifyJS = require('uglify-es');
    var fs = require('fs');
    var path = require('path');
    var htmlparser = require("htmlparser");
    var sourceFolder = arguments[1] || 'src';
    var outDir = arguments[2] || dir;
    var htmlFile = arguments[4] || 'index.html';

    try {
        var pandaCore = require(path.join(dir, sourceFolder, 'engine/core.js'));
    }
    catch (e) {
        return callback('Engine not found');
    }

    var target = arguments[0] || 'game';
    var header = '// Made with Panda 2 (Engine v' + pandaCore.version + ') - www.panda2.io\n';
    var outputFile = target === 'core' ? 'panda.min.js' : arguments[3] || 'game.min.js';
    
    global.game = {
        modules: [],
        config: {},

        module: function(name) {
            if (this.config.ignoreModules && this.config.ignoreModules.indexOf(name) !== -1) {
                return this;
            }

            name = name.replace(/\./g, '/') + '.js';
            if (this.modules.indexOf(name) === -1) {
                this.modules.unshift(name);
            }
            return this;
        },

        require: function() {
            var i, name, modules = Array.prototype.slice.call(arguments);
            for (i = 0; i < modules.length; i++) {
                if (this.config.ignoreModules && this.config.ignoreModules.indexOf(modules[i]) !== -1) continue;

                name = modules[i].replace(/\./g, '/') + '.js';
                if (this.modules.indexOf(name) === -1) {
                    this.modules.unshift(name);
                    require(path.join(dir, sourceFolder, name));
                }
            }
            return game;
        },

        body: function() {}
    };

    var tagsToFind = [];
    var scriptTags = [];

    var findScriptTags = function() {
        var tag = tagsToFind.pop();
        if (!tag) {
            requireScriptTags();
            return;
        }

        if (tag.name === 'script') scriptTags.push(tag);

        if (tag.children) {
            for (var i = 0; i < tag.children.length; i++) {
                tagsToFind.push(tag.children[i]);
            }
        }

        findScriptTags();
    };

    var requireScriptTags = function() {
        for (var i = 0; i < scriptTags.length; i++) {
            require(path.join(dir, scriptTags[i].attribs.src));
        }

        var gameModules = [];
        for (var i = 0; i < game.modules.length; i++) {
            if (game.modules[i].indexOf('engine') === 0) continue;
            gameModules.push(game.modules[i]);
        }

        game.modules.length = 0;

        // Clean config
        delete game.config.debug;
        delete game.config.name;
        game.config.ignoreModules = game.config.ignoreModules || [];

        if (target !== 'core') {
            // Skip debug module
            if (game.config.ignoreModules.indexOf('engine.debug') === -1) {
                game.config.ignoreModules.push('engine.debug');
            }
        }

        // Parse engine files
        for (var i = 0; i < pandaCore._coreModules.length; i++) {
            var file = pandaCore._coreModules[i].replace(/\./g, '/');
            var filePath = path.join(dir, sourceFolder, file);
            delete require.cache[require.resolve(filePath)];
            require(filePath);
        }

        // Include core module
        game.modules.unshift('engine/core.js');

        // Include dir in modules
        for (var i = 0; i < game.modules.length; i++) {
            game.modules[i] = path.join(dir, sourceFolder, game.modules[i]);
        }

        var minifyFiles = function(files, output) {
            output = output || '';
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var code = fs.readFileSync(file, 'utf8');
                var result = UglifyJS.minify(code);
                output += result.code;
            }
            return output;
        }

        // Minify core
        var output = minifyFiles(game.modules);

        var minifyGameCode = function() {
            // Remove engine modules and include dir in game modules
            for (var i = game.modules.length - 1; i >= 0; i--) {
                if (game.modules[i].indexOf('engine/') === 0) {
                    game.modules.splice(i, 1);
                }
                else {
                    game.modules[i] = path.join(dir, sourceFolder, game.modules[i]);
                }
            }

            if (target !== 'core') {
                // Minify game code
                output += minifyFiles(game.modules);
            }

            writeOutput();
        };

        var writeOutput = function() {
            // Write output file
            fs.writeFile(path.join(outDir, outputFile), output, function(err) {
                if (err) {
                    callback('Error writing file ' + outputFile);
                }
                else {
                    console.log('Saved ' + outputFile);
                    callback();
                }
            });
        };

        if (target !== 'core') {
            // Include header
            output = header + output;

            // Include config
            output += 'game.config=' + JSON.stringify(game.config) + ';';
        }

        game.modules = gameModules;
        minifyGameCode();
    };

    var rawHtml = fs.readFileSync(path.join(dir, htmlFile));
    var handler = new htmlparser.DefaultHandler(function(error, dom) {
        tagsToFind = dom;
        findScriptTags();
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rawHtml);
    
};
