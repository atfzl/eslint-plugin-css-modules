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

export default function (filePath: string): ?{[key: string]: ?boolean} {
  try {
    // check if file exists
    fs.statSync(filePath);
  } catch (e) {
    return {};
  }

  const fileContent = fs.readFileSync(filePath);

  const syntax = path.extname(filePath).slice(1); // remove leading .

  let ast;
  try {
    ast = gonzales.parse(fileContent.toString(), { syntax });
  } catch (e) {
    // TODO: send message to tell about failure to parse css
    return null;
  }

  const ruleSets: Array<NodeType> = [];

  ast.traverseByType('ruleset', (node) => {
    ruleSets.push(node);
  });

  const classNames: Array<string> = fp.compose(
    fp.map('content'),
    fp.filter({ type: 'ident' }),
    fp.flatMap('content'),
    fp.filter({ type: 'class' }),
    fp.flatMap('content'),
    fp.filter({ type: 'selector' }),
    fp.flatMap('content'),
  )(ruleSets);

  // convert array to object, with all values undefined
  return zipObject(classNames);
}
