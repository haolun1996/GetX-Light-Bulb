import * as vscode from "vscode";
import { removeSelected } from "./remove_selected";


export function removeObxSnippet() {
    const editorX = vscode.window.activeTextEditor;

    if (editorX && editorX.selection.start !== editorX.selection.end) {
        const selectedText = removeSelected(editorX);

        var textWithObx = editorX.document.getText(selectedText);

        textWithObx = textWithObx.replaceAll(' ', '')

        let head = 'Obx(()=>';

        if (textWithObx.includes(head)) {
            var result = textWithObx.replace(head, '').replace(/\)$/, '');

            editorX.insertSnippet(new vscode.SnippetString(result), selectedText);
        } else {
            vscode.window.showErrorMessage('Please Wrap with Obx(() => ...)');
        }

        vscode.commands.executeCommand("editor.action.formatDocument");
    }
}

