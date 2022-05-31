# Javascript AST Tools

### In progress!

##Getting started:
___
1. Clone this repository.

2. Run `npm install` to download dependencies.

3. Poke around the code! Interesting files are:
   1. [index.ts](src/index.ts): This file parses command line arguments and runs a visitor through your javascript file.
   2. [Ast.ts](src/Ast.ts): This file contains most of the objects that have to do with parsing and traversing the js AST.
   3. [MethodNameReporterVisitor.ts](src/visitors/MethodNameReporterVisitor.ts) is our example visitor.

##Usage:
___
`npx ts-node src/index.ts --path <path to javascript file> --visitor <name of visitor>`

Example command: 

`npx ts-node src/index.ts --path src/test.js --visitor MethodNameReporterVisitor`

Example output:

```text
[2022-05-31T20:50:56.354Z] INFO: Found these methods: 
        - makeAString
        - bark
Duration: 1ms
```

##How to Implement Visitors:
___
1. Make a new TS file in `src/visitors`
2. Have your new visitor class extend the `AstVisitor` abstract class.
3. Override whatever `beginVisit...` or `endVisit...` methods you'd like! (They are declared in [Ast.ts](src/Ast.ts) in the AstVisitor class.)

See [MethodNameReporterVisitor.ts](src/visitors/MethodNameReporterVisitor.ts) and [TypeFinderVisitor.ts](src/visitors/TypeFinderVisitor.ts) for examples of how to do this.