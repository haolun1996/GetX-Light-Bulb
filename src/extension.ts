import * as vscode from 'vscode';
import { CodeActionProvider } from './utils/code_action';
import { insertSnippet } from './utils/insert';
import { removeObxSnippet } from './utils/remove';
import { SpaceX } from './utils/space';

export function activate(context: vscode.ExtensionContext) {
	// vscode.window.showInformationMessage('Hello World from GetX Light Bulb!');
	let lightBulb = vscode.languages.registerCodeActionsProvider(
		{ pattern: "**/*.{dart}", scheme: "file" },
		new CodeActionProvider()
	);


	let wrapObx = vscode.commands.registerCommand('getx-light-bulb.wrapObx', () => {
		insertSnippet("Obx(() =>" + " ", ")", SpaceX(), true, true);
		vscode.window.setStatusBarMessage("Wrap Successfully Created", 2000);
	});

	let removeObx = vscode.commands.registerCommand('getx-light-bulb.removeObx', () => {
		removeObxSnippet();

		vscode.window.setStatusBarMessage("Wrap Successfully Created", 2000);
	});

	context.subscriptions.push(lightBulb);
	context.subscriptions.push(wrapObx);
	context.subscriptions.push(removeObx);
}

// This method is called when your extension is deactivated
export function deactivate() { }
