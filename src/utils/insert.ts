import * as vscode from "vscode";
import { selected } from "./selected";

export function insertSnippet(
    previously: string,
    behind: string,
    spacex: string,
    substitute?: boolean | false,
    obx?: boolean | false
) {
    const editorX = vscode.window.activeTextEditor;

    if (editorX && editorX.selection.start !== editorX.selection.end) {

        const selectedText = selected(editorX);

        var middble = editorX.document.getText(selectedText);

        if (substitute) {
            if (middble.substr(-1) === ",") {
                middble = middble.substr(0, middble.length - 1);
                middble += "";
            }
        } else {
            if (middble.substr(-1) === ",") {
                middble = middble.substr(0, middble.length - 1);
                middble += ";";
            }
        }

        var result = previously + middble + behind;

        if (middble.substr(-1) === "," || (middble.substr(-1) === ";" && substitute)) {

            if (obx) {
                result += ";";
            } else {
                result += ",";
            }

        }

        editorX.insertSnippet(new vscode.SnippetString(result), selectedText);

        vscode.commands.executeCommand("editor.action.formatDocument");
    }


}