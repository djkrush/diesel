var vows = require('vows'),
    assert = require('assert'),
    diesel = require('../../source/JavaScript/diesel.js').diesel;

vows.describe('When calling makeLexer').addBatch({
    'With an empty regular expression table': {
        topic: function () { return diesel.makeLexer([]); },

        'and tokenizing an empty string': {
            topic: function (lexer) { return lexer.tokenize(''); },

            'it should return an empty token array': function (topic) {
                assert.equal(topic.tokens.length, 0);
            },
            'it should return an empty errors array': function (topic) {
                assert.equal(topic.errors.length, 0);
            },
        },
        'and tokenizing a non empty string': {
            topic: function (lexer) { return lexer.tokenize('Hello World'); },

            'it should return an empty token array': function (topic) {
                assert.equal(topic.tokens.length, 0);
            },
            'it should return a syntax error': function (topic) {
                assert.equal(topic.errors.length > 0, true);
            }
        }
    }
}).export(module);
