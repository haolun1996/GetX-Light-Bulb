import { window, Uri, workspace, ProgressLocation } from "vscode";
import { mkdirp } from "mkdirp";
import { writeFileSync, readFileSync } from "fs";
import { createFile } from "../create_file";
import { showErrorMessageWithTimeout } from "../../utils/show_prompt";
const { snakeCase, camelCase, upperFirst } = require('lodash');

export async function getXCreateFile(uri: Uri) {
    if (!uri.fsPath.includes('ui')) {
        return showErrorMessageWithTimeout('Please create inside ui folder.', 4);
    }

    const featureName = await promptForFeatureName("New Folder Name");
    if (featureName) {
        const middlePath = uri.path.replaceAll(workspace.workspaceFolders![0].uri.path, '').replaceAll('/lib', '');
        const packageName = `${await getPackageName()}${middlePath}`;

        const snake = `${snakeCase(`${featureName}`)}`;
        const camel = `${camelCase(`${featureName}`)}`;

        mkdirp(uri.fsPath + '/' + snake);
        const baseUrl = uri.fsPath + '/' + snake;
        const page = `${baseUrl}/${snake}_page.dart`;
        const bindings = `${baseUrl}/${snake}_bindings.dart`;
        const controller = `${baseUrl}/${snake}_controller.dart`;

        await createFile(page);
        await createFile(bindings);
        await createFile(controller);

        const pageNameFile = `${upperFirst(camel)}Page`;
        const bindingNameFile = `${upperFirst(camel)}Bindings`;
        const controllerNameFile = `${upperFirst(camel)}Controller`;

        writeFileSync(page,
            `import 'package:flutter/material.dart';

import 'package:baseX/Core/x_base_widget.dart';

import 'package:${packageName}/${snake}/${snake}_controller.dart';

class ${pageNameFile} extends BaseXWidget<${controllerNameFile}> {

    @override
    String get routeName => '/${snake}';

    @override
    Widget? appBar(BuildContext context) => null;

    @override
    Widget body(BuildContext context) {
        return Column(children: []);
    }
            
}`, 'utf8');

        writeFileSync(bindings,
            `import 'package:get/get.dart';
import 'package:${packageName}/${snake}/${snake}_controller.dart';

class ${bindingNameFile} implements Bindings {
    @override
    void dependencies() {
        Get.put(${controllerNameFile}());
    }
}`, 'utf8');

        writeFileSync(controller,
            `import 'package:baseX/Core/x_base_controller.dart';

class ${controllerNameFile} extends BaseXController { 

    @override
    void onInit() {
        // TODO: implement onInit
        super.onInit();
    }

    @override
    void onClose() {
        // TODO: implement onClose
        super.onClose();
    }
}`, 'utf8');

        window.showInformationMessage('BaseX page created');
    }
}

function promptForFeatureName(prompt: string) {
    const FeatureNamePromptOptions = {
        prompt: prompt,
        placeHolder: "Folder OR File Name"
    };
    return window.showInputBox(FeatureNamePromptOptions);
}

async function getPackageName() {
    let pubspecFile = await workspace.findFiles('pubspec.yaml');
    let pubspecPath = pubspecFile[0].path;

    var data = readFileSync(pubspecPath, 'utf-8')
    var nameLine = data.split('\n')[0].replace("name: ", "");

    return nameLine;
}
