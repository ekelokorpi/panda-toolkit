module.exports = exports = function(dir, callback, params) {    
    var JSCS = require('jscs');
    var loader = require('jscs/lib/cli-config');
    var vow = require('jscs/node_modules/vow');
    var checker = new JSCS();
    var files = [];
    var errorData = [];

    checker.registerDefaultRules();

    if (params[1] === 'fix') {
        checker.configure({
            validateIndentation: 4,
            disallowMultipleLineBreaks: true,
            disallowMultipleSpaces: true,
            disallowTrailingWhitespace: true,
            disallowMixedSpacesAndTabs: true,
            disallowMultipleLineStrings: true,
            disallowMultipleVarDecl: true,
            disallowNewlineBeforeBlockStatements: true,
            disallowPaddingNewlinesInBlocks: true,
            disallowSpacesInCallExpression: true,
            disallowTrailingComma: true,
            disallowYodaConditions: true,
            requireAnonymousFunctions: true,
            requireBlocksOnNewline: true,
            requireCamelCaseOrUpperCaseIdentifiers: true,
            requireCapitalizedComments: true,
            requireCommaBeforeLineBreak: true,
            requireCurlyBraces: true,
            requireKeywordsOnNewLine: ['else'],
            requireLineBreakAfterVariableAssignment: true,
            requireOperatorBeforeLineBreak: true,
            requirePaddingNewLineAfterVariableDeclaration: true,
            requirePaddingNewLinesAfterBlocks: true,
            requirePaddingNewlinesBeforeKeywords: true,
            requirePaddingNewLinesInObjects: true,
            requireSemicolons: true,
            requireSpaceAfterBinaryOperators: true,
            requireSpaceAfterKeywords: [
                'do',
                'for',
                'if',
                'else',
                'switch',
                'case',
                'try',
                'catch',
                'void',
                'while',
                'with',
                'return',
                'typeof'
            ]
        });

        var fix = checker.fixString(params[0]);
        callback(fix.output);
        return;
    }

    // Load config file
    var config = loader.load('.jscsrc', __dirname);
    if (!config) return callback('Error loading config file.');
    checker.configure(config);

    if (params.length > 0) {
        for (var i = 0; i < params.length; i++) {
            var file = params[i];
            if (file.indexOf('-') === 0) continue;
            files.push(dir + '/' + file);
        }
    }
    else {
        files.push(dir + '/src/engine');
        files.push(dir + '/src/game');
    }

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
