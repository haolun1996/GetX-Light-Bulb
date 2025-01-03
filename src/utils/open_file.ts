import { Uri, window, workspace, } from "vscode";

export function openFile(filePath: string) {
    console.info(`openFile: ${filePath}`);
    let openPath = Uri.file(filePath);

    workspace.openTextDocument(openPath).then(document => {
        window.showTextDocument(document);
    });
}