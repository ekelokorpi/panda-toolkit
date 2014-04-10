var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(disallowPaddingNewlinesInBlocks) {
        assert(
            disallowPaddingNewlinesInBlocks === true,
            'disallowPaddingNewlinesInBlocks option requires the value true or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowPaddingNewlinesInBlocks';
    },

    check: function(file, errors) {
        var firstBlock = true;

        file.iterateNodesByType('BlockStatement', function(node) {
            if (node.body.length === 0) {
                return;
            }

            if(firstBlock) {
                firstBlock = false;
                return;
            }

            var tokens = file.getTokens();
            var openingBracketPos = file.getTokenPosByRangeStart(node.range[0]);

            var openingBracket = tokens[openingBracketPos];
            var nextToken = tokens[openingBracketPos + 1];

            var comments = file.getComments();

            var nextPos = openingBracket.loc.start.line + 1;

            var commentRows = 0;
            for (var i = 0; i < comments.length; i++) {
                if(comments[i].loc.start.line >= nextPos && comments[i].loc.start.line < nextToken.loc.start.line) {
                    commentRows += (comments[i].loc.end.line - comments[i].loc.start.line) + 1;
                }
            }
            nextPos += commentRows;

            if (nextPos < nextToken.loc.start.line) {
                errors.add('Expected no padding newline after opening curly brace', openingBracket.loc.end);
            }

            var closingBracketPos = file.getTokenPosByRangeStart(node.range[1] - 1);
            var closingBracket = tokens[closingBracketPos];
            var prevToken = tokens[closingBracketPos - 1];

            var prevPos = prevToken.loc.start.line + 1;

            var commentRows = 0;
            for (var i = 0; i < comments.length; i++) {
                if(comments[i].loc.start.line >= prevPos && comments[i].loc.start.line < closingBracket.loc.start.line) {
                    commentRows += (comments[i].loc.end.line - comments[i].loc.start.line) + 1;
                }
            }
            prevPos += commentRows;

            if (closingBracket.loc.start.line > prevPos) {
                errors.add('Expected no padding newline before closing curly brace', prevToken.loc.end);
            }
        });
    }

};
