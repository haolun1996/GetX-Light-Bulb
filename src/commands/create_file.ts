import * as vscode from "vscode";

export async function createFile(fileName: string) {
    let wsedit = new vscode.WorkspaceEdit();
    const filePath = vscode.Uri.file(fileName);
    wsedit.createFile(filePath);
    await vscode.workspace.applyEdit(wsedit);
}