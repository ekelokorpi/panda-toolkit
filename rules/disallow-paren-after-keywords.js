var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(keywords) {
        assert(Array.isArray(keywords), 'disallowParenthesesAfterKeywords option requires array value');
        this._keywordIndex = {};
        for (var i = 0, l = keywords.length; i < l; i++) {
            this._keywordIndex[keywords[i]] = true;
        }
    },

    getOptionName: function() {
        return 'disallowParenthesesAfterKeywords';
    },

    check: function(file, errors) {
        var keywordIndex = this._keywordIndex;

        file.iterateTokensByType([ 'Keyword', 'Identifier' ], function(token, i, tokens) {
            if (keywordIndex[token.value] === true) {
                var nextToken = tokens[i + 1];

                if (nextToken) {
                    if (nextToken.value === '(') {
                        errors.add(
                            'Operator ( disallowed after `' + token.value + '` keyword',
                            nextToken.loc.start.line,
                            nextToken.loc.start.column
                        );
                    }
                }
            }
        });
    }

};
