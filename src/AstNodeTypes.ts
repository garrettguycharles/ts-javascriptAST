import {Node} from "acorn";

export interface AstNode extends Node {
    type: string;
    start: number;
    end: number;
    parent: AstNode | undefined;
}
export function isAstNode(node: any): node is AstNode {
    return node instanceof Node;
}

export interface ProgramNode extends AstNode {
    body: (VariableDeclarationNode|ExpressionStatementNode|IfStatementNode|FunctionDeclarationNode)[];
    sourceType: string;
}
export function isProgramNode(node: any): node is ProgramNode {
    return node instanceof Node && node.type === "Program";
}

export interface VariableDeclarationNode extends AstNode {
    declarations: VariableDeclaratorNode[];
    kind: "const" | "let" | "var";
}
export function isVariableDeclarationNode(node: any): node is VariableDeclarationNode {
    return node instanceof Node && node.type === "VariableDeclaration";
}

export interface VariableDeclaratorNode extends AstNode {
    id: IdentifierNode | ObjectPatternNode | ArrayPatternNode;
    init: LiteralNode | CallExpressionNode | MemberExpressionNode | BinaryExpressionNode | ArrayExpressionNode | NewExpressionNode | ObjectExpressionNode | UnaryExpressionNode | IdentifierNode | object;
}
export function isVariableDeclaratorNode(node: any): node is VariableDeclaratorNode {
    return node instanceof Node && node.type === "VariableDeclarator";
}

export interface IdentifierNode extends AstNode {
    name: string;
}
export function isIdentifierNode(node: any): node is IdentifierNode {
    return node instanceof Node && node.type === "Identifier";
}

export interface CallExpressionNode extends AstNode {
    callee: IdentifierNode | MemberExpressionNode;
    arguments: AstNode | AstNode[];
    // arguments: Literal[] | MemberExpression[] | Identifier[] | object | (Literal|CallExpression)[] | BinaryExpression[] | (Identifier|Literal)[] | (Identifier|FunctionExpression)[] | (MemberExpression|Identifier)[] | CallExpression[] | (MemberExpression|Identifier|Literal)[] | (Identifier|BinaryExpression)[] | (BinaryExpression|Literal)[] | (Literal|Identifier)[] | (MemberExpression|Literal)[] | (Literal|UnaryExpression)[] | (BinaryExpression|Literal|Identifier)[] | (Identifier|MemberExpression)[] | (BinaryExpression|CallExpression)[] | (Identifier|MemberExpression|BinaryExpression|CallExpression)[] | (Identifier|CallExpression)[] | (Literal|BinaryExpression)[] | (Identifier|MemberExpression|BinaryExpression)[] | (Literal|MemberExpression)[] | (CallExpression|Identifier)[] | FunctionExpression[] | ObjectExpression[] | (CallExpression|Literal)[] | (Identifier|Literal|BinaryExpression)[] | ArrowFunctionExpression[] | (BinaryExpression|MemberExpression)[] | (BinaryExpression|Identifier)[];
}
export function isCallExpressionNode(node: any): node is CallExpressionNode {
    return node instanceof Node && node.type === "CallExpression";
}

export interface LiteralNode extends AstNode {
    value: string | number | boolean | object;
    raw: string;
    regex: object;
}
export function isLiteralNode(node: any): node is LiteralNode {
    return node instanceof Node && node.type === "Literal";
}

export interface ExpressionStatementNode extends AstNode {
    expression: CallExpressionNode | AssignmentExpressionNode | UpdateExpressionNode | UnaryExpressionNode;
}
export function isExpressionStatementNode(node: any): node is ExpressionStatementNode {
    return node instanceof Node && node.type === "ExpressionStatement";
}

export interface MemberExpressionNode extends AstNode {
    object: IdentifierNode | CallExpressionNode | MemberExpressionNode | ThisExpressionNode | ArrayExpressionNode | BinaryExpressionNode;
    property: IdentifierNode | LiteralNode | MemberExpressionNode | BinaryExpressionNode | CallExpressionNode;
    computed: boolean;
}
export function isMemberExpressionNode(node: any): node is MemberExpressionNode {
    return node instanceof Node && node.type === "MemberExpression";
}

export interface IfStatementNode extends AstNode {
    test: CallExpressionNode | LogicalExpressionNode | MemberExpressionNode | BinaryExpressionNode | UnaryExpressionNode | IdentifierNode;
    consequent: BlockStatementNode | ExpressionStatementNode;
    alternate: BlockStatementNode | IfStatementNode | object;
}
export function isIfStatementNode(node: any): node is IfStatementNode {
    return node instanceof Node && node.type === "IfStatement";
}

export interface BlockStatementNode extends AstNode {
    body: AstNode | AstNode[];
    // body: ExpressionStatement[] | (VariableDeclaration|IfStatement|ExpressionStatement|ForStatement)[] | (VariableDeclaration|TryStatement)[] | (ExpressionStatement|ReturnStatement)[] | (IfStatement|ExpressionStatement)[] | ThrowStatement[] | IfStatement[] | ReturnStatement[] | (VariableDeclaration|ReturnStatement)[] | (VariableDeclaration|ForOfStatement|ExpressionStatement|IfStatement|ForStatement)[] | (VariableDeclaration|ForOfStatement|ExpressionStatement)[] | (VariableDeclaration|ExpressionStatement)[] | (ForStatement|ExpressionStatement)[] | (VariableDeclaration|IfStatement|ForStatement|WhileStatement|ExpressionStatement)[] | ForStatement[] | (VariableDeclaration|IfStatement|ExpressionStatement)[] | (ForOfStatement|VariableDeclaration|IfStatement|ExpressionStatement)[] | (VariableDeclaration|ExpressionStatement|IfStatement)[] | (VariableDeclaration|ExpressionStatement|ForStatement)[] | (VariableDeclaration|ForStatement|ReturnStatement)[] | (ExpressionStatement|IfStatement)[] | (IfStatement|ReturnStatement)[] | (VariableDeclaration|ForOfStatement)[] | (IfStatement|VariableDeclaration|ExpressionStatement)[] | (VariableDeclaration|ExpressionStatement|IfStatement|ForOfStatement)[] | ForOfStatement[] | ForInStatement[] | (VariableDeclaration|IfStatement)[] | (ExpressionStatement|VariableDeclaration|ForStatement)[] | (ExpressionStatement|VariableDeclaration|IfStatement)[] | (VariableDeclaration|ForStatement|EmptyStatement|ExpressionStatement|ReturnStatement)[] | (VariableDeclaration|ForInStatement|IfStatement)[] | (VariableDeclaration|ExpressionStatement|ReturnStatement)[] | (VariableDeclaration|TryStatement|IfStatement)[] | object | (VariableDeclaration|ForOfStatement|ExpressionStatement|ForStatement)[] | (ExpressionStatement|ForStatement)[] | (ExpressionStatement|VariableDeclaration|BreakStatement)[] | (FunctionDeclaration|VariableDeclaration|ExpressionStatement|ForOfStatement|IfStatement|ReturnStatement)[] | (ExpressionStatement|VariableDeclaration)[] | (VariableDeclaration|IfStatement|ExpressionStatement|ForOfStatement|ReturnStatement)[] | (VariableDeclaration|ForOfStatement|ReturnStatement)[] | (IfStatement|ForStatement|ReturnStatement)[] | (VariableDeclaration|TryStatement|ReturnStatement)[] | (VariableDeclaration|ThrowStatement)[] | (VariableDeclaration|ExpressionStatement|ForStatement|EmptyStatement|ReturnStatement)[] | (VariableDeclaration|ForStatement|ExpressionStatement)[] | (ForInStatement|EmptyStatement)[] | (VariableDeclaration|ExpressionStatement|ForOfStatement)[] | (ForInStatement|EmptyStatement|IfStatement)[] | (IfStatement|ForOfStatement|ExpressionStatement)[] | (ForOfStatement|IfStatement)[] | (VariableDeclaration|ForOfStatement|IfStatement)[] | (ExpressionStatement|ForOfStatement|IfStatement)[] | (VariableDeclaration|ForOfStatement|ForStatement)[] | (VariableDeclaration|IfStatement|ReturnStatement)[] | (ForOfStatement|ExpressionStatement)[] | (VariableDeclaration|ForInStatement|ExpressionStatement)[] | (VariableDeclaration|ExpressionStatement|ForStatement|IfStatement)[] | (VariableDeclaration|ExpressionStatement|IfStatement|ForInStatement|ForOfStatement|ReturnStatement)[] | (VariableDeclaration|IfStatement|ForOfStatement)[] | (VariableDeclaration|ExpressionStatement|IfStatement|ForOfStatement|ReturnStatement)[] | (VariableDeclaration|WhileStatement|ReturnStatement)[] | (ExpressionStatement|BreakStatement)[] | (VariableDeclaration|ForOfStatement|BreakStatement)[] | BreakStatement[] | (VariableDeclaration|ExpressionStatement|IfStatement|ForStatement|ForOfStatement)[] | (ExpressionStatement|VariableDeclaration|ForOfStatement|IfStatement)[] | (VariableDeclaration|ExpressionStatement|IfStatement|ReturnStatement)[] | (VariableDeclaration|ForStatement|IfStatement)[] | (VariableDeclaration|ForOfStatement|ForStatement|ReturnStatement)[] | (IfStatement|VariableDeclaration|ExpressionStatement|ForStatement)[] | (ForOfStatement|ExpressionStatement|VariableDeclaration|ForStatement|IfStatement)[] | (IfStatement|VariableDeclaration)[] | (VariableDeclaration|IfStatement|ForStatement|ExpressionStatement)[] | (ExpressionStatement|VariableDeclaration|SwitchStatement|IfStatement)[] | (ExpressionStatement|IfStatement|VariableDeclaration)[] | (VariableDeclaration|ForStatement|IfStatement|ExpressionStatement)[] | (VariableDeclaration|ExpressionStatement|WhileStatement|ReturnStatement)[] | (VariableDeclaration|ForStatement)[] | (ExpressionStatement|VariableDeclaration|IfStatement|ForStatement)[] | (IfStatement|ForOfStatement)[] | (ForOfStatement|ReturnStatement)[] | (IfStatement|ExpressionStatement|VariableDeclaration|ForOfStatement)[] | (VariableDeclaration|IfStatement|ExpressionStatement|ReturnStatement)[] | (IfStatement|VariableDeclaration|ExpressionStatement|ReturnStatement)[] | (ExpressionStatement|IfStatement|VariableDeclaration|ForOfStatement|SwitchStatement)[] | (VariableDeclaration|ExpressionStatement|BreakStatement)[] | (ExpressionStatement|IfStatement|ReturnStatement)[] | (VariableDeclaration|IfStatement|ForInStatement|ExpressionStatement|ReturnStatement)[] | (ForOfStatement|ForInStatement)[] | VariableDeclaration[] | (VariableDeclaration|ForOfStatement|IfStatement|ExpressionStatement)[] | (VariableDeclaration|ForStatement|ExpressionStatement|IfStatement)[] | (IfStatement|SwitchStatement)[];
}
export function isBlockStatementNode(node: any): node is BlockStatementNode {
    return node instanceof Node && node.type === "BlockStatement";
}

export interface AssignmentExpressionNode extends AstNode {
    operator: string;
    left: IdentifierNode | MemberExpressionNode;
    right: CallExpressionNode | LiteralNode | ArrayExpressionNode | BinaryExpressionNode | IdentifierNode | MemberExpressionNode | ObjectExpressionNode | NewExpressionNode | UnaryExpressionNode;
}
export function isAssignmentExpressionNode(node: any): node is AssignmentExpressionNode {
    return node instanceof Node && node.type === "AssignmentExpression";
}

export interface BinaryExpressionNode extends AstNode {
    left: LiteralNode | IdentifierNode | MemberExpressionNode | CallExpressionNode | UnaryExpressionNode | BinaryExpressionNode;
    operator: string;
    right: LiteralNode | CallExpressionNode | MemberExpressionNode | IdentifierNode | BinaryExpressionNode | UnaryExpressionNode;
}
export function isBinaryExpressionNode(node: any): node is BinaryExpressionNode {
    return node instanceof Node && node.type === "BinaryExpression";
}

export interface LogicalExpressionNode extends AstNode {
    left: MemberExpressionNode | IdentifierNode | CallExpressionNode | LogicalExpressionNode | UnaryExpressionNode | BinaryExpressionNode;
    operator: string;
    right: CallExpressionNode | UnaryExpressionNode | BinaryExpressionNode | MemberExpressionNode | LogicalExpressionNode | IdentifierNode;
}
export function isLogicalExpressionNode(node: any): node is LogicalExpressionNode {
    return node instanceof Node && node.type === "LogicalExpression";
}

export interface UnaryExpressionNode extends AstNode {
    operator: string;
    prefix: boolean;
    argument: MemberExpressionNode | CallExpressionNode | LiteralNode | IdentifierNode | LogicalExpressionNode;
}
export function isUnaryExpressionNode(node: any): node is UnaryExpressionNode {
    return node instanceof Node && node.type === "UnaryExpression";
}

export interface ForStatementNode extends AstNode {
    init: VariableDeclarationNode | AssignmentExpressionNode;
    test: BinaryExpressionNode;
    update: UpdateExpressionNode | AssignmentExpressionNode;
    body: BlockStatementNode;
}
export function isForStatementNode(node: any): node is ForStatementNode {
    return node instanceof Node && node.type === "ForStatement";
}

export interface UpdateExpressionNode extends AstNode {
    operator: string;
    prefix: boolean;
    argument: IdentifierNode;
}
export function isUpdateExpressionNode(node: any): node is UpdateExpressionNode {
    return node instanceof Node && node.type === "UpdateExpression";
}

export interface ArrayExpressionNode extends AstNode {
    elements: any[] | LiteralNode[] | MemberExpressionNode[] | ObjectExpressionNode[] | IdentifierNode[];
}
export function isArrayExpressionNode(node: any): node is ArrayExpressionNode {
    return node instanceof Node && node.type === "ArrayExpression";
}

export interface FunctionDeclarationNode extends AstNode {
    id: IdentifierNode;
    expression: boolean;
    generator: boolean;
    params: IdentifierNode[];
    body: BlockStatementNode;
}
export function isFunctionDeclarationNode(node: any): node is FunctionDeclarationNode {
    return node instanceof Node && node.type === "FunctionDeclaration";
}

export interface TryStatementNode extends AstNode {
    block: BlockStatementNode;
    handler: CatchClauseNode;
    finalizer: object;
}
export function isTryStatementNode(node: any): node is TryStatementNode {
    return node instanceof Node && node.type === "TryStatement";
}

export interface FunctionExpressionNode extends AstNode {
    id: object;
    expression: boolean;
    generator: boolean;
    params: IdentifierNode[]; // | object; // I took this off for now, put it back on if we find where it comes up.
    body: BlockStatementNode;
}
export function isFunctionExpressionNode(node: any): node is FunctionExpressionNode {
    return node instanceof Node && node.type === "FunctionExpression";
}

export interface ThrowStatementNode extends AstNode {
    argument: NewExpressionNode;
}
export function isThrowStatementNode(node: any): node is ThrowStatementNode {
    return node instanceof Node && node.type === "ThrowStatement";
}

export interface NewExpressionNode extends AstNode {
    callee: IdentifierNode;
    arguments: BinaryExpressionNode[] | object;
}
export function isNewExpressionNode(node: any): node is NewExpressionNode {
    return node instanceof Node && node.type === "NewExpression";
}

export interface ReturnStatementNode extends AstNode {
    argument: IdentifierNode | CallExpressionNode | BinaryExpressionNode | LiteralNode | AstNode[] | object | MemberExpressionNode | LogicalExpressionNode | ArrayExpressionNode;
}
export function isReturnStatementNode(node: any): node is ReturnStatementNode {
    return node instanceof Node && node.type === "ReturnStatement";
}

export interface CatchClauseNode extends AstNode {
    param: IdentifierNode;
    body: BlockStatementNode;
}
export function isCatchClauseNode(node: any): node is CatchClauseNode {
    return node instanceof Node && node.type === "CatchClause";
}

export interface ForOfStatementNode extends AstNode {
    left: VariableDeclarationNode;
    right: MemberExpressionNode | IdentifierNode;
    body: BlockStatementNode;
}
export function isForOfStatementNode(node: any): node is ForOfStatementNode {
    return node instanceof Node && node.type === "ForOfStatement";
}

export interface WhileStatementNode extends AstNode {
    test: BinaryExpressionNode | CallExpressionNode;
    body: BlockStatementNode;
}
export function isWhileStatementNode(node: any): node is WhileStatementNode {
    return node instanceof Node && node.type === "WhileStatement";
}

export interface ObjectExpressionNode extends AstNode {
    properties: PropertyNode[] | object;
}
export function isObjectExpressionNode(node: any): node is ObjectExpressionNode {
    return node instanceof Node && node.type === "ObjectExpression";
}

export interface PropertyNode extends AstNode {
    method: boolean;
    shorthand: boolean;
    computed: boolean;
    key: IdentifierNode | LiteralNode;
    value: ArrowFunctionExpressionNode | FunctionExpressionNode | MemberExpressionNode | LiteralNode | ObjectExpressionNode | IdentifierNode;
    kind: string;
}
export function isPropertyNode(node: any): node is PropertyNode {
    return node instanceof Node && node.type === "Property";
}

export interface ArrowFunctionExpressionNode extends AstNode {
    id: object;
    expression: boolean;
    generator: boolean;
    params: IdentifierNode[];
    body: BlockStatementNode | CallExpressionNode;
}
export function isArrowFunctionExpressionNode(node: any): node is ArrowFunctionExpressionNode {
    return node instanceof Node && node.type === "ArrowFunctionExpression";
}

export interface ForInStatementNode extends AstNode {
    left: VariableDeclarationNode;
    right: MemberExpressionNode | IdentifierNode;
    body: BlockStatementNode;
}
export function isForInStatementNode(node: any): node is ForInStatementNode {
    return node instanceof Node && node.type === "ForInStatement";
}

export interface ThisExpressionNode extends AstNode {
}
export function isThisExpressionNode(node: any): node is ThisExpressionNode {
    return node instanceof Node && node.type === "ThisExpression";
}

export interface EmptyStatementNode extends AstNode {
}
export function isEmptyStatementNode(node: any): node is EmptyStatementNode {
    return node instanceof Node && node.type === "EmptyStatement";
}

export interface BreakStatementNode extends AstNode {
    label: object;
}
export function isBreakStatementNode(node: any): node is BreakStatementNode {
    return node instanceof Node && node.type === "BreakStatement";
}

export interface SwitchStatementNode extends AstNode {
    discriminant: IdentifierNode;
    cases: SwitchCaseNode[];
}
export function isSwitchStatementNode(node: any): node is SwitchStatementNode {
    return node instanceof Node && node.type === "SwitchStatement";
}

export interface SwitchCaseNode extends AstNode {
    consequent: (IfStatementNode|ExpressionStatementNode|BreakStatementNode)[] | AstNode[];
    test: LiteralNode | object;
}
export function isSwitchCaseNode(node: any): node is SwitchCaseNode {
    return node instanceof Node && node.type === "SwitchCase";
}

export interface ObjectPatternNode extends AstNode {
    properties: PropertyNode[];
}
export function isObjectPatternNode(node: any): node is ObjectPatternNode {
    return node instanceof Node && node.type === "ObjectPattern";
}

export interface ArrayPatternNode extends AstNode {
    elements: IdentifierNode[];
}
export function isArrayPatternNode(node: any): node is ArrayPatternNode {
    return node instanceof Node && node.type === "ArrayPattern";
}
