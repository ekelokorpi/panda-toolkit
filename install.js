var fs = require('fs');
var download = require('download');
var path = require("path");

// Settings
var tempDir = '.panda';
var devMode = (process.argv[3] === 'dev');
var engineUrl = 'https://github.com/ekelokorpi/panda.js/archive/' + (devMode ? 'develop' : 'master') + '.zip';
var templateUrl = 'https://github.com/ekelokorpi/panda.js-template/archive/master.zip';

console.log('Installing Panda.js engine...'.title);
if (devMode) console.log('(develop version)');

var engineFilesToMove = [
    'src/engine',
    'index.html'
];

function moveEngineFiles() {
    if (engineFilesToMove.length === 0) {
        rmdir(tempDir);
        console.log('Done'.valid);
        return;
    }
    var file = engineFilesToMove.shift();

    fs.rename(tempDir + '/' + file, file, function(err) {
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

fs.mkdir(tempDir, function(err) {
    if (err) return console.log('Error creating temp dir'.error);

    fs.mkdir('src', function(err) {
        if (err) return console.log('Error creating src dir'.error);
        
        var wget = download(engineUrl, tempDir, { extract: true, strip: 1 });

        wget.on('error', function(err) {
            if (err) return console.log('Error downloading engine'.error);
        });

        wget.on('close', function() {
            var wget = download(templateUrl, 'src/game', { extract: true, strip: 1 });

            wget.on('error', function(err) {
                if (err) return console.log('Error downloading template'.error);
            });

            wget.on('close', function() {
                moveEngineFiles();
            });
        });
    });
});
