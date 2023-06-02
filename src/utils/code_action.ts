
import { CodeActionProvider, Command, window, } from "vscode";

export class LighBulbProvider implements CodeActionProvider {
    public provideCodeActions(): Command[] {
        const editorX = window.activeTextEditor;

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