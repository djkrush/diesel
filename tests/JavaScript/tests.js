var vows = require('vows'),
    assert = require('assert'),
    diesel = require('../../source/JavaScript/diesel.js').diesel;

vows.describe('When calling makeError').addBatch({
    'Without parameters': {
        topic: function () { return diesel.makeError(); },

        'it generates default message': function (topic) {
            assert.notEqual(topic.message, undefined);
        },
        'it leaves lineNumber undefined': function (topic) {
            assert.equal(topic.lineNumber, undefined);
        },
        'it leaves position undefined': function (topic) {
            assert.equal(topic.position, undefined);
        }
    },
    'With parameters': {
        topic: function () { return diesel.makeError('Someting Wong', 13, 69); },

        'it sets the specified message': function (topic) {
            assert.equal(topic.message, 'Someting Wong');
        },
        'it sets the specified lineNumber': function (topic) {
            assert.equal(topic.lineNumber, 13);
        },
        'it sets the specified position': function (topic) {
            assert.equal(topic.position, 69);
        }
    }
}).run();
