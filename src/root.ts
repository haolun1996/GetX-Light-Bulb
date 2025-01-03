import * as path from "path";

import { Uri } from "vscode";

export function getTemplateRootPath(): Uri {
    return Uri.file(path.join(__dirname, 'templates'));
}