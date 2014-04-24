var vows = require('vows'),
    assert = require('assert'),
    diesel = require('../../source/JavaScript/diesel.js').diesel,
    expectedExpression = /^\bHello World\b/i;

vows.describe('When calling makeTableEntry').addBatch({
    'With parameters': {
        topic: function () { return diesel.makeTableEntry('TokenName', expectedExpression); },

        'it sets the specified name': function (topic) {
            assert.equal(topic.tokenName, 'TokenName');
        },
        'it sets the specified expression': function (topic) {
            assert.equal(topic.expression, expectedExpression);
        }
    }
}).export(module);
