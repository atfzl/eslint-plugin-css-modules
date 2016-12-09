/* @flow */
import gonzales from 'gonzales-pe';
import path from 'path';
import util from 'util';
import fp from 'lodash/fp';
import fs from 'fs';
import Debug from 'debug';

const debug = Debug('eslint-plugin-import-css-modules');

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

export default function (filePath: string): Array<string> {
  const fileContent = fs.readFileSync(filePath);

  const syntax = path.extname(filePath).slice(1); // remove leading .

  const ast = gonzales.parse(
    fileContent.toString(), { syntax }
  );

  const classes: Array<NodeType> = [];

  ast.traverseByType('class', (node) => {
    classes.push(node);
  });

  const getClassNames: Array<NodeType> => Array<string> =
    fp.compose(
    fp.flatMap('content'),
    fp.filter({ type: 'ident' }),
    fp.flatMap('content'),
  );

  debug(util.inspect(classes, {}, null));

  return getClassNames(classes);
}
