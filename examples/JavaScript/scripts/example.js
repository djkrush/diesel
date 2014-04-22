$(document).ready(function () {
	var modesDropDownList = $('#dsl-editor-modes'),
		i = 0,
		editorModes = CodeMirror.listModes(),
		editorInstance = null;

	for (i = 1; i < editorModes.length; i++) {
		modesDropDownList.append($("<option />").val(editorModes[i]).text(editorModes[i]));
	}

	editorInstance = CodeMirror.fromTextArea(document.getElementById('dsl-editor'), {
		value: '',
		mode: modesDropDownList.val(),
		indentUnit: 4,
		tabMode: 'shift',
		electricChars: true,
		lineNumbers: true,
		matchBrackets: true
	});

	modesDropDownList.change(function () {
		var modeSelection = modesDropDownList.val();

		editorInstance.toTextArea(document.getElementById('dsl-editor'));

		editorInstance = CodeMirror.fromTextArea(document.getElementById('dsl-editor'), {
			value: '',
			mode: modeSelection,
			indentUnit: 4,
			tabMode: 'shift',
			electricChars: true,
			lineNumbers: true,
			matchBrackets: true
		});

		editorInstance.setValue('');

		$('#lexerOutputCanvas').html('');
		$('#lexerOutputCanvas').html('');
      	$('#parserOutputCanvas').html('');
      	$('#errorOutputCanvas').html('');
        $('#lexerOutputContainer').hide();
		$('#parserOutputContainer').hide();
		$('#errorOutputContainer').hide();
	});

    $('#parseButton').bind('click', function () {
    	var modeSelection = modesDropDownList.val(),
			mode = CodeMirror.getMode(modeSelection, modeSelection),
			inputText = editorInstance.getValue(),
			result = mode.language.parse(inputText),
            lexerOutputString = JSON.stringify(result.tokens),
            parserOutputString = JSON.stringify(result.tree),
			errorOutputString = JSON.stringify(result.errors);

        $('#lexerOutputCanvas').html(lexerOutputString);
    	$('#parserOutputCanvas').html(parserOutputString);
    	$('#errorOutputCanvas').html(errorOutputString);

		if(result.success === true) {
            $('#lexerOutputContainer').show();
        	$('#parserOutputContainer').show();
        	$('#errorOutputContainer').hide();
		} else {
            $('#lexerOutputContainer').hide();
        	$('#parserOutputContainer').hide();
        	$('#errorOutputContainer').show();
		}
    });
});
