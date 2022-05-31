import {Command} from "commander";
import {Ast, AstVisitor, VariableScope} from "./Ast";
import Logger from "jet-logger";
import {TypeFinderVisitor} from "./visitors/TypeFinderVisitor";
import {MethodNameReporterVisitor} from "./visitors/MethodNameReporterVisitor";

let program = new Command();
program.version('0.0.0.1')
    .requiredOption('-p, --path <path>', 'Path to javascript file to parse.')
    .requiredOption('-v, --visitor <name>', "Name of visitor to run on javascript file")
    .parse(process.argv);

interface CliOptions {
    path: string;
    visitor: string;
}

const cli = program.opts() as CliOptions;

const filename = cli.path;

const ast = Ast.fromFilepath(filename);

const VISITORS: {[name: string]: AstVisitor} = {
    TypeFinderVisitor: new TypeFinderVisitor(),
    MethodNameReporterVisitor: new MethodNameReporterVisitor()
};

let visitor: AstVisitor;

for (const [key, vis] of Object.entries(VISITORS)) {
    if (key.toLowerCase() === cli.visitor.toLowerCase()) {
        visitor = vis;
        break;
    }
}

// @ts-ignore
if (!visitor) {
    Logger.err(`Could not find a visitor by the name of ${cli.visitor}.`);
    Logger.warn(`Registered visitors:\n\t${Object.keys(VISITORS).join("\n\t")}`);
    Logger.err("Aborting.");
    process.exit(1);
}

visitor.withAst(ast);

const start = Date.now();
visitor.visitNode(ast.root);
const end = Date.now();

// function getFlatScopesArray(scope: VariableScope): VariableScope[] {
//     const scopes: VariableScope[] = [];
//
//     function visitScope(s: VariableScope): void {
//         scopes.push(s);
//         for (const scope of Object.values(s.child_scopes)) {
//             visitScope(scope);
//         }
//     }
//
//     visitScope(scope);
//     return scopes;
// }
//
// function printScope(scope: VariableScope): void {
//     const scopes = getFlatScopesArray(scope);
//
//     scopes.sort((a, b) => a.start - b.start);
//
//     for (const s of scopes.filter(scope => scope.id.includes("Function"))) {
//         let toPrint: {[key: string]: any} = Object.assign({}, s);
//         delete toPrint.child_scopes;
//         delete toPrint.parent_scope;
//
//         // @ts-ignore
//         toPrint.variables = Object.values(toPrint.variables).map(v => {
//             // @ts-ignore
//             return {identifier: v.identifier || v.name, accesses: JSON.stringify(Array.from(v.accesses))};
//         });
//
//         console.log(`${toPrint.id}: \n`, toPrint);
//     }
// }
//
// printScope((visitor as TypeFinderVisitor).currentScope);

console.log(`Duration: ${end - start}ms`);

