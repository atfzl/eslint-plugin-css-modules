/* js Node */
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

/* css Node */
export type CssNodeType = {
  type: 'ident',
  content: Array<CssNodeType> | string,
  syntax: string,
  start: {
    line: number,
    column: number,
  },
  end: {
    line: number,
    column: number,
  },
};
