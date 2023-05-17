import { window, commands, SnippetString } from "vscode";

export const wrapContent = async (snippet: (widget: string) => string) => {
    let editor = window.activeTextEditor;
    if (!editor) return;

    const widget = editor.document.getText(editor.selection);

    editor.insertSnippet(new SnippetString(snippet(widget)));
    await commands.executeCommand("editor.action.formatDocument");
};

