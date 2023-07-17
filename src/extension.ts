import { languages, commands, window, ExtensionContext } from 'vscode';
import { LighBulbProvider } from './utils/code_action';
import { wrapWithObx, removeThisObx, getXCreateFile } from './commands/getx';
import { expanded, stack } from './commands/flutter';
import { generateAll } from './commands/json_to_dart/json_to_dart';

export function activate(context: ExtensionContext) {
	// window.showInformationMessage('Hello World from GetX Light Bulb!');
	let lightBulb = languages.registerCodeActionsProvider(
		{ pattern: "**/*.{dart}", scheme: "file" },
		new LighBulbProvider(),
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

	let stacked = commands.registerCommand('getx-light-bulb.stack', () => {
		stack();
		window.setStatusBarMessage("Stack", 2000);
	});

	let getXCr8File = commands.registerCommand("getx-light-bulb.getXCreateFile", getXCreateFile);

	let jsonToDart = commands.registerCommand("getx-light-bulb.json2dart", () => {
		generateAll();
		// window.showInformationMessage('convert done!');
		window.setStatusBarMessage("Json to Dart", 2000);
	});

	context.subscriptions.push(lightBulb);
	context.subscriptions.push(expand);
	context.subscriptions.push(stacked);
	context.subscriptions.push(wrapObx);
	context.subscriptions.push(removeObx);
	context.subscriptions.push(getXCr8File);
	context.subscriptions.push(jsonToDart);

	// function bind(fileWatcher: vscode.FileSystemWatcher) {
	//     fileWatcher.onDidChange((uri) => {
	//         generateByUri(uri);
	//     });
	//     fileWatcher.onDidCreate((uri) => {
	//         generateByUri(uri);
	//     });
	//     fileWatcher.onDidDelete((uri) => {
	//         deleteGFile(uri);
	//     });
	// }
}


// This method is called when your extension is deactivated
export function deactivate() { }
