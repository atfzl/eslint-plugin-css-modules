// js Node
export type Position = {
  line: number, // 1 indexed
  column: number, // 0 indexed
};

export type SourceLocation = {
  start: Position,
  end: Position,
  identifierName?: string,
};

export type JsNode = {
  type: 'ImportDeclaration' | 'ImportDefaultSpecifier',
  start: number,
  end: number,
  loc: JsNode,
  local?: JsNode,
  name?: string,
  value?: string,
  specifiers?: Array<JsNode>,
  importKind?: 'value',
  extra?: {
    rawValue: string,
    raw: string,
  },
  source: JsNode,
  range: Array<number>, // most probably array of 2 numbers ?,
  _babelType: string,
  parent: JsNode,
};

// gonzales AST Node Type
export type gASTNode = {
  traverseByType: Function,

  type: 'stylesheet'
      | 'ident'
      | 'class'
      | 'selector'
      | 'value'
      | 'property'
      | 'ruleset'
      | 'extend'
      | 'declaration',
  content: string | Array<gASTNode>,
  syntax: 'css' | 'scss' | 'less',
};
