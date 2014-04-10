var JSCS = require('jscs');
var loader = require('jscs/lib/cli-config');
var Vow = require('jscs/node_modules/vow');
var checker = new JSCS();

checker.registerRule(new (require('jscs/lib/rules/require-curly-braces'))());
checker.registerRule(new (require('jscs/lib/rules/require-multiple-var-decl'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-multiple-var-decl'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-empty-blocks'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-space-after-keywords'))());
checker.registerRule(new (require('jscs/lib/rules/require-parentheses-around-iife'))());
checker.registerRule(new (require('jscs/lib/rules/require-left-sticked-operators'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-left-sticked-operators'))());
checker.registerRule(new (require('jscs/lib/rules/require-right-sticked-operators'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-right-sticked-operators'))());
checker.registerRule(new (require('jscs/lib/rules/require-operator-before-line-break'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-implicit-type-conversion'))());
checker.registerRule(new (require('jscs/lib/rules/require-camelcase-or-uppercase-identifiers'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-keywords'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-multiple-line-breaks'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-multiple-line-strings'))());
checker.registerRule(new (require('jscs/lib/rules/validate-line-breaks'))());
checker.registerRule(new (require('jscs/lib/rules/validate-quote-marks'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-trailing-whitespace'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-mixed-spaces-and-tabs'))());
checker.registerRule(new (require('jscs/lib/rules/require-keywords-on-new-line'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-keywords-on-new-line'))());
checker.registerRule(new (require('jscs/lib/rules/require-line-feed-at-file-end'))());
checker.registerRule(new (require('jscs/lib/rules/maximum-line-length'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-yoda-conditions'))());
checker.registerRule(new (require('jscs/lib/rules/require-spaces-inside-object-brackets'))());
checker.registerRule(new (require('jscs/lib/rules/require-spaces-inside-array-brackets'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-spaces-inside-object-brackets'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-spaces-inside-array-brackets'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-spaces-inside-parentheses'))());
checker.registerRule(new (require('jscs/lib/rules/require-blocks-on-newline'))());
checker.registerRule(new (require('jscs/lib/rules/require-space-after-object-keys'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-space-after-object-keys'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-quoted-keys-in-objects'))());
checker.registerRule(new (require('jscs/lib/rules/require-aligned-object-values'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-comma-before-line-break'))());
checker.registerRule(new (require('jscs/lib/rules/require-comma-before-line-break'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-space-before-postfix-unary-operators.js'))());
checker.registerRule(new (require('jscs/lib/rules/require-space-before-postfix-unary-operators.js'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-space-after-prefix-unary-operators.js'))());
checker.registerRule(new (require('jscs/lib/rules/require-space-after-prefix-unary-operators.js'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-space-before-binary-operators'))());
checker.registerRule(new (require('jscs/lib/rules/require-space-before-binary-operators'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-space-after-binary-operators'))());
checker.registerRule(new (require('jscs/lib/rules/require-space-after-binary-operators'))());
checker.registerRule(new (require('jscs/lib/rules/require-spaces-in-function-expression'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-spaces-in-function-expression'))());
checker.registerRule(new (require('jscs/lib/rules/require-spaces-in-anonymous-function-expression'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-spaces-in-anonymous-function-expression'))());
checker.registerRule(new (require('jscs/lib/rules/require-spaces-in-named-function-expression'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-spaces-in-named-function-expression'))());
checker.registerRule(new (require('jscs/lib/rules/require-spaces-in-function-declaration'))());
checker.registerRule(new (require('jscs/lib/rules/disallow-spaces-in-function-declaration'))());
checker.registerRule(new (require('jscs/lib/rules/require-capitalized-constructors'))());
checker.registerRule(new (require('jscs/lib/rules/safe-context-keyword'))());
checker.registerRule(new (require('jscs/lib/rules/require-dot-notation'))());

// Panda rules
checker.registerRule(new (require('./rules/disallow-dangling-underscores.js'))());
checker.registerRule(new (require('./rules/disallow-padding-newlines-in-blocks.js'))());
checker.registerRule(new (require('./rules/require-space-after-keywords.js'))());
checker.registerRule(new (require('./rules/require-space-before-block-statements.js'))());
checker.registerRule(new (require('./rules/validate-indentation.js'))());
checker.registerRule(new (require('./rules/validate-jsdoc.js'))());

var config = loader.load('.jscsrc', __dirname);
if(!config) return console.log('Config file not found.'.error);

checker.configure(config);

var args = process.argv.splice(3);

if(args.length === 0) {
    args.push('src/engine');
    args.push('src/game');
}

var reporter = require('jscs/lib/reporters/console');

Vow.all(args.map(checker.checkPath, checker)).then(function(results) {
    var errorsCollection = [].concat.apply([], results);

    reporter(errorsCollection);
}).fail(function(e) {
    console.error(e.stack);
});