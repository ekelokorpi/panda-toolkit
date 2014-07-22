var JSCS = require('jscs');
var loader = require('jscs/lib/cli-config');
var vow = require('jscs/node_modules/vow');
var checker = new JSCS();
var args = process.argv.splice(3);
var watchMode = false;

// Parse options
for (var i = args.length - 1; i >= 0; i--) {
    if (args[i] === '-w') {
        args.splice(i, 1);
        watchMode = true;
    }
}

// Load default paths
if (args.length === 0) {
    args.push('src/engine');
    args.push('src/game');
}

// Load config file
var config = loader.load('.jscsrc', __dirname);
if (!config) return console.log('Error loading config file.'.error);

// Include path in exclude files
for (var i = 0; i < config.excludeFiles.length; i++) {
    config.excludeFiles[i] = process.cwd() + '/' + config.excludeFiles[i];
}

checker.registerDefaultRules();
checker.configure(config);

function parseResults(results) {
    var errorsCollection = [].concat.apply([], results);

    var errorCount = 0;

    errorsCollection.forEach(function(errors) {
        var file = errors.getFilename();
        if (!errors.isEmpty()) {
            var errorList = errors.getErrorList();

            for (var i = 0; i < errorList.length; i++) {
                var error = errorList[i];
                errorCount++;
                console.log(file.file + ' line ' + error.line.toString().number + ' col ' + error.column.toString().number + ' ' + error.message.error);
            }
        }
    });

    if (errorCount) console.log(('Total ' + errorCount + ' errors found.').error);
    else console.log('Your code is valid!'.valid);
};

function checkFiles(files) {
    console.log('Checking code style...'.title);

    vow.all(files.map(checker.checkPath, checker)).then(function(results) {
        parseResults(results);
    }).fail(function(e) {
        console.log('Error reading files.'.error);
    });
};

if (watchMode) {
    console.log('Watching for file changes...'.title);

    var watch = require('node-watch');

    watch(args, function(filename) {
        console.log(filename.file + ' changed.');
        checkFiles([filename]);
    });
    return true;
}
else {
    checkFiles(args);
}
