const { camelCase, upperFirst, snakeCase } = require('lodash');
import { getPackageName } from '../../utils/get_package_name';
import saveAsFile from './file_saver';
import { intent, intent2, intent3 } from '../../utils/intent_dart';

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

async function objToDart(path: string, jsonObj: any, className: string, isMainClass: boolean = false) {
    if (Array.isArray(jsonObj)) {
        return objToDart(path, jsonObj[0], className);
    }

    let lines: string[] = [];
    let propsLines: string[] = [];
    let constructorLines: string[] = [];
    let fromJsonLines: string[] = [];
    let listFronJsonLines: string[] = [];
    let toJsonLines: string[] = [];

    // Start of class model
    lines.push(`import 'package:baseX/base_x.dart';\n`);

    // lines.push(await getPackageName());
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
                    subClassName
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
            let type: string = '';
            if (typeof element === 'boolean') {
                //bool is special
                type = 'bool';
            } else {
                if (typeof element === 'string') {
                    toType = `json[${jsonKey}]`;
                    type = 'String';
                } else if (typeof element === 'number') {
                    if (Number.isInteger(element)) {
                        toType = `json[${jsonKey}]`;
                        type = 'int';
                    } else {
                        toType = `json[${jsonKey}]`;
                        type = 'double';
                    }
                }
            }
            propsLines.push(`${intent}final ${type}? ${legalKey};\n`);
            fromJsonLines.push(`${intent3}${legalKey}: ${toType},\n`);
            toJsonLines.push(`${intent2}${jsonKey}: ${legalKey},\n`);
        }
    }

    // End of constructor
    constructorLines.push(`${intent}});`);

    // End of fromJson
    fromJsonLines.push(`${intent2});\n`);
    fromJsonLines.push(`${intent}}`);

    // End of toJson
    toJsonLines.push(`${intent}};`);

    // Body : props -> constructor -> fromJson -> toJson
    lines.push(propsLines.join(''));
    lines.push(constructorLines.join(''));
    lines.push(fromJsonLines.join(''));
    lines.push(listFronJsonLines.join(''));
    lines.push(toJsonLines.join(''));

    // End of class model
    lines.push(`}\n`);

    // Import related 
    if (isMainClass) {
        for (var importName of importSubClass) {
            lines.splice(1, 0, `import 'package:${await getPackageName()}/app/model/generated/${importName}.dart';\n`);
        }
    }

    saveAsFile(`${path.replace('json', 'model')}generated/${snakeCase(className)}.dart`, lines.join('\n'));
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

    let { inner, genericString, isDefaultType } = getInnerObjInfo(arr, className,);
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
    let { inner, count } = getInnerObj(arr);

    let innerClass: string = className;
    let isDefaultType: boolean = false;

    if (!importSubClass.includes(snakeCase(className))) {
        importSubClass.push(snakeCase(className));
    }

    if (typeof inner === 'boolean') {
        //we don't handle boolean
        innerClass = 'bool';
        isDefaultType = true;
        importSubClass.pop();
    } else {
        if (typeof inner === 'string') {
            innerClass = 'String';
            isDefaultType = true;
            importSubClass.pop();
        }
        if (typeof inner === 'number') {
            if (Number.isInteger(inner)) {
                innerClass = 'int';
            } else {
                innerClass = 'double';
            }
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

// Temperatures copyWith({
//     String? name,
//     String? age,
//     bool? isAdmin,
//     List<String>? orderIds,
//     dynamic orderItem,
//     List<OrderStack>? orderStack,
//     Permission? permission,
// }) => 
//     Temperatures(
//         name: name ?? this.name,
//         age: age ?? this.age,
//         isAdmin: isAdmin ?? this.isAdmin,
//         orderIds: orderIds ?? this.orderIds,
//         orderItem: orderItem ?? this.orderItem,
//         orderStack: orderStack ?? this.orderStack,
//         permission: permission ?? this.permission,
    // );
