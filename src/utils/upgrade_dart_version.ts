import { readFileSync, writeFileSync } from "fs";
import * as yaml from "js-yaml";
import * as path from "path";
import { workspace } from "vscode";
import { openFile } from './open_file';

function upgradeDartVersion() {
    let json = getPubspecJsonFile();
    if (json === undefined) {
        return;
    }
    let object = JSON.parse(json);
    object["environment"]["sdk"] = ">=2.3.0 <3.0.0";
    let modifiedString = JSON.stringify(object);
    console.debug(`upgradeDartVersion: modifiledString: ${modifiedString}`);
    let updatedYaml = toYAML(modifiedString);

    if (updatedYaml === undefined) {
        return;
    }

    let filePath = path.join(workspace.workspaceFolders![0].uri.path, "pubspec.yaml");
    writeFileSync(filePath, updatedYaml);

    openFile(filePath);
}


function getPubspecJsonFile(): string | undefined {

    let fileData = readFileAsString(workspace.workspaceFolders![0].uri.path, "pubspec.yaml");
    if (fileData === undefined) {
        console.debug("Pubspec.yaml not found");
        return undefined;
    }
    let data = toJSON(fileData);
    return data;
}

function readFileAsString(
    filePath: string,
    fileName: string
): string | undefined {

    let fileBuffer = readFileSync(path.join(filePath, fileName));
    let fileData = fileBuffer.toString();
    return fileData;
}

function toJSON(text: string) {
    let json;
    try {
        console.debug(`toJSON: ${text}`);
        json = yaml.safeLoad(text, { schema: yaml.JSON_SCHEMA });
    } catch (e) {

        console.error(e);
        return;
    }
    return JSON.stringify(json, null, 2);
}

function toYAML(text: string): string | undefined {
    let json;
    try {
        console.debug(`toYAML: ${text}`);
        json = JSON.parse(text);
    } catch (e) {
        console.error(e);
        return undefined;
    }
    return yaml.safeDump(json, { indent: 2 });
}