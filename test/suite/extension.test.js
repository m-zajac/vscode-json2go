const assert = require('assert');
const vscode = require('vscode');

const testInput = '123';
const testExpectedOutput = 'type Document int';

suite('Extension Test Suite', () => {
	test('File to clipboard', async () => {
		await prepareTextEditorWithInput(testInput).then(() => {
			return vscode.commands.executeCommand('vsc-json2go.generateFileToClipboard');
		}).then(() => {
			return vscode.env.clipboard.readText();
		}).then(text => {
			assert.strictEqual(text, testExpectedOutput, `invalid data in clipboard: ${text}`);
		});
	});

	test('File to clipboard - invalid data', async () => {
		await prepareTextEditorWithInput('{invalidJson-#').then(() => {
			return vscode.commands.executeCommand('vsc-json2go.generateFileToClipboard');
		}).then(() => {
			return vscode.env.clipboard.readText();
		}).then(text => {
			assert.strictEqual(text, "", `invalid data in clipboard, should be empty: ${text}`);
		});
	});

	test('Selection to clipboard', async () => {
		await prepareTextEditorWithInput(testInput).then(() => {
			const editor = vscode.window.activeTextEditor;
			editor.selection = new vscode.Selection(
				new vscode.Position(0, 0),
				new vscode.Position(0, testExpectedOutput.length),
			);
		}).then(() => {
			return vscode.commands.executeCommand('vsc-json2go.generateSelectionToClipboard');
		}).then(() => {
			return vscode.env.clipboard.readText();
		}).then(text => {
			assert.strictEqual(text, testExpectedOutput, `invalid data in clipboard: ${text}`);
		});
	});

	test('Selection to clipboard - empty selection', async () => {
		await prepareTextEditorWithInput(testInput).then(() => {
			return vscode.commands.executeCommand('vsc-json2go.generateSelectionToClipboard');
		}).then(() => {
			return vscode.env.clipboard.readText();
		}).then(text => {
			assert.strictEqual(text, '', `invalid data in clipboard, should be empty: ${text}`);
		});
	});

	test('Selection to clipboard - invalid data', async () => {
		await prepareTextEditorWithInput('invalid data}').then(() => {
			const editor = vscode.window.activeTextEditor;
			editor.selection = new vscode.Selection(
				new vscode.Position(0, 0),
				new vscode.Position(0, 100),
			);
		}).then(() => {
			return vscode.commands.executeCommand('vsc-json2go.generateSelectionToClipboard');
		}).then(() => {
			return vscode.env.clipboard.readText();
		}).then(text => {
			assert.strictEqual(text, '', `invalid data in clipboard, should be empty: ${text}`);
		});
	});
});

async function prepareTextEditorWithInput(input) {
	return vscode.workspace.openTextDocument().then(doc => {
		return vscode.window.showTextDocument(doc);
	}).then(editor => {
		return editor.edit(edit => {
			edit.insert(new vscode.Position(0, 0), input);
		});
	}).then(() => {
		return vscode.env.clipboard.writeText('');
	});
};
