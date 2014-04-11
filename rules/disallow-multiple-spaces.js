var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(disallowMultipleSpaces) {
        assert(
            typeof disallowMultipleSpaces === 'boolean',
            'disallowMultipleSpaces option requires boolean value'
        );
        assert(
            disallowMultipleSpaces === true,
            'disallowMultipleSpaces option requires true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowMultipleSpaces';
    },

    check: function(file, errors) {
        file.iterateTokensByType(['Punctuator', 'Identifier', 'Keyword'], function(token, i, tokens) {
            var next = tokens[i + 1];
            if (next && token.loc.start.row === next.loc.start.row) {
                if (next && next.loc.start.column - token.loc.end.column > 1) {
                    errors.add('Illegal multiple spaces', token.loc.start);
                }
            }
        });
    }

};
