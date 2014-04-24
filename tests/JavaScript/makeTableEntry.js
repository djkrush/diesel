var vows = require('vows'),
    assert = require('assert'),
    diesel = require('../../source/JavaScript/diesel.js').diesel,
    expectedExpression = /^\bHello World\b/i;

vows.describe('When calling makeTableEntry').addBatch({
    'It should': {
        topic: function () { return diesel.makeTableEntry('TokenName', expectedExpression); },

        'sets the name': function (topic) {
            assert.equal(topic.tokenName, 'TokenName');
        },
        'set the expression': function (topic) {
            assert.equal(topic.expression, expectedExpression);
        }
    }
}).export(module);
