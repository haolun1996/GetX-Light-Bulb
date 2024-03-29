import { window, Uri, workspace } from "vscode";
import { mkdirp } from "mkdirp";
import { writeFileSync, readFileSync } from "fs";
import { createFile } from "../create_file";
import { showErrorMessageWithTimeout } from "../../utils/show_prompt";
import { getPackageName } from "../../utils/get_package_name";
const { snakeCase, camelCase, upperFirst } = require('lodash');
import { intent, intent2, intent3 } from '../../utils/intent_dart';

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

import 'package:baseX/base_x.dart';

import 'package:${packageName}/${snake}/${snake}_controller.dart';

class ${pageNameFile} extends BaseXWidget<${controllerNameFile}> {
${intent}@override
${intent}String get routeName => '/${snake}';

${intent}@override
${intent}Widget? appBar(BuildContext context) => null;

${intent}@override
${intent}Widget body(BuildContext context) {
${intent2}return Column(children: []);
${intent}}  
}`, 'utf8');

        writeFileSync(bindings,
            `import 'package:baseX/base_x.dart';

import 'package:${packageName}/${snake}/${snake}_controller.dart';

class ${bindingNameFile} implements Bindings {
${intent}@override
${intent}void dependencies() {
${intent2}Get.put(${controllerNameFile}());
${intent}}
}`, 'utf8');

        writeFileSync(controller,
            `import 'package:baseX/base_x.dart';

class ${controllerNameFile} extends BaseXController { 
${intent}@override
${intent}void onInit() async {
${intent2}// TODO: implement onInit
${intent2}super.onInit();
${intent2}await initData();
${intent}}

${intent}Future<void> initData() async {}

${intent}@override
${intent}void onClose() {
${intent2}// TODO: implement onClose
${intent2}super.onClose();
${intent}}
}`, 'utf8');

        await setAppPage(pageNameFile, bindingNameFile);
        await setAppRoute(`import 'package:${packageName}/${snake}/${snake}_page.dart';`, `import 'package:${packageName}/${snake}/${snake}_bindings.dart';`);

        window.showInformationMessage('BaseX page created');
    }
}

async function setAppRoute(importPage: string, importBinding: string): Promise<void> {
    let pubspecFile = await workspace.findFiles('**/app_routes.dart');
    let pubspecPath: string = pubspecFile[0].path;
    let data: string = readFileSync(pubspecPath, 'utf-8');
    let lineList: string[] = data.split('\n');

    let rewriteLines: string[] = [];

    for (let i = 0; i < lineList.length; i++){
        if(lineList[i].includes(`part 'app_pages.dart';`)){
            rewriteLines.splice(i -1);
            rewriteLines.push(importPage);
            rewriteLines.push(`${importBinding}\n`);
        }
        rewriteLines.push(`${lineList[i]}`);
    }

    writeFileSync(pubspecPath, rewriteLines.join('\n'), 'utf8');
}

async function setAppPage(pageName: string, bindingName: string): Promise<void> {
    let pubspecFile = await workspace.findFiles('**/app_pages.dart');
    let pubspecPath: string = pubspecFile[0].path;
    let data: string = readFileSync(pubspecPath, 'utf-8');
    let lineList: string[] = data.split('\n');

    let rewriteLines: string[] = [];
    let first: boolean = true;

    for (let i = 0; i < lineList.length; i++){
        if(lineList[i].includes('];') && first){
            first = false;
            rewriteLines.push(`\n${intent}${intent}// ${pageName.replace('page','')}`);
            rewriteLines.push(`${intent}${intent}cGetPage(${pageName}(), binding: ${bindingName}()),`);
        }
        rewriteLines.push(`${lineList[i]}`);
    }

    writeFileSync(pubspecPath, rewriteLines.join('\n'), 'utf8');
}

function promptForFeatureName(prompt: string) {
    const featureNamePromptOptions = {
        prompt: prompt,
        placeHolder: "Folder OR File Name"
    };
    return window.showInputBox(featureNamePromptOptions);
}
