import { window, commands, SnippetString } from "vscode";

export function removeThisObx() {

    let editor = window.activeTextEditor;
    if (!editor) return;

    var content = editor.document.getText(editor.selection);


    if (!content.includes('Obx')) {
        window.showErrorMessage('Please Wrap with Obx(() => ...)');
    }

    var replacedText;

    if (content.includes('return')) {
        replacedText = content.replaceAll('return', '').replaceAll('const', '').replaceAll(' ', '').replaceAll('\n', '').replaceAll('Obx(', '').replace('()=>', '');
    } else {
        replacedText = content.replaceAll('const', '').replaceAll(' ', '').replaceAll('\n', '').replaceAll('Obx(', '').replace('()=>', '');
    }

    if (replacedText.substring(replacedText.length - 4, replacedText.length).includes('),),') && !content.includes(';')) {
        // console.log('1');
        replacedText = replacedText.slice(0, -2);
        // console.log(replacedText);
    } else if (content.substring(content.length - 3).includes(')),') && !content.includes(';')) {
        // console.log('2');
        replacedText = replacedText.replace(')),', '),');
        // console.log(replacedText);
    } else if (replacedText.substring(replacedText.length - 4, replacedText.length).includes('),);') && content.includes(';') && !content.includes('return')) {
        // console.log('3');
        replacedText = replacedText.replace(',);', ';');
        // console.log(replacedText);
    } else if (replacedText.substring(replacedText.length - 3, replacedText.length).includes('));') && content.includes(';') && !content.includes('return')) {
        // console.log('4');
        replacedText = replacedText.replace(',));', ');');
        // console.log(replacedText);
    } else if (replacedText.substring(replacedText.length - 4, replacedText.length).includes('),);') && content.includes(';') && content.includes('return')) {
        // console.log('5');
        replacedText = `return ${replacedText.replace(',);', ';')}`;
        // console.log(replacedText);
    } else if (replacedText.substring(replacedText.length - 3, replacedText.length).includes('));') && content.includes(';') && content.includes('return')) {
        // console.log('6');
        replacedText = `return ${replacedText.replace(',));', ');')}`;
        // console.log(replacedText);
    }

    editor.insertSnippet(new SnippetString(`${replacedText}`));

    commands.executeCommand("editor.action.formatDocument");
};