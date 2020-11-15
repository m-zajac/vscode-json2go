const vscode = require('vscode');
const { js2go } = require('./js2go');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let cmd1 = vscode.commands.registerCommand('vsc-json2go.convertSelection', function () {
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		if (!text) {
			vscode.window.showInformationMessage('No text selected');
			return;
		}

		js2go(context, text).then((out) => {
			if (!out) {
				vscode.window.showInformationMessage('Selected text is not a valid json');
				return;
			}
			editor.edit(builder => {
				builder.replace(selection, out);
			});
		}).catch((err) => {
			vscode.window.showErrorMessage(`Error loading json2go: ${err}`);
		});
	});
	context.subscriptions.push(cmd1);

	let cmd2 = vscode.commands.registerCommand('vsc-json2go.generateSelectionToClipboard', function () {
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		const text = editor.document.getText(selection);
		if (!text) {
			vscode.window.showInformationMessage('No text selected');
			return;
		}

		js2go(context, text).then((out) => {
			if (!out) {
				vscode.window.showInformationMessage('Selected text is not a valid json');
				return;
			}
			vscode.env.clipboard.writeText(out);
			vscode.window.showInformationMessage('Generated go type is in the clipboard!');
		}).catch((err) => {
			vscode.window.showErrorMessage(`Error loading json2go: ${err}`);
		});
	});
	context.subscriptions.push(cmd2);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
