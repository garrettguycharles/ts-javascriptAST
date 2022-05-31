import {parse as acornParse} from "acorn";
import {FileReader} from "./utils/FileReader";

const fileReader = new FileReader();
const filepaths: string[] = [
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/CleanModel.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/ProcessModel.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/cleanModel/model.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/cleanModel/nodes.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/cleanModel/edges.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/processModel/TestGenerator.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/processModel/formatFile.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/processModel/Model.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/processModel/fileMethods.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/processModel/nodes.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/processModel/patterns.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/processModel/paths.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/processModel/edges.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/languageBindings/webdriverio.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/languageBindings/cypress.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/languageBindings/protractor.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/languageBindings/uiTemplate.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/languageBindings/webClient.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/languageBindings/winium.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/languageBindings/restAssured.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/lib/config/empty_spec.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/simpleJSONObjectExample/model-based-tests/meaMain/Home/meaMainHomepageNoLogin.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/simpleJSONObjectExample/model-based-tests/meaMain/Home/meaMainHomepageLogin.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/simpleJSONObjectExample/model-based-pages/home.js",
    "/home/gcharles/Documents/familysearch/search-react-test/test-generator/simpleJSONObjectExample/model-based-pages/meaMain.js",

];

const types: {[key: string]: {[key: string]: Set<string>}} = {};

function visitObj(obj: any): void {
    if (obj) {
        if (typeof obj.type === "string") {
            types[obj.type] = types[obj.type] || {};

            for (const [key, value] of Object.entries(obj)) {
                types[obj.type][key] = types[obj.type][key] || new Set<string>();
                if (value !== undefined) {
                    // @ts-ignore
                    if (value && typeof value.type === "string") {
                        // @ts-ignore
                        types[obj.type][key].add(value.type);

                    // @ts-ignore
                    } else if (value && value[0] && typeof value[0].type === "string") {
                        let uniontypes: Set<string> = new Set<string>();
                        // @ts-ignore
                        for (const arrayMember of value) {
                            if (arrayMember && typeof arrayMember.type === "string") {
                                uniontypes.add(arrayMember.type);
                            }
                        }

                        types[obj.type][key].add(uniontypes.size > 1 ? `(${Array.from(uniontypes).join("|")})[]` : `${Array.from(uniontypes)[0]}[]`);
                    } else {
                        types[obj.type][key].add(typeof value);
                    }
                }
            }
        }

        for (const value of Object.values(obj)) {
            if (typeof value === "object") {
                visitObj(value);
            }
        }

        try {
            for (const value of obj) {
                visitObj(value);
            }
        } catch (e) {
            // swallow
        }
    }
}

for (const filename of filepaths) {
    const js = fileReader.read(filename);
    console.log(filename);

    try {
        const ast = acornParse(js, {ecmaVersion: 2015, sourceType: "module"});

        const json = ast;

        visitObj(json);
    } catch (e) {
        console.error(e);
    }

}

function getFields(obj: {[key: string]: Set<string>}): string {
    let toReturn = "";
    for (const [name, typeset] of Object.entries(obj)) {
        let nextLine = `\t${name}: ${Array.from(typeset).join(" | ")};\n`
        toReturn += nextLine;
    }

    return toReturn;
}

for (const [name, obj] of Object.entries(types)) {
    const newInterface = `export interface ${name} extends AstNode {\n${getFields(obj)}}\n`;

    console.log(newInterface);
}