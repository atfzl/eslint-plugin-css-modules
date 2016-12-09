export type Position = {
  line: number, // 1 indexed
  column: number, // 0 indexed
};

export type SourceLocation = {
  start: Position,
  end: Position,
  identifierName?: string,
};

export type Node = {
  type: 'ImportDeclaration' | 'ImportDefaultSpecifier',
  start: number,
  end: number,
  loc: Node,
  local?: Node,
  name?: string,
  value?: string,
  specifiers?: Array<Node>,
  importKind?: 'value',
  extra?: {
    rawValue: string,
    raw: string,
  },
  source: Node,
  range: Array<number>, // most probably array of 2 numbers ?,
  _babelType: string,
  parent: Node,
};
