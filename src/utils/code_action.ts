
import * as vscode from "vscode";

export class CodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(): vscode.Command[] {
        const editorX = vscode.window.activeTextEditor;

        if (!editorX) {
            return [];
        }

        const codeActions = [];

        const verText = editorX.document.getText(editorX.selection);

        if (verText === '') {
            return [];
        }

        codeActions.push({
            command: "getx-light-bulb.expanded",
            title: "Expanded"
        });

        codeActions.push({
            command: "getx-light-bulb.wrapObx",
            title: "Wrap with Obx"
        });

        codeActions.push({
            command: "getx-light-bulb.removeObx",
            title: "Remove this Obx"
        });

        return codeActions;
    }
}