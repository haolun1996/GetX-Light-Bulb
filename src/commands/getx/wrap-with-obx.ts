import { window, commands, SnippetString } from "vscode";

export function wrapWithObx() {

    let editor = window.activeTextEditor;
    if (!editor) return;

    var content = editor.document.getText(editor.selection);

    if (content.split(' ')[0].includes('return') && content.substring(content.length - 1).includes(';')) {
        // console.log('1');
        var replaced = content.slice(0, -1).replace('return', '');
        editor.insertSnippet(new SnippetString(`return Obx(() =>
            ${replaced}
        );`));
    } else if (content.split(' ')[0].includes('return') && !content.includes(';')) {
        // console.log('2');
        var replaced = content.replace('return', '');

        editor.insertSnippet(new SnippetString(`return Obx(() =>
            ${replaced}
        )`));
    } else if (content.includes(';')) {
        // console.log('3');
        var replaced = content.slice(0, -1);

        editor.insertSnippet(new SnippetString(`Obx(() =>
            ${replaced}
        );`));
    } else if (!content.includes(';') && !content.substring(content.length - 1).includes(',')) {
        // console.log('4');
        editor.insertSnippet(new SnippetString(`Obx(() =>
            ${content}
        ),`));
    } else {
        // console.log('5');
        var replaced = content.slice(0, -1);

        editor.insertSnippet(new SnippetString(`Obx(() =>
            ${replaced}
        ),`));
    }

    commands.executeCommand("editor.action.formatDocument");

};