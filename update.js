var update = function(dir, callback, params) {
    console.log('Updating engine...');

    if (!dir) return callback('Directory not set');

    var fs = require('fs');
    var download = require('download');
    var path = require('path');

    // Settings
    var tempDir = path.join(dir, '.panda');
    var devMode = (params[0] === 'dev');
    var url = 'https://github.com/ekelokorpi/panda.js/archive/' + (devMode ? 'develop' : 'master') + '.zip';

    if (devMode) console.log('(develop version)');

    var filesToMove = [];

    function moveFiles() {
        if (filesToMove.length === 0) {
            rmdir(tempDir);
            callback();
            return;
        }
        var file = filesToMove.shift();

        fs.rename(path.join(tempDir, '/src/engine/', file), path.join(dir, '/src/engine/', file), function(err) {
            if (err) return callback('Error moving file');

            moveFiles();
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

    fs.stat(path.join(dir, 'src/engine'), function(err) {
        if (err) return callback('Engine not found');

        fs.mkdir(tempDir, function(err) {
            if (err) return callback('Error creating temp folder');

            var wget = download(url, tempDir, { extract: true, strip: 1 });

            wget.on('error', function(err) {
                if (err) return callback('Error downloading update');
            });

            wget.on('close', function() {
                fs.readdir(path.join(tempDir, '/src/engine'), function(err, files) {
                    if (err) return callback('Error reading temp folder');

                    filesToMove = files;
                    moveFiles();
                });
            });
        });
    });
};

module.exports = exports = update;
