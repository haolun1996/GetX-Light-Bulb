import { workspace, Uri, window } from 'vscode';
import { existsSync, readFileSync } from "fs";
import json2dart from './convert';
import { showErrorMessageWithTimeout } from '../../utils/show_prompt';

const compiledJson: Set<string> = new Set();

function deleteGFile(uri: Uri) {
    if (uri.fsPath.includes('.d.json') || uri.fsPath.includes('.dart.json')) {
        if (compiledJson.has(uri.fsPath)) {
            compiledJson.delete(uri.fsPath);
        }
        const gfile = uri.fsPath.replace(/\.(d|dart)\.json/, '.g.dart');
        if (existsSync(gfile)) {
            workspace.fs.delete(Uri.parse(gfile));
        }
    }
}

function generateByUri(uri: Uri) {
    const content = readFileSync(uri.fsPath, { encoding: 'utf-8' });
    if (content) {
        generate(uri.fsPath, content, uri);
    }
}

export function generateAll() {
    workspace.findFiles('**/model/json/*.d.json', '**/model/json/*.dart.json').then((uris) => {
        if(uris.length === 0){
            return showErrorMessageWithTimeout('Please create inside model/json/ folder.', 4);
        }else{
            uris.forEach(generateByUri);
        }
    });
}

function generate(filePath: string, content: string, uri: Uri) : void{
    if (filePath.includes('.d.json') || filePath.includes('.dart.json')) {
        const fileName = filePath.split(/[\\\/]/).pop()!;
        const path = filePath.split(`${fileName}`)[0];
        const className = fileName.split('.')[0].replace(/\W/, '');

        if (!/[a-zA-Z_]/.test(className[0])) {
            window.showErrorMessage(
                `File name should be start with /[a-zA-Z]/: ${className}`
            );
            return;
        }

        try {
            json2dart(path, className, JSON.parse(content));
        } catch (e) {
            if (typeof e === 'string') {
                window.showErrorMessage(`${e}`);
            } else {
                window.showErrorMessage(`Unexpected error occurred when generate json to dart: ${filePath}`);
            }
            return;
        }

        compiledJson.add(filePath);
    }
}