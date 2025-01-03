import { existsSync, promises, readFileSync, writeFileSync } from "fs";
import { mkdirpSync } from "mkdirp";
import * as path from "path";
import { commands, ExtensionContext, Uri, window } from "vscode";
import { getTemplateRootPath } from "../../root";
import { createFile } from "../create_file";
const { snakeCase, camelCase, upperFirst, startCase } = require('lodash');

// List of file extensions and filenames to exclude during file operations
const excludeFileExt = ['.png', 'gradlew', 'build.gradle', '.md', 'project.pbxproj', '.xcuserstate'];

export async function baseXCreateProject(context: ExtensionContext) {
    // Retrieve the last used project folder path from global state, if available
    // console.log(context.globalState.get("lastUsedNewProjectPath"));
    const folders = await window.showOpenDialog({
        canSelectFolders: true,
        defaultUri: context.globalState.get("lastUsedNewProjectPath") ? Uri.file(context.globalState.get("lastUsedNewProjectPath")!) : undefined,
        openLabel: "Select a folder to create the project in",
    });

    // If no folder is selected or multiple folders are selected, exit the function
    if (!folders || folders.length !== 1) {
        return;
    }

    const folderPath = folders[0].fsPath;
    // Update the global state with the selected folder path
    context.globalState.update("lastUsedNewProjectPath", folderPath);

    // Prompt the user to enter a project name and validate the input
    const _snakeCaseName = await promptEnterProjectName(folderPath);
    const titleCase = startCase(camelCase(_snakeCaseName));

    // Exit if no project name is entered
    if (!_snakeCaseName) {
        return;
    }

    // Define the new project's folder path
    const projectFolderUri = Uri.file(path.join(folderPath, _snakeCaseName));


    // Check if a folder with the same name already exists
    if (existsSync(projectFolderUri.fsPath)) {
        void window.showErrorMessage(`A folder named ${_snakeCaseName} already exists in ${folderPath}`);
        return;
    }

    // Create the project folder
    mkdirpSync(projectFolderUri.fsPath);

    // Get the path to the templates directory
    const templatesPath = getTemplateRootPath();

    // recheckFolder(projectFolderUri.fsPath, templatesPath.fsPath, _snakeCaseName, titleCase);

    // Recursively copy files and folders from the template directory to the project folder
    const files = await readDirectoryRecursive(projectFolderUri.fsPath, templatesPath.fsPath, _snakeCaseName, titleCase);

    // Open the newly created project folder in the VS Code editor
    void commands.executeCommand("vscode.openFolder", projectFolderUri);
}

// Recursive function to read a directory and copy its contents to the project folder
async function readDirectoryRecursive(projectFolderPath: string, templatesPath: string, _snakeCaseName: string, titleCase: string): Promise<void> {
    // Read all files and directories in the current template path
    const files = await promises.readdir(templatesPath);

    for (const file of files) {
        // Skip system files like .DS_Store
        if (file === '.DS_Store') {
            continue;
        }

        const filePath = path.join(templatesPath, file);
        const stat = await promises.stat(filePath);

        if (stat.isDirectory()) {
            // Create the directory in the project folder and recurse into it
            let createFolderPath: string = projectFolderPath + '/' + file;

            if (file === '${applicationName}') {
                createFolderPath = projectFolderPath + '/' + _snakeCaseName;
            }
            mkdirpSync(createFolderPath);

            console.log(`${file} [FOLDER] created in folder ${projectFolderPath}`);

            await readDirectoryRecursive(createFolderPath, filePath, _snakeCaseName, titleCase);
        } else {
            // Process files by copying and optionally embedding template keys
            const createFilePath = projectFolderPath + '/' + file;

            createFile(createFilePath);
            let compiled;
            if (excludeFileExt.some(item => filePath.includes(item))) {
                // Skip processing for excluded file extensions
                compiled = readFileSync(filePath);
            } else {
                // Replace template keys in the file content
                compiled = embedKey(readFileSync(filePath, 'utf8'), _snakeCaseName, titleCase);
            }

            try {
                // Write the processed content to the new file
                writeFileSync(createFilePath, compiled);
            } catch (error) {
                console.log(`ERROR --- ${filePath} ----- ${error}`);
            }

            console.log(`${file.toString()} [FILE] created in folder ${projectFolderPath}`);
        }
    }
}

// Function to replace template keys with actual project values in file content
function embedKey(readFileData: string, _snakeCaseName: string, titleCase: string): string {
    return convertTemplate(readFileData, {
        snakeCaseName: _snakeCaseName, titleCase: titleCase,
    });
}

// Helper function to replace placeholders (e.g., ${key}) in a template string
function convertTemplate(content: string, replacements: { [key: string]: string }): string {
    const pattern = new RegExp(Object.keys(replacements).map(key => `\\$\\{${key}\\}`).join('|'), 'g');

    return content.replace(pattern, (match) => {
        const key = match.slice(2, -1); // Remove `${` and `}`
        return replacements[key];
    });
}

const packageNameRegex = new RegExp("^[a-z][a-z0-9_]*$");

// Function to validate the Flutter project name input by the user
function validateFlutterProjectName(input: string, folderDir: string): string | undefined {
    if (!packageNameRegex.test(input)) {
        // window.showInformationMessage("Flutter project names should be all lowercase, with underscores to separate words");
        return "Flutter project names should be all lowercase, with underscores to separate words";
    }

    const bannedNames = ["flutter", "flutter_test", "test", "integration_test", "this"];
    if (bannedNames.includes(input)) {
        return `You may not use ${input} as the name for a flutter project`;
    }


    if (existsSync(path.join(folderDir, input))) {
        return `A project with this name already exists within the selected directory`;
    }
}

// Prompt the user to enter a project name and validate their input
function promptEnterProjectName(folderPath: string): Thenable<string | undefined> {
    const defaultName = "flutter_base_x";

    return window.showInputBox({
        title: "Project Name",
        placeHolder: defaultName,
        prompt: "Enter a name for your new project",
        value: defaultName,
        ignoreFocusOut: true,
        validateInput: (text: string) => validateFlutterProjectName(text, folderPath)
    });
}
