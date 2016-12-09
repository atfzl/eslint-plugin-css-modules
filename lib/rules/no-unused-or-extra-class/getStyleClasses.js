/* @flow */
import gonzales from 'gonzales-pe';
import path from 'path';
import fp from 'lodash/fp';
import { zipObject } from 'lodash';
import fs from 'fs';

type NodeType = {
  type: 'ident',
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

export default function (filePath: string): {[key: string]: ?boolean} {
  try {
    // check if file exists
    fs.statSync(filePath);
  } catch (e) {
    return {};
  }

  const fileContent = fs.readFileSync(filePath);

  const syntax = path.extname(filePath).slice(1); // remove leading .

  const ast = gonzales.parse(
    fileContent.toString(), { syntax }
  );

  const classNodes: Array<NodeType> = [];

  ast.traverseByType('class', (node) => {
    classNodes.push(node);
  });

  const classNames: Array<string> = fp.compose(
    fp.map('content'),
    fp.filter({ type: 'ident' }),
    fp.flatMap('content'),
  )(classNodes);

  // convert array to object, with all values undefined
  return zipObject(classNames);
}
