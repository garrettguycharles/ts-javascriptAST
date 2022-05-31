import {AstVisitor, RawValueResolverVisitor, VariableScope, VariableTracker} from "../Ast";
import {
    ArrowFunctionExpressionNode,
    AstNode,
    FunctionDeclarationNode,
    FunctionExpressionNode,
    MemberExpressionNode, ProgramNode, PropertyNode
} from "../AstNodeTypes";
import Logger from "jet-logger";

/**
 * Example visitor. This visitor collects the names
 * of all methods declared as a FunctionExpression,
 * and then prints out a report.
 */
export class MethodNameReporterVisitor extends AstVisitor {
    methodNames: Set<string> = new Set<string>();

    protected beginVisitFunctionExpression(node: FunctionExpressionNode): boolean {
        const rawValueVisitor = new RawValueResolverVisitor();
        rawValueVisitor.visitNode((node.parent as PropertyNode).key);

        this.methodNames.add(rawValueVisitor.getRawValue());
        return false;
    }

    protected endVisitProgramNode(programNode: ProgramNode): boolean {
        const report = `Found these methods: \n\t- ${Array.from(this.methodNames).join("\n\t- ")}`;
        Logger.info(report);
        return true;
    }
}