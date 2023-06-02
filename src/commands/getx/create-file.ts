import { window, Uri, workspace, ProgressLocation } from "vscode";
import { mkdirp } from "mkdirp";
import { writeFileSync, readFileSync } from "fs";
import { createFile } from "../create_file";
import { showErrorMessageWithTimeout } from "../../utils/show_prompt";
const { snakeCase, camelCase, startCase } = require('lodash');

export async function getXCreateFile(uri: Uri) {
    if (!uri.fsPath.includes('ui')) {
        return showErrorMessageWithTimeout('Please create inside ui folder.', 4);
    }

    const featureName = await promptForFeatureName("New Folder Name");
    if (featureName) {
        const packageName = await getPackageName();

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

        const pageNameFile = `${startCase(camel)}Page`;
        const bindingNameFile = `${startCase(camel)}Bindings`;
        const controllerNameFile = `${startCase(camel)}Controller`;


        writeFileSync(page,
            `import 'package:flutter/material.dart';

import 'package:baseX/Core/base_x.dart';

import 'package:${packageName}/app/ui/${snake}/${snake}_controller.dart';

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
import 'package:${packageName}/app/ui/${snake}/${snake}_controller.dart';

class ${bindingNameFile} implements Bindings {
    @override
    void dependencies() {
        Get.put(${controllerNameFile}());
    }
}`, 'utf8');

        writeFileSync(controller,
            `import 'package:baseX/Core/base_x_controller.dart';

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
