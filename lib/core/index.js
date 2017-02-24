// @flow

import fs from 'fs';
import path from 'path';
import fp from 'lodash/fp';
import gonzales from 'gonzales-pe';

import type { JsNode } from '../types';

import {
  getRegularClassesMap,
  getComposesClassesMap,
  getExtendClassesMap,
} from './cssClasses';

const styleExtensionRegex = /\.(s?css|less)$/;

export const getPropertyName = (node: JsNode): ?string => {
  if (node.computed) {
    /*
       square braces eg s['header']
       we won't use node.property.name because it is for cases like
       s[abc] where abc is a variable
     */
    return node.property.value;
  }

  return node.property.name;  /* dot notation, eg s.header */
};

export const getStyleImportNodeData = (node: JsNode): ?Object => {
  // path from which it was imported
  const styleFilePath = fp.get('source.value')(node);

  if (styleFilePath && styleExtensionRegex.test(styleFilePath)) {
    const importNode = fp.compose(
      fp.find({ type: 'ImportDefaultSpecifier' }),
      fp.get('specifiers'),
    )(node);

    // the default imported name
    const importName = fp.get('local.name')(importNode);

    if (importName) { // it had a default import
      return { importName, styleFilePath, importNode };
    }
  }
};

export const getStyleClasses = (filePath: string): ?Object => {
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
    // MAYBE: send message to tell about failure to parse file
    return null;
  }

  const classesMap = getRegularClassesMap(ast);
  const composedClassesMap = getComposesClassesMap(ast);
  const extendClassesMap = getExtendClassesMap(ast);

  return { ...classesMap, ...composedClassesMap, ...extendClassesMap };
};
