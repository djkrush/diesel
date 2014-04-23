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
                    var value = {
                            type: 'Insert',
                            table: sqlIdentifierLiteralCombinatorResult.value.value,
                            changes: []
                        },
                        i;

                    if (columnNamesListCombinatorResult.value.length !== valuesListCombinatorResult.value.length) {
                        throw diesel.makeError('Insert must have equal number of columns and values');
                    } else {
                        for(i = 0; i < columnNamesListCombinatorResult.value.length; i++) {
                            value.changes.push({
                                column: columnNamesListCombinatorResult.value[i],
                                value: valuesListCombinatorResult.value[i]
                            })
                        }
                    }

                    return value;
                },
                insertCombinator = diesel.makeSequenceCombinator(buildInsertAbstractSyntaxTreeNode, insertKeywordCombinator, intoKeywordCombinator, sqlIdentifierLiteralCombinator, openParenthesisKeywordCombinator, columnNamesListCombinator, closeParenthesisKeywordCombinator, valuesKeywordCombinator, openParenthesisKeywordCombinator, columnValuesListCombinator, closeParenthesisKeywordCombinator),

                updateKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.updateKeyword.name, 'Update expected'),
                setKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.setKeyword.name, 'Set expected'),
                equalsOperatorKeywordCombinator = diesel.makeTerminalSymbolCombinator(dsl.sql.tokens.dictionary.equalsOperatorKeyword.name, 'Equals operator expected'),

                buildSqlColumnValuePairCombinatorAbstractSyntaxTree = function (sqlIdentifierLiteralCombinatorResult, equalsOperatorKeywordCombinatorResult, sqlValueCombinatorResult) {
                    return {
                        value: {
                            column: sqlIdentifierLiteralCombinatorResult.value.value,
                            value: sqlValueCombinatorResult.value.value
                        }
                    };
                },
                sqlColumnValuePairCombinator = diesel.makeSequenceCombinator(buildSqlColumnValuePairCombinatorAbstractSyntaxTree, sqlIdentifierLiteralCombinator, equalsOperatorKeywordCombinator, sqlValueCombinator),

                buildSqlColumnValuePairWithCommaCombinatorAbstractSyntaxTree = function (sqlIdentifierWithCommaCombinatorResult, equalsOperatorKeywordCombinatorResult, sqlValueCombinatorResult) {
                    return {
                        value: {
                            column: sqlIdentifierWithCommaCombinatorResult.value.value,
                            value: sqlValueCombinatorResult.value.value
                        }
                    };
                },
                sqlColumnValuePairWithCommaCombinator = diesel.makeSequenceCombinator(buildSqlColumnValuePairWithCommaCombinatorAbstractSyntaxTree, sqlIdentifierWithCommaCombinator, equalsOperatorKeywordCombinator, sqlValueCombinator),

                buildSqlColumnValuePairListWithCommaCombinatorAbstractSyntaxTree = function (listCombinatorResult) {
                    var counter,
                        value,
                        listOfValues = [];

                    for (counter = 0; counter < arguments.length; counter++) {
                        value = arguments[counter].value.value;
                        listOfValues.push(value);
                    }

                    return listOfValues;
                },
                sqlColumnValuePairListWithCommaCombinator = diesel.makeKleeneStarListCombinator(buildSqlColumnValuePairListWithCommaCombinatorAbstractSyntaxTree, sqlColumnValuePairWithCommaCombinator),

                buildColumnValuePairListCombinatorAbstractSyntaxTree = function (sqlColumnValuePairCombinatorResult, sqlColumnValuePairListWithCommaCombinatorResult) {
                    var counter,
                        value,
                        additionalValues = [],
                        listOfValues = [];

                    listOfValues.push(sqlColumnValuePairCombinatorResult.value.value);

                    if (sqlColumnValuePairListWithCommaCombinatorResult !== undefined) {
                        additionalValues = sqlColumnValuePairListWithCommaCombinatorResult.value;

                        for (counter = 0; counter < additionalValues.length; counter++) {
                            value = additionalValues[counter];

                            listOfValues.push(value);
                        }
                    }

                    return listOfValues;
                },
                columnValuePairListCombinator = diesel.makeSequenceCombinator(buildColumnValuePairListCombinatorAbstractSyntaxTree, sqlColumnValuePairCombinator, sqlColumnValuePairListWithCommaCombinator),

                buildUpdateAbstractSyntaxTreeNode = function (updateKeywordCombinatorResult, tableSqlIdentifierLiteralCombinatorResult, setKeywordCombinatorResult, columnValuePairListCombinator) {
                    return {
                        type: 'Update',
                        table: tableSqlIdentifierLiteralCombinatorResult.value.value,
                        changes: columnValuePairListCombinator.value
                    };
                },
                updateCombinator = diesel.makeSequenceCombinator(buildUpdateAbstractSyntaxTreeNode, updateKeywordCombinator, sqlIdentifierLiteralCombinator, setKeywordCombinator, columnValuePairListCombinator),

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
                        table: fromCombinatorResult.value.value,
                        columns: columnNamesListCombinatorResult.value
                    };
                },
                selectCombinator = diesel.makeSequenceCombinator(buildSelectAbstractSyntaxTreeNode, selectKeywordCombinator, columnNamesListCombinator, fromCombinator),

                buildSqlAbstractSyntaxTree = function (alternativeCombinatorResult) {
                	return alternativeCombinatorResult.value;
                },
                rootCombinator = diesel.makeAlternativeCombinator(buildSqlAbstractSyntaxTree, selectCombinator, insertCombinator, updateCombinator),
                parser = diesel.makeParser(rootCombinator),
                sqlLanguage = diesel.makeDsl(dsl.sql.tokens.lexer, parser);

            language.parse = function (input) {
                var result = sqlLanguage.parse(input);

                return result;
            };
        }(sql.language = sql.language || { }));
    }(dsl.sql = dsl.sql || { }));
}(this.dsl = this.dsl || { }));
