(function (diesel, undefined) {
    var newLineTokenName = 'newLine';

    function makeError(message, lineNumber, position) {
        return {
            message: message,
            lineNumber: lineNumber,
            position: position
        };
    };

    function makeToken(name, text, lineNumber, position) {
        return {
            name: name,
            text: text,
            lineNumber: lineNumber,
            position: position
        };
    };
    diesel.makeToken = makeToken;

    function makeTableEntry(tokenName, expression) {
        return {
            tokenName: tokenName,
            expression: expression
        };
    };
    diesel.makeTableEntry = makeTableEntry;

    function makeNewLineTableEntry() {
        var newLineTokenExpression = /^\r?\n/;

        return makeTableEntry(newLineTokenName, newLineTokenExpression);
    };
    diesel.makeNewLineTableEntry = makeNewLineTableEntry;

    function makeTabTableEntry() {
        var tabTokenExpression = /^\t/,
            tabTokenName = 'tab';

        return makeTableEntry(tabTokenName, tabTokenExpression);
    };
    diesel.makeTabTableEntry = makeTabTableEntry;

    function makeLexer(expressionTable, ignoreExpression) {
        return {
            tokenize: function (stream) {
                var token,
                    testStart = 0,
                    lastLineStart = 0,
                    testValue,
                    position,
                    currentTableEntry,
                    match,
                    lineNumber = 1,
                    tokens = [],
                    errors = [],
                    whitespaceExpression = /^\s+/,
                    skipExpression = ignoreExpression || whitespaceExpression,
                    index,
                    len,
                    matchedLength;

                while (testStart < stream.length) {
                    token = null;
                    testValue = stream.slice(testStart);
                    position = testStart - lastLineStart + 1;

                    for (index = 0, len = expressionTable.length; index < len; index += 1) {
                        currentTableEntry = expressionTable[index];
                        match = currentTableEntry.expression.exec(testValue);

                        if (match) {
                            token = makeToken(currentTableEntry.tokenName, match[0], lineNumber, position);
                            matchedLength = match[0].length;

                            testStart += matchedLength;

                            if (token.name !== newLineTokenName) {
                                tokens.push(token);
                            }
                            else {
                                lineNumber += 1;
                                lastLineStart = testStart;
                            }

                            break;
                        }
                    }

                    if (!token) {
                        match = testValue.match(skipExpression);

                        if (match) {
                            testStart += match[0].length;
                        }
                        else {
                            errors.push(makeError('Syntax error', lineNumber, position));
                            break;
                        }
                    }
                }

                return {
                    tokens: tokens,
                    errors: errors
                };
            }
        };
    };
    diesel.makeLexer = makeLexer;

    function makeCombinatorResult(success, tokens, value, errors) {
        return {
            success: success || false,
            tokens: tokens || [],
            value: value || null,
            errors: errors || []
        };
    };

    function makeTerminalSymbolCombinator(tokenName, errorMessage) {
        return function (inputCombinatorResult) {
            var outputCombinatorResult,
                currentToken,
                remainingTokens,
                inputTokenLength,
                errors = [];

            if (inputCombinatorResult && inputCombinatorResult.tokens) {
                inputTokenLength = inputCombinatorResult.tokens.length;

                if (inputTokenLength > 0) {
                    currentToken = inputCombinatorResult.tokens[0];

                    if (currentToken.name === tokenName) {
                        remainingTokens = inputTokenLength > 1 ? inputCombinatorResult.tokens.slice(1) : [];
                        outputCombinatorResult = makeCombinatorResult(true, remainingTokens, {name: currentToken.name, value: currentToken.text});
                    }
                }
            }

            if (!outputCombinatorResult && currentToken) {
                errors.push(makeError(errorMessage, currentToken.lineNumber, currentToken.position));
            }
            else {
                errors.push(makeError(errorMessage));
            }

            return outputCombinatorResult || makeCombinatorResult(false, inputCombinatorResult.tokens, inputCombinatorResult.value, errors);
        };
    };
    diesel.makeTerminalSymbolCombinator = makeTerminalSymbolCombinator;

    function makeSequenceCombinator(action) {
        var args = Array.prototype.slice.call(arguments, 1);

        return function (inputCombinatorResult) {
            var intermediateResult = inputCombinatorResult,
                intermediateResults = [],
                actionResult,
                sequenceCombinatorResult,
                index,
                len;

            for (index = 0, len = args.length; index < len; index++) {
                intermediateResult = args[index].call(this, intermediateResult);

                if (intermediateResult.success) {
                    intermediateResults.push(intermediateResult);
                }
                else {
                    break;
                }
            }

            if (intermediateResult.success) {
                actionResult = action.apply(this, intermediateResults);
                sequenceCombinatorResult = makeCombinatorResult(true, intermediateResult.tokens, actionResult);
            }

            return sequenceCombinatorResult || makeCombinatorResult(false, inputCombinatorResult.tokens, inputCombinatorResult.value, intermediateResult.errors);
        };
    };
    diesel.makeSequenceCombinator = makeSequenceCombinator;

    function makeAlternativeCombinator (action) {
        var args = Array.prototype.slice.call(arguments, 1);

        return function (inputCombinatorResult) {
            var intermediateResult = inputCombinatorResult,
                intermediateResults = [],
                actionResult,
                alternativeCombinatorResult,
                index,
                len;

            for (index = 0, len = args.length; index < len; index++) {
                intermediateResult = args[index].call(this, intermediateResult);

                if (intermediateResult.success) {
                    intermediateResults.push(intermediateResult);
                    break;
                }
            }

            if (intermediateResult.success) {
                actionResult = action.apply(this, intermediateResults);
                alternativeCombinatorResult = makeCombinatorResult(true, intermediateResult.tokens, actionResult);
            }

            return alternativeCombinatorResult || makeCombinatorResult(false, inputCombinatorResult.tokens, inputCombinatorResult.value, intermediateResult.errors);
        };
    };
    diesel.makeAlternativeCombinator = makeAlternativeCombinator;

    function makeOptionalCombinator (defaultAction, itemCombinator) {
        return function (inputCombinatorResult) {
            var intermediateResult = itemCombinator.call(this, inputCombinatorResult);

            return intermediateResult.success ? intermediateResult : defaultAction.call(this, inputCombinatorResult);
        };
    };
    diesel.makeOptionalCombinator = makeOptionalCombinator;

    function makeKleeneStarCombinator(action, itemCombinator) {
        return function (inputCombinatorResult) {
            var intermediateResult = inputCombinatorResult,
                intermediateResults = [],
                actionResult,
                alternativeCombinatorResult;

            while (true) {
                intermediateResult = itemCombinator.call({}, intermediateResult);

                if (intermediateResult.success) {
                    intermediateResults.push(intermediateResult);
                }
                else {
                    intermediateResult = intermediateResults.length ? intermediateResults.slice(-1)[0] : inputCombinatorResult;
                    break;
                }
            }

            if (intermediateResult.success) {
                actionResult = action.apply(this, intermediateResults);
                alternativeCombinatorResult = makeCombinatorResult(true, intermediateResult.tokens, actionResult);
            }

            return alternativeCombinatorResult || inputCombinatorResult;
        };
    };
    diesel.makeKleeneStarCombinator = makeKleeneStarCombinator;

    function makeKleenePlusCombinator(action, itemCombinator) {
        return function (inputCombinatorResult) {
            var intermediateResult = inputCombinatorResult,
                intermediateResults = [],
                actionResult,
                alternativeCombinatorResult;

            while (true) {
                intermediateResult = itemCombinator.call({ }, intermediateResult);

                if (intermediateResult.success) {
                    intermediateResults.push(intermediateResult);
                }
                else {
                    intermediateResult = intermediateResults.length ? intermediateResults.slice(-1)[0] : intermediateResult;
                    break;
                }
            }

            if (intermediateResult.success) {
                actionResult = action.apply(this, intermediateResults);
                alternativeCombinatorResult = makeCombinatorResult(true, intermediateResult.tokens, actionResult);
            }

            return alternativeCombinatorResult || makeCombinatorResult(false, inputCombinatorResult.tokens, inputCombinatorResult.value, intermediateResult.errors);
        };
    };
    diesel.makeKleenePlusCombinator = makeKleenePlusCombinator;

    function makeParser(rootCombinator) {
        return {
            parse: function (tokens, context) {
                var inputCombinatorResult = makeCombinatorResult(true, tokens, null),
                    combinatorResult = rootCombinator.call(context || {}, inputCombinatorResult),
                    tree = null;

                if (combinatorResult.success) {
                    tree = combinatorResult.value;
                }

                return {
                    tree: tree,
                    errors: combinatorResult.errors
                };
            }
        };
    };
    diesel.makeParser = makeParser;

    function makeDsl(lexer, parser) {
        return {
            parse:  function (input) {
                var result = {
                        success: false,
                        tokens: [],
                        tree: null,
                        errors: []
                    },
                    lexerResult,
                    parserResult;

                lexerResult = lexer.tokenize(input);

                if (lexerResult.errors.length > 0) {
                    result.errors = lexerResult.errors;
                }
                else {
                    result.tokens = lexerResult.tokens;
                    parserResult = parser.parse(result.tokens);

                    if (parserResult.errors.length > 0) {
                        result.errors = parserResult.errors;
                    }
                    else {
                        result.success = true;
                        result.tree = parserResult.tree;
                    }
                }

                return result;
            }
        };
    };
    diesel.makeDsl = makeDsl;
} (this.diesel = this.diesel || {}));
