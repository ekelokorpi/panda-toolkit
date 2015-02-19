var create = function(dir, options, callback) {
    if (!dir) return callback(true);
    options = options || {};

    var fs = require('fs');
    var download = require('download');
    var path = require('path');

    var tempDir = '.panda';
    var devMode = !!options.dev;
    var engineUrl = 'https://github.com/ekelokorpi/panda.js/archive/' + (devMode ? 'develop' : 'master') + '.zip';
    var templateUrl = 'https://github.com/ekelokorpi/panda.js-template/archive/master.zip';
    var folder = options.param || '.';

    console.log('Creating new project...'.title);
    if (devMode) console.log('(develop version)');

    var engineFilesToMove = [
        'src/engine',
        'index.html',
        'dev.html'
    ];

    function moveEngineFiles() {
        if (engineFilesToMove.length === 0) {
            rmdir(dir + '/' + tempDir);
            fs.mkdir(dir + '/' + folder + '/media', function() {
                console.log('Done'.valid);
                callback();
            });
            return;
        }
        var file = engineFilesToMove.shift();

        fs.rename(dir + '/' + tempDir + '/' + file, dir + '/' + folder + '/' + file, function(err) {
            if (err) return console.log('Error moving file'.error);

            moveEngineFiles();
        });
    };

    function rmdir(dir) {
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(dir, files[i]);
            var stat = fs.statSync(filename);
            
            if (stat.isDirectory()) rmdir(filename);
            else fs.unlinkSync(filename);
        }
        fs.rmdirSync(dir);
    };

    function createProject() {
        fs.mkdir(dir + '/' + folder + '/src', function(err) {
            if (err) return console.log('Error creating src folder'.error);
            
            var wget = download(engineUrl, dir + '/' + tempDir, { extract: true, strip: 1 });

            wget.on('error', function(err) {
                if (err) return console.log('Error downloading engine'.error);
            });

            wget.on('close', function() {
                var wget = download(templateUrl, dir + '/' + folder + '/src/game', { extract: true, strip: 1 });

                wget.on('error', function(err) {
                    if (err) return console.log('Error downloading template'.error);
                });

                wget.on('close', function() {
                    moveEngineFiles();
                });
            });
        });
    };

    function start() {
        fs.mkdir(dir + '/' + tempDir, function(err) {
            if (err) return console.log('Error creating temp folder'.error);

            if (folder === '.') {


                createProject();
            }
            else {
                fs.mkdir(folder, function(err) {
                    if (err) {
                        rmdir(dir + '/' + tempDir);
                        return console.log('Error creating project folder'.error);
                    }
                    else {
                        createProject();
                    }
                });
            }
        });
    };

    if (folder === '.') {
        fs.readdir(dir, function(err, files) {
            if (files.length > 0) callback('Project folder must be empty');
            else {
                start();
            }
        });
    }
    else {
        start();
    }
};

module.exports = exports = create;
