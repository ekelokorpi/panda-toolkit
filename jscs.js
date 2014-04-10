var JSCS = require('jscs');
var loader = require('jscs/lib/cli-config');
var vow = require('jscs/node_modules/vow');
var checker = new JSCS();
var args = process.argv.splice(3);

console.log('Checking code style...'.title);

// Load config file
var config = loader.load('.jscsrc', __dirname);
if(!config) return console.log('Error loading config file.'.error);

// Include path in exclude files
for (var i = 0; i < config.excludeFiles.length; i++) {
    config.excludeFiles[i] = process.cwd() + '/' + config.excludeFiles[i];
}

// Load default paths
if(args.length === 0) {
    args.push('src/engine');
    args.push('src/game');
}

checker.registerDefaultRules();
checker.configure(config);

vow.all(args.map(checker.checkPath, checker)).then(function(results) {
    var errorsCollection = [].concat.apply([], results);

    var errorCount = 0;

    errorsCollection.forEach(function(errors) {
        var file = errors.getFilename();
        if (!errors.isEmpty()) {
            var errorList = errors.getErrorList();

            for (var i = errorList.length - 1; i >= 0; i--) {
                var error = errorList[i];
                errorCount++;
                console.log(file.file + ' line ' + error.line.toString().number + ' col ' + error.column.toString().number + ' ' + error.message.error);
            }
        }
    });

    if(errorCount) console.log(('Total ' + errorCount + ' errors found.').error);
    else console.log('Your code is valid!'.valid);
}).fail(function(e) {
    console.log('Error reading files.'.error);
});