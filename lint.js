var lint = function(dir, callback, params) {    
    var JSCS = require('jscs');
    var loader = require('jscs/lib/cli-config');
    var vow = require('jscs/node_modules/vow');
    var checker = new JSCS();
    var files = [];
    var errorData = [];

    if (params.length > 0) {
        for (var i = 0; i < params.length; i++) {
            files.push(dir + '/' + params[i]);
        }
    }
    else {
        files.push(dir + '/src/engine');
        files.push(dir + '/src/game');
    }

    // Load config file
    var config = loader.load('.jscsrc', __dirname);
    if (!config) return callback('Error loading config file.');

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
                    errorData.push(file + ' line ' + error.line + ' col ' + error.column + ' ' + error.message);
                    console.log(file + ' line ' + error.line + ' col ' + error.column + ' ' + error.message);
                }
            }
        });

        if (errorCount) callback('Total ' + errorCount + ' errors found.', errorData);
        else callback('Your code is valid!');
    };
    
    console.log('Validating code...');
    vow.all(files.map(checker.checkPath, checker)).then(function(results) {
        parseResults(results);
    }).fail(function(e) {
        console.log(e);
        callback('Error reading files.');
    });
};

module.exports = exports = lint;
