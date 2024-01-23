const { camelCase, upperFirst, snakeCase } = require('lodash');
import { getPackageName } from '../../utils/get_package_name';
import saveAsFile from './file_saver';
import { intent, intent2, intent3, intent4 } from '../../utils/intent_dart';
import { DARTTYPES } from './dart_types';

let importSubClass: string[] = [];

export default function generate(path: string, rootClass: string, jsonObj: any) {

    rootClass = buildClassName(rootClass);

    removeSurplusElement(jsonObj);

    if (Array.isArray(jsonObj)) {
        throw (`Root of json object should not is an Array.`);
    } else {
        objToDart(path, jsonObj, rootClass, true);
    }
}

async function objToDart(path: string, jsonObj: any, className: string, isMainClass: boolean = false, arryItem: any[] = []) : Promise<any>{
    // check if array then analyze inside again
    if (Array.isArray(jsonObj)) {
        return objToDart(path, jsonObj[0], className, false, jsonObj);
    }

    let lines: string[] = [], propsLines: string[] = [], constructorLines: string[] = [],
        fromJsonLines: string[] = [], listFronJsonLines: string[] = [],
        toJsonLines: string[] = [], copyWithConsLines: string[] = [],
        copyWithReturnLines: string[] = [], copyWithLines: string[] = [];

    // import
    lines.push(`import 'package:baseX/base_x.dart';\n`);

    // Start of class model
    lines.push(`class ${className} extends XData {`);

    // Start of constructor
    constructorLines.push(`${intent}${className}({\n`);

    // Start of fromJson
    fromJsonLines.push('\n');
    fromJsonLines.push(`${intent}factory ${className}.fromJson(Map<String, dynamic> json) {\n`);
    fromJsonLines.push(`${intent2}return ${className}(\n`);

    // Start of listFromJson
    listFronJsonLines.push('\n');
    listFronJsonLines.push(`${intent}static List<${className}> listFromJson(List json) {\n`);
    listFronJsonLines.push(`${intent2}List<${className}> list = []; \n`);
    listFronJsonLines.push(`${intent2}for (var item in json) { \n`);
    listFronJsonLines.push(`${intent3}list.add(${className}.fromJson(item));\n`);
    listFronJsonLines.push(`${intent2}}\n`);
    listFronJsonLines.push(`${intent2}return list;\n`);
    // End of listFromJson
    listFronJsonLines.push(`${intent}}`);

    // Start of toJson
    toJsonLines.push('\n');
    toJsonLines.push(`${intent}@override\n`);
    toJsonLines.push(`${intent}JSON toJson() => {\n`);

    // Start of copyWith
    copyWithConsLines.push('\n');
    copyWithConsLines.push(`${intent}@override\n`);
    copyWithConsLines.push(`${intent}${className} copyWith({\n`);

    copyWithReturnLines.push(`${intent}}) =>\n`);
    copyWithReturnLines.push(`${intent3}${className}(\n`);

    for (let key in jsonObj) {

        let element = jsonObj[key];

        let legalKey = camelCase(dartKeywordDefence(key));

        let jsonKey: string = `'${key}'`;

        constructorLines.push(`${intent2}this.${legalKey},\n`);

        if (element === null) {
            element = '';
        }

        if (typeof element === 'object') {
            let subClassName: string = buildClassName(key);

            if (Array.isArray(element)) {
                let { inner, genericString } = getInnerObjInfo(
                    element,
                    subClassName,
                );

                let { fromJsonLinesJoined, toJsonJoined } = getIterateLines(
                    element,
                    subClassName,
                    legalKey,
                    jsonKey
                );

                propsLines.push(`${intent}final ${genericString}? ${legalKey};\n`);
                fromJsonLines.push(fromJsonLinesJoined);
                toJsonLines.push(toJsonJoined);
                copyWithConsLines.push(`${intent2}${genericString}? ${legalKey},\n`);
                copyWithReturnLines.push(`${intent4}${legalKey}: ${legalKey} ?? this.${legalKey},\n`);

                if (typeof inner === 'object') {
                    objToDart(path, element, subClassName);
                }
            } else {
                objToDart(path, element, subClassName);
                if (!importSubClass.includes(snakeCase(subClassName))) {
                    importSubClass.push(snakeCase(subClassName));
                }
                propsLines.push(`${intent}final ${subClassName}? ${legalKey};\n`);
                fromJsonLines.push(
                    `${intent3}${legalKey}: json[${jsonKey}] == null ? null : ${subClassName}.fromJson(json[${jsonKey}]),\n`
                );
                toJsonLines.push(
                    `${intent2}if (${legalKey} != null) ${jsonKey} :${legalKey}?.toJson(),\n`
                );
            }
        } else {
            let toType: string = `json[${jsonKey}]`;
            let type: string = DARTTYPES.dynamic;

            const declareType =  typeof element;

            if (declareType === 'boolean') {
                type = DARTTYPES.bool;
            } else if(declareType === 'number'){
                type = `${element}`.includes('.') ? DARTTYPES.double : DARTTYPES.int;
            } else if (declareType === 'string'){
                type = DARTTYPES.string;
            }
            
            propsLines.push(`${intent}final ${type}? ${legalKey};\n`);
            fromJsonLines.push(`${intent3}${legalKey}: ${toType},\n`);
            toJsonLines.push(`${intent2}${jsonKey}: ${legalKey},\n`);

            copyWithConsLines.push(`${intent2}${type}? ${legalKey},\n`);
            copyWithReturnLines.push(`${intent4}${legalKey}: ${legalKey} ?? this.${legalKey},\n`);
        }
    }

    // End of copyWithReturnLines
    copyWithReturnLines.push(`${intent3});`);

    // End of constructor
    constructorLines.push(`${intent}});`);

    // End of fromJson
    fromJsonLines.push(`${intent2});\n`);
    fromJsonLines.push(`${intent}}`);

    // End of toJson
    toJsonLines.push(`${intent}};`);

    // End of copyWith
    // combine copyWithConsLines and copyWithReturnLines
    copyWithLines.push(copyWithConsLines.join(''));
    copyWithLines.push(copyWithReturnLines.join(''));

    // Body : props -> constructor -> fromJson -> toJson -> copyWith
    lines.push(propsLines.join(''));
    lines.push(constructorLines.join(''));
    lines.push(fromJsonLines.join(''));
    lines.push(listFronJsonLines.join(''));
    lines.push(toJsonLines.join(''));
    lines.push(copyWithLines.join(''));

    // End of class model
    lines.push(`}\n`);

    // Import related 
    if (isMainClass) {
        for (var importName of importSubClass) {
            lines.splice(1, 0, `import 'package:${await getPackageName()}/model/generated/${importName}.dart';`);
        }
        if(importSubClass.length > 0){
            lines.splice(importSubClass.length + 1, 0 , '');
        }
    }

    saveAsFile(`${path.replace('json', '')}generated/${snakeCase(className)}.dart`, lines.join('\n'));
}

// Checking dart reserved key word
function dartKeywordDefence(key: string): string | undefined {
    if (typeof key === 'string') {
        //https://dart.dev/guides/language/language-tour
        let reservedKeywords = [
            'num',
            'double',
            'int',
            'String',
            'bool',
            'List',
            'abstract',
            'dynamic',
            'implements',
            'show',
            'as',
            'else',
            'import',
            'static',
            'assert',
            'enum',
            'in',
            'super',
            'async',
            'export',
            'interface',
            'switch',
            'await',
            'extends',
            'is',
            'sync',
            'break',
            'external',
            'library',
            'this',
            'case',
            'factory',
            'mixin',
            'throw',
            'catch',
            'false',
            'new',
            'true',
            'class',
            'final',
            'null',
            'try',
            'const',
            'finally',
            'on',
            'typedef',
            'continue',
            'for',
            'operator',
            'var',
            'covariant',
            'Function',
            'part',
            'void',
            'default',
            'get',
            'rethrow',
            'while',
            'deferred',
            'hide',
            'return',
            'with',
            'do',
            'if',
            'set',
            'yield'
        ];

        if (reservedKeywords.includes(key)) {
            throw (`Json key shouldn't included reserved keyword [${key}]`);
        }
    }
    return key;
}

// remove duplicate element
function removeSurplusElement(obj: any) {
    if (Array.isArray(obj)) {
        // check array [0] is object
        if(typeof obj[0] === 'object'){
            let tempArr;
            for (let element of obj) {
                let temp = Object.keys(element).filter(key => typeof element[key] === 'number' && `${element[key]}`.includes('.'));
                if(temp.length > 0){
                    tempArr = element;
                    break;
                }
            };
            
            if(tempArr !== null){
                obj.splice(0, 0, tempArr);
            }
        }else{
            // check if array contain double then follow by double
            let tempArr = obj.filter(x => typeof x === 'number' && `${x}`.includes('.'));
            
            if(tempArr.length > 0){
                obj.splice(0, 0, obj.filter(x => typeof x === 'number' && `${x}`.includes('.'))[0]);
            }
        }

        obj.length = 1;
        removeSurplusElement(obj[0]);
    } else if (typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                removeSurplusElement(obj[key]);
            }
        }
    }
}

function buildClassName(className: string): string {
    let buildName: string = camelCase(className);
    buildName = upperFirst(buildName);

    return buildName;
}

//!获取数组循环语句
function getIterateLines(arr: any[], className: string, legalKey: string, jsonKey: string): { fromJsonLinesJoined: string, toJsonJoined: string } {
    if (legalKey === 'data') {
        legalKey = 'this.data';
    }

    let { inner, genericString, isDefaultType } = getInnerObjInfo(arr, className);
    if (inner === undefined || inner === null) {
        throw (`the property named &nbsp <b>${jsonKey}</b> &nbsp is an EMPTY array ! parse process is failed !`);
    }

    let fromJsonLines = [];
    let toJsonLines = [];

    if (isDefaultType) {
        fromJsonLines.unshift(
            `${intent3}${legalKey}: json[${jsonKey}] == null ? [] : ${genericString}.from(json[${jsonKey}].map((x) => x)),\n`
        );

        toJsonLines.push(
            `${intent2}if (${legalKey} != null) ${jsonKey} :${legalKey}?.map((e) => e.toString()).toList(),\n`
        );
    } else {
        fromJsonLines.unshift(
            `${intent3}${legalKey}: json[${jsonKey}] == null ? [] : ${className}.listFromJson(json[${jsonKey}]),\n`
        );

        toJsonLines.push(
            `${intent2}if (${legalKey} != null) ${jsonKey} :${legalKey}?.map((e) => e.toJson()).toList(),\n`
        );
    }

    let fromJsonLinesJoined: string = fromJsonLines.join('\n');
    let toJsonJoined: string = toJsonLines.join('\n');

    return { fromJsonLinesJoined, toJsonJoined };
}

function getInnerObjInfo(arr: any, className: string): { inner: any[], genericString: string, isDefaultType: boolean } {
    let { inner, count } = getInnerObj(arr, 0);

    let innerClass: string = className;
    let isDefaultType: boolean = false;

    if (!importSubClass.includes(snakeCase(className))) {
        importSubClass.push(snakeCase(className));
    }

    const declareType = typeof inner;

    if (declareType === 'boolean') {
        innerClass = DARTTYPES.bool;
        isDefaultType = true;
        importSubClass.pop();
    } else {
        if (declareType === 'string') {
            innerClass = DARTTYPES.string;
            isDefaultType = true;
            importSubClass.pop();
        }
        if (declareType === 'number') {
            innerClass = `${inner}`.includes('.') ? DARTTYPES.double : DARTTYPES.int;
            isDefaultType = true;
            importSubClass.pop();
        }
    }

    // generate List with generic type
    let genericStrings: string[] = [innerClass];
    while (count) {
        genericStrings.unshift('List<');
        genericStrings.push('>');
        count--;
    }
    let genericString = genericStrings.join('');

    return { inner, genericString, isDefaultType };
}

// find the inner object
function getInnerObj(arr: any, count: number = 0): { inner: any[], count: number } {
    if (Array.isArray(arr)) {
        let first = arr[0];
        count++;

        return getInnerObj(first, count);
    } else {
        return { inner: arr, count };
    }
}