import * as vscode from 'vscode';
import { insertSnippet } from './utils/insert';
import { SpaceX } from './utils/space';

export function activate(context: vscode.ExtensionContext) {
	// TODO remove
	console.log('Congratulations, your extension "getx-light-bulb" is now active!');

	let disposable = vscode.commands.registerCommand('getx-light-bulb.wrapObx', () => {
		// vscode.window.showInformationMessage('Hello World from GetX Light Bulb!');
		insertSnippet("Obx(() =>" + " ", ")", SpaceX(), true, true);

		vscode.window.setStatusBarMessage("Wrap Successfully Created", 2000);
		// vscode.window.showInformationMessage('Hello World from GetX Light Bulb!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
