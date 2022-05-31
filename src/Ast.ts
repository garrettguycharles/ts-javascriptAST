import {FileReader} from "./utils/FileReader";
import {parse as acornParse} from "acorn";

import {
    ArrowFunctionExpressionNode,
    AssignmentExpressionNode,
    AstNode,
    BinaryExpressionNode,
    BlockStatementNode,
    CallExpressionNode,
    ForInStatementNode,
    ForOfStatementNode,
    ForStatementNode,
    FunctionDeclarationNode,
    FunctionExpressionNode,
    IdentifierNode,
    isArrowFunctionExpressionNode,
    isAssignmentExpressionNode,
    isAstNode,
    isBinaryExpressionNode,
    isBlockStatementNode,
    isCallExpressionNode,
    isForInStatementNode,
    isForOfStatementNode,
    isForStatementNode,
    isFunctionDeclarationNode,
    isFunctionExpressionNode,
    isIdentifierNode,
    isLiteralNode,
    isMemberExpressionNode,
    isObjectExpressionNode,
    isProgramNode,
    isVariableDeclarationNode,
    isVariableDeclaratorNode,
    LiteralNode,
    MemberExpressionNode,
    ObjectExpressionNode,
    ProgramNode,
    VariableDeclarationNode,
    VariableDeclaratorNode
} from "./AstNodeTypes";
import {Stack} from "./structures/Stack";

export class Ast {
    /**
     * URL to Javascript file.
     */
    filepath!: string;

    /**
     * Javascript file contents as a string
     */
    js!: string;

    /**
     * The root AstNode
     */
    root!: AstNode;

    withFilepath(filepath: string): Ast {
        this.filepath = filepath;
        return this;
    }

    withJs(js: string): Ast {
        this.js = js;
        return this;
    }

    withRoot(node: AstNode): Ast {
        this.root = node;
        return this;
    }

    /**
     * Builds an AST from a javascript file path.
     *
     * @param path points to a JS file to load into an AST object.
     */
    static fromFilepath(path: string): Ast {
        const js = new FileReader().read(path);
        const ast = acornParse(js, {ecmaVersion: 2015, sourceType: "module"});

        new AstFormatterVisitor().visitNode(ast as AstNode);

        return new Ast().withFilepath(path).withJs(js).withRoot(ast as AstNode);
    }
}

export abstract class AstVisitor {

    /**
     * The AST which will be visited.
     */
    ast!: Ast;

    withAst<C extends AstVisitor>(this: C, ast: Ast): C {
        this.ast = ast;
        return this;
    }

    visitNode<T extends AstNode>(node: T): boolean {
        // begin visit
        const visitChildren = this.beginVisitNode(node);

        if (visitChildren) {
            for (const [key, value] of Object.entries(node)) {
                if (key === "parent") {
                    continue;
                }

                if (value === undefined || value === null) {
                    continue;
                }

                if (isAstNode(value)) {
                    this.visitNode(value);
                } else {
                    if (typeof value === "object") {
                        if (Array.isArray(value)) {
                            for (const o of value) {
                                if (isAstNode(o)) {
                                    this.visitNode(o);
                                }
                            }
                        } else {
                            for (const o of Object.values(value)) {
                                if (isAstNode(o)) {
                                    this.visitNode(o);
                                }
                            }
                        }
                    }
                }
            }
        }

        // end visit
        return this.endVisitNode(node);
    }

    /**
     * Begins a visit to a node.
     *
     * This step is called before visiting this node's children.
     * @param node the node to visit
     * @returns true if should visit this node's children, else false
     */
    beginVisitNode(node: AstNode): boolean {
        this.preBeginVisitNode(node);

        if (isLiteralNode(node)) {
            return this.beginVisitLiteral(node);
        } else if (isIdentifierNode(node)) {
            return this.beginVisitIdentifier(node);
        } else if (isProgramNode(node)) {
            return this.beginVisitProgramNode(node);
        } else if (isMemberExpressionNode(node)) {
            return this.beginVisitMemberExpression(node);
        } else if (isVariableDeclarationNode(node)) {
            return this.beginVisitVariableDeclaration(node);
        } else if (isVariableDeclaratorNode(node)) {
            return this.beginVisitVariableDeclarator(node);
        } else if (isAssignmentExpressionNode(node)) {
            return this.beginVisitAssignmentExpressionNode(node);
        } else if (isFunctionDeclarationNode(node)) {
            return this.beginVisitFunctionDeclaration(node);
        } else if (isFunctionExpressionNode(node)) {
            return this.beginVisitFunctionExpression(node);
        } else if (isArrowFunctionExpressionNode(node)) {
            return this.beginVisitArrowFunctionExpression(node);
        } else if (isForStatementNode(node)) {
            return this.beginVisitForStatement(node);
        } else if (isForOfStatementNode(node)) {
            return this.beginVisitForOfStatement(node);
        } else if (isForInStatementNode(node)) {
            return this.beginVisitForInStatement(node);
        } else if (isBlockStatementNode(node)) {
            return this.beginVisitBlockStatement(node);
        } else if (isCallExpressionNode(node)) {
            return this.beginVisitCallExpression(node);
        } else if (isBinaryExpressionNode(node)) {
            return this.beginVisitBinaryExpression(node);
        } else if (isObjectExpressionNode(node)) {
            return this.beginVisitObjectExpression(node);
        } else {
            // throw new Error(`Unrecognized node type: ${node.type}`);
        }

        this.postBeginVisitNode(node);

        return true;
    }

    /**
     * Ends a visit to a node.
     *
     * This step is called after visiting this node's children.
     * @param node the node to end visit
     * @returns a boolean. This is unused for now, but I thought it would
     *          be good to return a boolean since beginVisitNode returns a boolean.
     */
    endVisitNode(node: AstNode): boolean {

        this.preEndVisitNode(node);

        if (isLiteralNode(node)) {
            return this.endVisitLiteral(node);
        } else if (isIdentifierNode(node)) {
            return this.endVisitIdentifier(node);
        } else if (isProgramNode(node)) {
            return this.endVisitProgramNode(node);
        } else if (isMemberExpressionNode(node)) {
            return this.endVisitMemberExpression(node);
        } else if (isVariableDeclarationNode(node)) {
            return this.endVisitVariableDeclaration(node);
        } else if (isVariableDeclaratorNode(node)) {
            return this.endVisitVariableDeclarator(node);
        } else if (isAssignmentExpressionNode(node)) {
            return this.endVisitAssignmentExpressionNode(node);
        } else if (isFunctionDeclarationNode(node)) {
            return this.endVisitFunctionDeclaration(node);
        } else if (isFunctionExpressionNode(node)) {
            return this.endVisitFunctionExpression(node);
        } else if (isArrowFunctionExpressionNode(node)) {
            return this.endVisitArrowFunctionExpression(node);
        } else if (isForStatementNode(node)) {
            return this.endVisitForStatement(node);
        } else if (isForOfStatementNode(node)) {
            return this.endVisitForOfStatement(node);
        } else if (isForInStatementNode(node)) {
            return this.endVisitForInStatement(node);
        } else if (isBlockStatementNode(node)) {
            return this.endVisitBlockStatement(node);
        } else if (isCallExpressionNode(node)) {
            return this.endVisitCallExpression(node);
        } else if (isBinaryExpressionNode(node)) {
            return this.endVisitBinaryExpression(node);
        } else if (isObjectExpressionNode(node)) {
            return this.endVisitObjectExpression(node);
        } else {
            // throw new Error(`Unrecognized node type: ${node.type}`);
        }

        this.postEndVisitNode(node);

        return true;
    }



    protected beginVisitProgramNode(programNode: ProgramNode): boolean {return true;}
    protected endVisitProgramNode(programNode: ProgramNode): boolean {return true;}

    protected beginVisitVariableDeclaration(varDeclaration: VariableDeclarationNode): boolean {return true;}
    protected endVisitVariableDeclaration(varDeclaration: VariableDeclarationNode): boolean {return true;}

    protected beginVisitVariableDeclarator(varDeclarator: VariableDeclaratorNode): boolean {return true;}
    protected endVisitVariableDeclarator(varDeclarator: VariableDeclaratorNode): boolean {return true;}

    protected beginVisitIdentifier(identifierNode: IdentifierNode): boolean {return true;}
    protected endVisitIdentifier(identifierNode: IdentifierNode): boolean {return true;}

    protected beginVisitLiteral(literalNode: LiteralNode): boolean {return true;}
    protected endVisitLiteral(literalNode: LiteralNode): boolean {return true;}

    protected beginVisitAssignmentExpressionNode(node: AssignmentExpressionNode): boolean {return true;}
    protected endVisitAssignmentExpressionNode(node: AssignmentExpressionNode): boolean {return true;}

    protected beginVisitMemberExpression(node: MemberExpressionNode): boolean {return true;}
    protected endVisitMemberExpression(node: MemberExpressionNode): boolean {return true;}

    protected beginVisitCallExpression(node: CallExpressionNode): boolean {return true;}
    protected endVisitCallExpression(node: CallExpressionNode): boolean {return true;}

    protected beginVisitBinaryExpression(node: BinaryExpressionNode): boolean {return true;}
    protected endVisitBinaryExpression(node: BinaryExpressionNode): boolean {return true;}

    protected beginVisitFunctionDeclaration(node: FunctionDeclarationNode): boolean {return true;}
    protected endVisitFunctionDeclaration(node: FunctionDeclarationNode): boolean {return true;}

    protected beginVisitFunctionExpression(node: FunctionExpressionNode): boolean {return true;}
    protected endVisitFunctionExpression(node: FunctionExpressionNode): boolean {return true;}

    protected beginVisitArrowFunctionExpression(node: ArrowFunctionExpressionNode): boolean {return true;}
    protected endVisitArrowFunctionExpression(node: ArrowFunctionExpressionNode): boolean {return true;}

    protected beginVisitBlockStatement(node: BlockStatementNode): boolean {return true;}
    protected endVisitBlockStatement(node: BlockStatementNode): boolean {return true;}

    protected beginVisitForStatement(node: ForStatementNode) {return true;}
    protected endVisitForStatement(node: ForStatementNode) {return true;}

    protected beginVisitForOfStatement(node: ForOfStatementNode) {return true;}
    protected endVisitForOfStatement(node: ForOfStatementNode) {return true;}

    protected beginVisitForInStatement(node: ForInStatementNode) {return true;}
    protected endVisitForInStatement(node: ForInStatementNode) {return true;}

    protected beginVisitObjectExpression(node: ObjectExpressionNode) {return true;}
    protected endVisitObjectExpression(node: ObjectExpressionNode) {return true;}

    /**
     * This is called before beginning a visit to any node type.
     *
     * @param node the node to visit
     * @protected
     */
    protected preBeginVisitNode(node: AstNode): void {}

    /**
     * This is called after beginning a visit to any node type.
     *
     * @param node the node to visit
     * @protected
     */
    protected postBeginVisitNode(node: AstNode): void {}

    /**
     * This is called before ending a visit to any node type.
     *
     * @param node the node to visit
     * @protected
     */
    protected preEndVisitNode(node: AstNode): void {}

    /**
     * This is called after ending a visit to any node type.
     * @param node
     * @protected
     */
    protected postEndVisitNode(node: AstNode): void {}
}

/**
 * This visitor is run on every AST to populate
 * each node's parent. Any other basic tree formatting
 * should be performed by this visitor.
 */
export class AstFormatterVisitor extends AstVisitor {
    nodeStack: Stack<AstNode> = new Stack<AstNode>();

    protected preBeginVisitNode(node: AstNode) {
        node.parent = this.nodeStack.peek();
        this.nodeStack.push(node);
    }

    protected preEndVisitNode(node: AstNode) {
        this.nodeStack.pop();
    }
}

export class RawValueResolverVisitor extends AstVisitor {
    value: string = "";

    getRawValue(): string {
        return this.value;
    }

    reset(): void {
        this.value = "";
    }

    protected beginVisitLiteral(literalNode: LiteralNode): boolean {
        this.value = literalNode.raw;
        return false;
    }
    protected beginVisitIdentifier(identifierNode: IdentifierNode): boolean {
        this.value = identifierNode.name;
        return false;
    }
    protected beginVisitMemberExpression(node: MemberExpressionNode): boolean {
        const objVisitor = new RawValueResolverVisitor();
        objVisitor.visitNode(node.object);
        let obj_val = objVisitor.getRawValue();

        const propVisitor = new RawValueResolverVisitor();
        propVisitor.visitNode(node.property);
        let prop_val = propVisitor.getRawValue();

        if (node.computed) {
            this.value = `${obj_val}[${prop_val}]`;
        } else {
            this.value = `${obj_val}.${prop_val}`;
        }
        return false;
    }
    protected beginVisitCallExpression(node: CallExpressionNode): boolean {
        const calleeVisitor = new RawValueResolverVisitor();
        calleeVisitor.visitNode(node.callee);
        let args: (string|number|boolean|object)[] = [];
        const argVisitor = new RawValueResolverVisitor();

        if (Array.isArray(node.arguments)) {
            for (const arg of node.arguments) {
                argVisitor.visitNode(arg);
                args.push(argVisitor.getRawValue());
            }
        } else {
            argVisitor.visitNode(node.arguments);
            args.push(argVisitor.getRawValue());
        }

        this.value = `${calleeVisitor.getRawValue()}(${args.join(", ")})`;
        return false;
    }
    protected beginVisitAssignmentExpressionNode(node: AssignmentExpressionNode): boolean {
        const visitor = new RawValueResolverVisitor();
        visitor.visitNode(node.left);
        const leftValue = visitor.getRawValue();
        visitor.visitNode(node.right);
        const rightValue = visitor.getRawValue();

        this.value = `${leftValue} ${node.operator} ${rightValue}`;

        return false;
    }
    protected beginVisitBinaryExpression(node: BinaryExpressionNode): boolean {
        const visitor = new RawValueResolverVisitor();
        visitor.visitNode(node.left);
        const leftValue = visitor.getRawValue();
        visitor.visitNode(node.right);
        const rightValue = visitor.getRawValue();

        this.value = `${leftValue} ${node.operator} ${rightValue}`;

        return false;
    }
}

export class VariableTracker {
    declaration: AstNode | undefined;
    identifier: string;
    assignments: string[] = [];
    accesses: Set<string> = new Set<string>();


    constructor(declaration: VariableDeclaratorNode | string) {
        if (isVariableDeclaratorNode(declaration)) {
            this.declaration = declaration;
            let idVisitor = new RawValueResolverVisitor();
            idVisitor.visitNode(declaration.id);
            this.identifier = idVisitor.getRawValue().toString();
        } else {
            this.identifier = declaration;
        }
    }
}

export class VariableScope {
    id: string;
    name: string;
    start: number;
    end: number;
    variables: {[name: string]: VariableTracker} = {};
    child_scopes: {[id: string]: VariableScope} = {};
    parent_scope: VariableScope | undefined;

    constructor(node: AstNode | "root") {
        if (node === "root") {
            this.start = -1;
            this.end = -1;
            this.id = "root";
            this.name = this.id;
            return;
        }

        this.start = node.start;
        this.end = node.end;
        this.id = `(${node.type}) ${node.start}:${node.end}`;
        this.name = this.id;
    }

    toString(): string {
        if (Object.keys(this.child_scopes).length) {
            return `${this.id}: [\n\t${Object.keys(this.child_scopes).join(",\n\t")}\n]`;
        }

        return `${this.id}: []`;
    }
}

