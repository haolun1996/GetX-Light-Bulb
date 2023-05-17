import { languages, commands, window, ExtensionContext } from 'vscode';
import { CodeActionProvider } from './utils/code_action';
import { wrapWithObx, removeThisObx, getXCreateFile } from './commands/getx';
import { expanded } from './commands/flutter';



export function activate(context: ExtensionContext) {
	// window.showInformationMessage('Hello World from GetX Light Bulb!');
	let lightBulb = languages.registerCodeActionsProvider(
		{ pattern: "**/*.{dart}", scheme: "file" },
		new CodeActionProvider()
	);

	let wrapObx = commands.registerCommand('getx-light-bulb.wrapObx', () => {
		wrapWithObx();
		window.setStatusBarMessage("Wrap Successful", 2000);
	});

	let removeObx = commands.registerCommand('getx-light-bulb.removeObx', () => {
		removeThisObx();
		window.setStatusBarMessage("Removed Successful", 2000);
	});

	let expand = commands.registerCommand('getx-light-bulb.expanded', () => {
		expanded();
		window.setStatusBarMessage("Expanded", 2000);
	});

	let getxfeature = commands.registerCommand("getx-light-bulb.getXCreateFile", getXCreateFile);

	context.subscriptions.push(lightBulb);
	context.subscriptions.push(expand);
	context.subscriptions.push(wrapObx);
	context.subscriptions.push(removeObx);
	context.subscriptions.push(getxfeature);
}

// This method is called when your extension is deactivated
export function deactivate() { }
