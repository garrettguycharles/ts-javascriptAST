import {
    ArrowFunctionExpressionNode,
    AssignmentExpressionNode,
    AstNode,
    BlockStatementNode,
    ForInStatementNode,
    ForOfStatementNode,
    ForStatementNode,
    FunctionDeclarationNode,
    FunctionExpressionNode,
    isArrayExpressionNode,
    isArrayPatternNode,
    isBinaryExpressionNode,
    isCallExpressionNode,
    isIdentifierNode,
    isLiteralNode,
    isMemberExpressionNode,
    isNewExpressionNode,
    isObjectExpressionNode,
    isObjectPatternNode,
    isPropertyNode,
    isUnaryExpressionNode,
    isVariableDeclaratorNode,
    MemberExpressionNode,
    ObjectExpressionNode,
    ProgramNode,
    VariableDeclaratorNode
} from "../AstNodeTypes";
import Logger from "jet-logger";
import {AstVisitor, RawValueResolverVisitor, VariableScope, VariableTracker} from "../Ast";

function getFlatScopesArray(scope: VariableScope): VariableScope[] {
    const scopes: VariableScope[] = [];

    function visitScope(s: VariableScope): void {
        scopes.push(s);
        for (const scope of Object.values(s.child_scopes)) {
            visitScope(scope);
        }
    }

    visitScope(scope);
    return scopes;
}

function printScope(scope: VariableScope): void {
    const scopes = getFlatScopesArray(scope);

    scopes.sort((a, b) => a.start - b.start);

    for (const s of scopes.filter(scope => scope.id.includes("Function"))) {
        let toPrint: {[key: string]: any} = Object.assign({}, s);
        delete toPrint.child_scopes;
        delete toPrint.parent_scope;

        // @ts-ignore
        toPrint.variables = Object.values(toPrint.variables).map(v => {
            // @ts-ignore
            return {identifier: v.identifier || v.name, accesses: JSON.stringify(Array.from(v.accesses))};
        });

        console.log(`${toPrint.id}: \n`, toPrint);
    }
}

/**
 * This visitor is a work in progress. The end goal
 * is to have it analyze how objects are used throughout
 * the code and build its best guess for what each object's
 * shape is.
 *
 * (It's trying to build interfaces based on usages)
 */
export class TypeFinderVisitor extends AstVisitor {
    currentScope = new VariableScope("root");

    private pushScope(node: AstNode, scopeName = ""): void {
        const newScope = new VariableScope(node);
        if (scopeName) {
            newScope.name = scopeName;
        }
        newScope.parent_scope = this.currentScope;
        if (!this.currentScope) {
            this.currentScope = newScope;
        } else {
            this.currentScope.child_scopes[newScope.id] = newScope;
        }

        this.currentScope = newScope;
    }

    private popScope(): void {
        if (this.currentScope.parent_scope) {
            this.currentScope = this.currentScope.parent_scope;
        } else {
            throw new Error(`Tried to pop too many scopes. Current scope: ${this.currentScope.id}`);
        }
    }

    private registerNewVariableDeclaration(declarator: VariableDeclaratorNode | string): void {
        let varName;
        if (isVariableDeclaratorNode(declarator)) {
            let idVisitor = new RawValueResolverVisitor();
            idVisitor.visitNode(declarator.id);
            varName = idVisitor.getRawValue().toString();
            if (this.currentScope.variables[varName]) {
                throw new Error(`Multiple declarations of variable ${varName} (see position ${declarator.start})`);
            }
        } else {
            varName = declarator;
        }

        this.currentScope.variables[varName] = new VariableTracker(declarator);
    }

    private recordMemberAccess(memberAccess: MemberExpressionNode): void {
        const objVisitor = new RawValueResolverVisitor();
        objVisitor.visitNode(memberAccess.object);
        const objName = objVisitor.getRawValue().toString();
        let scopeToCheck: VariableScope | undefined = this.currentScope;
        let varTracker: VariableTracker | undefined;
        while (!varTracker && scopeToCheck) {
            varTracker = scopeToCheck.variables[objName];
            scopeToCheck = scopeToCheck.parent_scope;
        }
        if (!varTracker) {
            Logger.warn(`Accessing uninitialized variable ${objName} at position ${memberAccess.start}`);
            varTracker = new VariableTracker(objName);
            this.currentScope.variables[objName] = varTracker;
        }

        const propVisitor = new RawValueResolverVisitor();
        propVisitor.visitNode(memberAccess.property);

        varTracker.accesses.add(propVisitor.getRawValue().toString());
    }

    private recordAssignment(assignment: AssignmentExpressionNode): void {
        const leftVisitor = new RawValueResolverVisitor();
        leftVisitor.visitNode(assignment.left);
        const varName = leftVisitor.getRawValue().toString();

        let scopeToCheck: VariableScope | undefined = this.currentScope;
        let varTracker: VariableTracker | undefined;
        while (!varTracker && scopeToCheck) {
            varTracker = scopeToCheck.variables[varName];
            scopeToCheck = scopeToCheck.parent_scope;
        }
        if (!varTracker) {
            Logger.warn(`Assigning uninitialized variable ${varName} at position ${assignment.start}`);
            varTracker = new VariableTracker(varName);
            this.currentScope.variables[varName] = varTracker;
        }

        const rightVisitor = new RawValueResolverVisitor();
        rightVisitor.visitNode(assignment.right);
        const newVarValue = rightVisitor.getRawValue().toString();

        varTracker.assignments.push(newVarValue);
    }

    protected beginVisitProgramNode(programNode: ProgramNode): boolean {
        this.pushScope(programNode);
        return true;
    }

    protected endVisitProgramNode(programNode: ProgramNode): boolean {
        this.popScope();

        printScope(this.currentScope);

        return true;
    }

    protected beginVisitBlockStatement(node: BlockStatementNode): boolean {
        this.pushScope(node);
        return true;
    }

    protected endVisitBlockStatement(node: BlockStatementNode): boolean {
        this.popScope();
        return true;
    }

    protected beginVisitForStatement(node: ForStatementNode): boolean {
        this.pushScope(node);
        return true;
    }

    protected endVisitForStatement(node: ForStatementNode): boolean {
        this.popScope();
        return true;
    }

    protected beginVisitForOfStatement(node: ForOfStatementNode): boolean {
        this.pushScope(node);
        return true;
    }

    protected endVisitForOfStatement(node: ForOfStatementNode): boolean {
        this.popScope();
        return true;
    }

    protected beginVisitForInStatement(node: ForInStatementNode): boolean {
        this.pushScope(node);
        return true;
    }

    protected endVisitForInStatement(node: ForInStatementNode): boolean {
        this.popScope();
        return true;
    }

    protected beginVisitObjectExpression(node: ObjectExpressionNode): boolean {
        this.pushScope(node);
        // TODO: add "this" to new scope
        return true;
    }

    protected endVisitObjectExpression(node: ObjectExpressionNode): boolean {
        this.popScope();
        return true;
    }

    protected beginVisitFunctionDeclaration(node: FunctionDeclarationNode): boolean {
        const idVisitor = new RawValueResolverVisitor();
        idVisitor.visitNode(node.id);
        this.pushScope(node, idVisitor.getRawValue());


        const paramVisitor = new RawValueResolverVisitor();
        for (const param of node.params) {
            paramVisitor.reset();
            paramVisitor.visitNode(param);
            this.registerNewVariableDeclaration(paramVisitor.getRawValue().toString());
        }

        return true;
    }

    protected endVisitFunctionDeclaration(node: FunctionDeclarationNode): boolean {
        this.popScope();
        return true;
    }

    protected beginVisitFunctionExpression(node: FunctionExpressionNode): boolean {
        let functionName = node.parent?.type || "";

        if (node.parent) {
            if (isPropertyNode(node.parent)) {
                const idVisitor = new RawValueResolverVisitor();
                idVisitor.visitNode(node.parent.key);
                functionName = idVisitor.getRawValue();
            }
        }


        this.pushScope(node, functionName);

        const paramVisitor = new RawValueResolverVisitor();
        for (const param of node.params) {
            paramVisitor.reset();
            paramVisitor.visitNode(param);
            this.registerNewVariableDeclaration(paramVisitor.getRawValue().toString());
        }

        return true;
    }

    protected endVisitFunctionExpression(node: FunctionExpressionNode): boolean {
        this.popScope();
        return true;
    }

    protected beginVisitArrowFunctionExpression(node: ArrowFunctionExpressionNode): boolean {
        this.pushScope(node);

        const paramVisitor = new RawValueResolverVisitor();
        for (const param of node.params) {
            paramVisitor.reset();
            paramVisitor.visitNode(param);
            this.registerNewVariableDeclaration(paramVisitor.getRawValue().toString());
        }

        return true;
    }

    protected endVisitArrowFunctionExpression(node: ArrowFunctionExpressionNode): boolean {
        this.popScope();
        return true;
    }

    protected beginVisitVariableDeclarator(varDeclarator: VariableDeclaratorNode): boolean {
        const id = varDeclarator.id;
        const initializer = varDeclarator.init;

        let newVariableName = "";
        let newVariableValue;

        if (isIdentifierNode(id)) {
            newVariableName = id.name;
            if (isLiteralNode(initializer)) {
                newVariableValue = initializer.value;
            } else if (isCallExpressionNode(initializer)) {
                const callExpVisitor = new RawValueResolverVisitor();
                callExpVisitor.visitNode(initializer);
                newVariableValue = callExpVisitor.getRawValue();
            } else if (isMemberExpressionNode(initializer)) {
                const expVisitor = new RawValueResolverVisitor();
                expVisitor.visitNode(initializer);
                newVariableValue = expVisitor.getRawValue();
            } else if (isBinaryExpressionNode(initializer)) {
                // TODO
                newVariableValue = "(BinaryExpression): " + this.ast.js.substring(initializer.start, initializer.end);
            } else if (isArrayExpressionNode(initializer)) {
                // TODO
                newVariableValue = "(ArrayExpression): " + this.ast.js.substring(initializer.start, initializer.end);
            } else if (isNewExpressionNode(initializer)) {
                // TODO
                newVariableValue = "(NewExpression): " + this.ast.js.substring(initializer.start, initializer.end);
            } else if (isObjectExpressionNode(initializer)) {
                // TODO
                newVariableValue = "(ObjectExpression): " + this.ast.js.substring(initializer.start, initializer.end);
            } else if (isUnaryExpressionNode(initializer)) {
                // TODO
                newVariableValue = "(UnaryExpression): " + this.ast.js.substring(initializer.start, initializer.end);
            } else if (isIdentifierNode(initializer)) {
                // TODO
                newVariableValue = initializer.name;
            } else if (typeof initializer === "object" && initializer === null) {
                // there was no initializer
                newVariableValue = "uninitialized";
            } else {
                console.log("Plain object initializer?: ", initializer, `for name ${newVariableName}`);
            }
        } else if (isObjectPatternNode(id)) {
        } else if (isArrayPatternNode(id)) {
        }

        this.registerNewVariableDeclaration(varDeclarator);
        return true;
    }

    protected beginVisitAssignmentExpressionNode(node: AssignmentExpressionNode): boolean {
        const operator = node.operator;
        const left = node.left;
        const right = node.right;

        let varReference;
        let newVarValue;

        const leftVisitor = new RawValueResolverVisitor();
        leftVisitor.visitNode(left);
        varReference = leftVisitor.getRawValue();

        const rightVisitor = new RawValueResolverVisitor();
        rightVisitor.visitNode(right);
        newVarValue = rightVisitor.getRawValue();

        this.recordAssignment(node);
        return true;
    }

    protected beginVisitMemberExpression(node: MemberExpressionNode): boolean {
        this.recordMemberAccess(node);

        return true;
    }
}