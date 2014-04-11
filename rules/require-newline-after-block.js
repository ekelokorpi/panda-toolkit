var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(requireNewlineAfterBlock) {
        assert(
            typeof requireNewlineAfterBlock === 'boolean',
            'requireNewlineAfterBlock option requires boolean value'
        );
        assert(
            requireNewlineAfterBlock === true,
            'requireNewlineAfterBlock option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireNewlineAfterBlock';
    },

    check: function(file, errors) {
        var lines = file.getLines();

        file.iterateNodesByType('BlockStatement', function(node) {
            if (node.body.length === 0) return;

            var endLine = node.loc.end.line;
            var nextLine = lines[endLine];

            var tokens = file.getTokens();
            var closingBracketPos = file.getTokenPosByRangeStart(node.range[1] - 1);
            var nextToken = tokens[closingBracketPos + 1];
            var nextNextToken = tokens[closingBracketPos + 2];

            if (typeof nextLine === 'string' && nextLine.trim() !== '' && nextToken.value === ',' && nextNextToken.loc.start.line > endLine) {
                errors.add('No new line after block', endLine);
            }
        });
    }

};
