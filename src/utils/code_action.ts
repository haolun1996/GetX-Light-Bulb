
import * as vscode from "vscode";

export class CodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(): vscode.Command[] {
        const editorX = vscode.window.activeTextEditor;

        if (!editorX) {
            return [];
        }
        var verText = editorX.document.getText(editorX.selection).length;

        const codeActions = [];
        if (verText === 0) {
            codeActions.push({
                command: "getx-light-bulb.wrapObx",
                title: "Wrap with Obx"
            });
        } else {
            codeActions.push({
                command: "getx-light-bulb.removeKey",
                title: "Wrap with Obx"
            });
        }
        return codeActions;
    }
}