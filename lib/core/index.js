import fs from 'fs';
import path from 'path';
import fp from 'lodash/fp';
import _ from 'lodash';
import gonzales from 'gonzales-pe';

import type { JsNode, CssNodeType } from '../types';

const styleExtensionRegex = /\.s?css$/;

export const getDefaultImportStyleData = (node: JsNode): ?Object => {
  // path from which it was imported
  const path = _.get(node, 'source.value');

  if (path && styleExtensionRegex.test(path)) {
    const importNode = fp.compose(
      fp.first,
      fp.filter({ type: 'ImportDefaultSpecifier' }),
      fp.get('specifiers'),
    )(node);

    // the default imported name
    const variableName = _.get(importNode, 'local.name');

    if (variableName) { // it had a default import
      return { variableName, path, importNode };
    }
  }
};

export const getStyleClasses = (filePath: string): ?{
  [key: string]: ?boolean
} => {
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

  const ruleSets: Array<CssNodeType> = [];

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
  return _.zipObject(classNames);
};
