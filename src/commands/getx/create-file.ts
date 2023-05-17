import { window, Uri } from "vscode";
import { mkdirp } from "mkdirp";
import { writeFileSync } from "fs";
import { createFile } from "../create_file";
const { snakeCase, camelCase, startCase } = require('lodash');
// const { wrapWithProviderConsumerBuilder, wrapWithValueListenableBuilder, wrapWithMobXObserverBuilder } = require('../commands/wrap-with');

export async function getXCreateFile(uri: Uri) {
    const featureName = await promptForFeatureName("New Folder Name");
    if (featureName) {
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

        const pageNameFile = startCase(`${camel}Page`);
        const bindingNameFile = startCase(`${camel}Bindings`);
        const controllerNameFile = startCase(`${camel}Controller`);

        writeFileSync(page, `import 'package:get/get.dart';
        import 'package:flutter/material.dart';
        import './${featureName}_controller.dart';

        class ${pageNameFile} extends GetView < ${controllerNameFile}> {

            const ${pageNameFile} ({ Key? key }) : super(key: key);

        @override
    Widget build(BuildContext context) {
            return Scaffold(
                appBar: AppBar(title: const Text('${pageNameFile}'),),
            body: Container(),
        );
        }
    } `, 'utf8');

        writeFileSync(bindings, `import 'package:get/get.dart';
    import './${featureName}_controller.dart';

    class ${bindingNameFile} implements Bindings {
        @override
        void dependencies() {
            Get.put(${controllerNameFile}());
        }
    } `, 'utf8');

        writeFileSync(controller, `import 'package:get/get.dart';

    class $ { controllerNameFile } extends GetxController { } `, 'utf8');

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



// vscode.commands.registerCommand("extension.getxfeature", async function (uri) {
//     const featureName = await promptForFeatureName("Feature GetX Name");
//     if (featureName) {
//         mkdirp(uri.fsPath + '/' + featureName);
//         const baseUrl = uri.fsPath + '/' + featureName
//         const page = `${ baseUrl } /${featureName}_page.dart`;
//         const bindings = `${baseUrl}/${featureName}_bindings.dart`;
//         const controller = `${baseUrl}/${featureName}_controller.dart`;

//         await createFile(page);
//         await createFile(bindings);
//         await createFile(controller);

//         const pageNameFile = _.upperFirst(_.camelCase(`${featureName}Page`));
//         const bindingNameFile = _.upperFirst(_.camelCase(`${featureName}Bindings`));
//         const controllerNameFile = _.upperFirst(_.camelCase(`${featureName}Controller`));

//         fs.writeFileSync(page, `import 'package:get/get.dart';
// import 'package:flutter/material.dart';
// import './${featureName}_controller.dart';

// class ${pageNameFile} extends GetView<${controllerNameFile}> {
// @override
// Widget build(BuildContext context) {
//     return Scaffold(
//         appBar: AppBar(title: Text('${pageNameFile}'),),
//         body: Container(),
//     );
// }
// }`, 'utf8');

//         fs.writeFileSync(bindings, `import 'package:get/get.dart';
// import './${featureName}_controller.dart';

// class ${bindingNameFile} implements Bindings {
// @override
// void dependencies() {
//     Get.put(${controllerNameFile}());
// }
// }`, 'utf8');

//         fs.writeFileSync(controller, `import 'package:get/get.dart';

// class ${controllerNameFile} extends GetxController {}`, 'utf8');

//         vscode.window.showInformationMessage('GetX new feature created');
//     }
// });
