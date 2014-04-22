(function (dsl, undefined) {
    (function (sql) {
        (function (language) {
            var buildAlternativeCombinatorAbstractSyntaxTree = function (alternativeCombinatorResult) {
                    return alternativeCombinatorResult.value;
                },

                commaKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.commaKeyword.name, 'Comma expected'),
                numericLiteralCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.numericLiteral.name, 'SQL value literal expected'),
                sqlStringLiteralCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.sqlStringLiteral.name, 'SQL value literal expected'),
                sqlIdentifierLiteralCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.sqlIdentifierLiteral.name, 'SQL identifier name expected'),

                buildLiteralWithCommaAbstractSyntaxTree = function (commaKeywordCombinatorResult, literalCombinatorResult) {
                    return literalCombinatorResult.value;
                },

                sqlIdentifierWithCommaCombinator = diesel.makeSequenceCombinator(buildLiteralWithCommaAbstractSyntaxTree, commaKeywordCombinator, sqlIdentifierLiteralCombinator),
                sqlStringLiteralWithCommaCombinator = diesel.makeSequenceCombinator(buildLiteralWithCommaAbstractSyntaxTree, commaKeywordCombinator, sqlStringLiteralCombinator),
                numericLiteralWithCommaCombinator = diesel.makeSequenceCombinator(buildLiteralWithCommaAbstractSyntaxTree, commaKeywordCombinator, numericLiteralCombinator),

                formatSqlIdentifierLiteral = function (objectNameMatchValue) {
                    var objectName = objectNameMatchValue;

                    objectName = objectName.replace('[', '');
                    objectName = objectName.replace(']', '');
                    objectName = objectName.trim();

                    return objectName;
                },

                buildSqlIdentifierListWithCommaCombinatorAbstractSyntaxTree = function (listCombinatorResult) {
                    var counter,
                        value,
                        listOfValues = [];

                    for (counter = 0; counter < arguments.length; counter++) {
                        value = arguments[counter].value.value;
                        listOfValues.push(value);
                    }

                    return listOfValues;
                },
                sqlIdentifierListWithCommaCombinator = diesel.makeKleeneStarListCombinator(buildSqlIdentifierListWithCommaCombinatorAbstractSyntaxTree, sqlIdentifierWithCommaCombinator),

                buildColumnNamesListCombinatorAbstractSyntaxTree = function (sqlIdentifierLiteralCombinatorResult, sqlIdentifierListWithCommaCombinatorResult) {
                    var counter,
                        value,
                        additionalNames = [],
                        listOfNames = [];

                    listOfNames.push(sqlIdentifierLiteralCombinatorResult.value.value);

                    if (sqlIdentifierListWithCommaCombinatorResult !== undefined) {
                        additionalNames = sqlIdentifierListWithCommaCombinatorResult.value;

                        for (counter = 0; counter < additionalNames.length; counter++) {
                            value = additionalNames[counter];

                            listOfNames.push(value);
                        }
                    }

                    return listOfNames;
                },
                columnNamesListCombinator = diesel.makeSequenceCombinator(buildColumnNamesListCombinatorAbstractSyntaxTree, sqlIdentifierLiteralCombinator, sqlIdentifierListWithCommaCombinator),

                buildSqlValueCombinatorAbstractSyntaxTree = function (alternativeCombinatorResult) {
                    return alternativeCombinatorResult.value;
                },
                sqlValueCombinator = diesel.makeAlternativeCombinator(buildSqlValueCombinatorAbstractSyntaxTree, sqlStringLiteralCombinator, numericLiteralCombinator),

                buildSqlValueCombinatorWithCommaAbstractSyntaxTree = function (alternativeCombinatorResult) {
                    return alternativeCombinatorResult.value;
                },
                sqlValueWithCommaCombinator = diesel.makeAlternativeCombinator(buildSqlValueCombinatorWithCommaAbstractSyntaxTree, sqlStringLiteralWithCommaCombinator, numericLiteralWithCommaCombinator),

                buildSqlValueListWithCommaCombinatorAbstractSyntaxTree = function (listCombinatorResult) {
                    var counter,
                        value,
                        listOfValues = [];

                    for (counter = 0; counter < arguments.length; counter++) {
                        value = arguments[counter].value.value;
                        listOfValues.push(value);
                    }

                    return listOfValues;
                },
                sqlValueListWithCommaCombinator = diesel.makeKleeneStarListCombinator(buildSqlValueListWithCommaCombinatorAbstractSyntaxTree, sqlValueWithCommaCombinator),

                buildColumnValuesListCombinatorAbstractSyntaxTree = function (sqlValueCombinatorResult, sqlValueListWithCommaCombinatorResult) {
                    var counter,
                        value,
                        additionalValues = [],
                        listOfValues = [];

                    listOfValues.push(sqlValueCombinatorResult.value.value);

                    if (sqlValueListWithCommaCombinatorResult !== undefined) {
                        additionalValues = sqlValueListWithCommaCombinatorResult.value;

                        for (counter = 0; counter < additionalValues.length; counter++) {
                            value = additionalValues[counter];

                            listOfValues.push(value);
                        }
                    }

                    return listOfValues;
                },
                columnValuesListCombinator = diesel.makeSequenceCombinator(buildColumnValuesListCombinatorAbstractSyntaxTree, sqlValueCombinator, sqlValueListWithCommaCombinator),

                openParenthesisKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.openParenthesisKeyword.name, '( expected'),
                closeParenthesisKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.closeParenthesisKeyword.name, ') expected'),

                insertKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.insertKeyword.name, 'Insert expected'),
                intoKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.intoKeyword.name, 'Into expected'),
                valuesKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.valuesKeyword.name, 'Values expected'),

                buildInsertAbstractSyntaxTreeNode = function (insertKeywordCombinatorResult, intoKeywordCombinatorResult, sqlIdentifierLiteralCombinatorResult, openParenthesisKeywordCombinatorResult, columnNamesListCombinatorResult, closeParenthesisKeywordCombinatorResult, valuesKeywordCombinatorResult, openParenthesisKeywordCombinatorResult, valuesListCombinatorResult, closeParenthesisKeywordCombinatorResult) {
                    return {
                        type: 'Insert',
                        value: {
                            table: sqlIdentifierLiteralCombinatorResult.value.value,
                            columns: columnNamesListCombinatorResult.value,
                            values: valuesListCombinatorResult.value
                        }
                    };
                },
                insertCombinator = diesel.makeSequenceCombinator(buildInsertAbstractSyntaxTreeNode, insertKeywordCombinator, intoKeywordCombinator, sqlIdentifierLiteralCombinator, openParenthesisKeywordCombinator, columnNamesListCombinator, closeParenthesisKeywordCombinator, valuesKeywordCombinator, openParenthesisKeywordCombinator, columnValuesListCombinator, closeParenthesisKeywordCombinator),

                updateKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.updateKeyword.name, 'Update expected'),
                setKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.setKeyword.name, 'Set expected'),

                buildFromAbstractSyntaxTreeNode = function (fromKeywordCombinatorResult, sqlIdentifierLiteralCombinatorResult) {
                    var objectName = formatSqlIdentifierLiteral(sqlIdentifierLiteralCombinatorResult.value.value);

                    return {
                        type: 'From',
                        value: objectName
                    };
                },
                fromKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.fromKeyword.name, 'From expected'),
                fromCombinator = diesel.makeSequenceCombinator(buildFromAbstractSyntaxTreeNode, fromKeywordCombinator, sqlIdentifierLiteralCombinator),

                selectKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.selectKeyword.name, 'Select expected'),
                buildSelectAbstractSyntaxTreeNode = function (selectKeywordCombinatorResult, columnNamesListCombinatorResult, fromCombinatorResult) {
                    return {
                        type: 'Select',
                        value: {
                            table: fromCombinatorResult.value.value,
                            columns: columnNamesListCombinatorResult.value
                        }
                    };
                },
                selectCombinator = diesel.makeSequenceCombinator(buildSelectAbstractSyntaxTreeNode, selectKeywordCombinator, columnNamesListCombinator, fromCombinator),

                buildSqlAbstractSyntaxTree = function (alternativeCombinatorResult) {
                	return alternativeCombinatorResult.value;
                },
                rootCombinator = diesel.makeAlternativeCombinator(buildSqlAbstractSyntaxTree, selectCombinator, insertCombinator),
                parser = diesel.makeParser(rootCombinator),
                sqlLanguage = diesel.makeDsl(dsl.sql.tokens.lexer, parser);

            language.parse = function (input) {
                var result = sqlLanguage.parse(input);

                return result;
            };
        }(sql.language = sql.language || { }));
    }(dsl.sql = dsl.sql || { }));
}(this.dsl = this.dsl || { }));
