import { window, commands, SnippetString } from "vscode";

export function expanded() {

    let editor = window.activeTextEditor;
    if (!editor) return;

    var content = editor.document.getText(editor.selection);

    if (content.includes('return') && content.includes(';')) {
        console.log('1');
        var replaced = content.slice(0, -1).replace('return', '');
        editor.insertSnippet(new SnippetString(`return Expanded(child:
            ${replaced},
        );`));
    } else if (content.includes('return') && !content.includes(';')) {
        console.log('2');
        var replaced = content.replace('return', '');

        editor.insertSnippet(new SnippetString(`return Expanded(child:
            ${replaced},
        )`));
    } else if (content.includes(';')) {
        console.log('3');
        var replaced = content.slice(0, -1);

        editor.insertSnippet(new SnippetString(`Expanded(child:
            ${replaced},
        );`));
    } else if (!content.includes(';') && !content.substring(content.length - 1).includes(',')) {
        console.log('4');
        editor.insertSnippet(new SnippetString(`Expanded(child:
            ${content},
        )`));
    } else {
        console.log('5');

        editor.insertSnippet(new SnippetString(`Expanded(child:
            ${content}
        ),`));
    }

    commands.executeCommand("editor.action.formatDocument");
}