/* @flow */
import gonzales from 'gonzales-pe';
import path from 'path';
import util from 'util';
import fp from 'lodash/fp';
import fs from 'fs';
import Debug from 'debug';

const debug = Debug('import-style');

const fileContent = fs.readFileSync(
  path.resolve(__dirname, '../data/foo.scss')
);

const ast = gonzales.parse(
  fileContent.toString(), { syntax: 'scss' }
);

type NodeType = {
  type: string,
  content: Array<NodeType> | string,
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

const getStyleClasses = (Node: NodeType): Array<string> => {
  const classes: Array<NodeType> = [];

  ast.traverseByType('class', (node) => {
    classes.push(node);
  });

  const getClassNames = fp.compose(
    fp.flatMap('content'),
    fp.filter({ type: 'ident' }),
    fp.flatMap('content'),
  );

  debug(util.inspect(classes, {}, null));

  return getClassNames(classes);
};

const classes = getStyleClasses(ast);

console.log(classes);
