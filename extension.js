const vscode = require('vscode');
const { js2go } = require('./js2go');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let cmdSelection = vscode.commands.registerCommand('vsc-json2go.generateSelectionToClipboard', async function () {
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		const text = editor.document.getText(selection);

		await executeJs2go(context, text, (out) => {
			vscode.env.clipboard.writeText(out);
			vscode.window.showInformationMessage('Generated go type is in the clipboard!');
		});
	});
	context.subscriptions.push(cmdSelection);

	let cmdFile = vscode.commands.registerCommand('vsc-json2go.generateFileToClipboard', async function () {
		const editor = vscode.window.activeTextEditor;
		const text = editor.document.getText();

		await executeJs2go(context, text, (out) => {
			vscode.env.clipboard.writeText(out);
			vscode.window.showInformationMessage('Generated go type is in the clipboard!');
		});
	});
	context.subscriptions.push(cmdFile);
}
exports.activate = activate;

function deactivate() {}

async function executeJs2go(context, text, callback) {
	if (!text) {
		vscode.window.showInformationMessage('No text selected');
		return;
	}

	await js2go(context, text).then((out) => {
		if (!out) {
			vscode.window.showInformationMessage('Selected text is not a valid json');
			return;
		}
		callback(out);
	}).catch((err) => {
		vscode.window.showErrorMessage(`Error loading json2go: ${err}`);
	});
}

module.exports = {
	activate,
	deactivate
};
