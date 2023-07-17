import { workspace } from "vscode";
import { readFileSync } from "fs";

export async function getPackageName(): Promise<string> {
    let pubspecFile = await workspace.findFiles('pubspec.yaml');
    let pubspecPath: string = pubspecFile[0].path;

    let data: string = readFileSync(pubspecPath, 'utf-8')
    let nameLine: string = data.split('\n')[0].replace("name: ", "");

    return nameLine;
}