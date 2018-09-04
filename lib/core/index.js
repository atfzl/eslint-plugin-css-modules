// @flow

import fs from 'fs';
import path from 'path';
import fp from 'lodash/fp';
import _ from 'lodash';
import gonzales from './gonzales';

import type { JsNode } from '../types';

import {
  getRegularClassesMap,
  getComposesClassesMap,
  getExtendClassesMap,
  getParentSelectorClassesMap,
  eliminateGlobals,
  getImportedFilePaths,
} from './traversalUtils';

const styleExtensionRegex = /\.(s?css|less)$/;

function dashesCamelCase (str: string) {
  return str.replace(/-+(\w)/g, function (match, firstLetter) {
    return firstLetter.toUpperCase();
  });
}

export const getFilePath = (context, styleFilePath) => {

  const settings = context.settings && context.settings['css-modules'];

  const dirName = path.dirname(context.getFilename());
  const basePath = (settings && settings.basePath) ? settings.basePath : '';

  return styleFilePath.startsWith('.')
    ? path.resolve(dirName, styleFilePath)
    : path.resolve(basePath, styleFilePath);
};

export const getPropertyName = (node: JsNode): ?string => {
  const propertyName = node.computed
    /*
       square braces eg s['header']
       we won't use node.property.name because it is for cases like
       s[abc] where abc is a variable
     */
     ? node.property.value
     /* dot notation, eg s.header */
     : node.property.name;

  /*
     skip property names starting with _
     eg. special functions provided
     by css modules like _getCss()

     Tried to just skip function calls, but the parser
     thinks of normal property access like s._getCss and
     function calls like s._getCss() as same.
   */
  if (!propertyName || _.startsWith(propertyName, '_')) {
    return null;
  }

  return propertyName;
};

export const getClassesMap = (classes: Object, camelCase: string|boolean): Object => {
  const classesMap = {};

  // Unroll the loop because of performance!
  // Remember that this function will run on every lint (e.g.: on file save)
  switch (camelCase) {
    case true:
      _.forIn(classes, (value, className) => {
        classesMap[className] = className;
        classesMap[_.camelCase(className)] = className;
      });
      break;
    case 'dashes':
      _.forIn(classes, (value, className) => {
        classesMap[className] = className;
        classesMap[dashesCamelCase(className)] = className;
      });
      break;
    case 'only':
      _.forIn(classes, (value, className) => {
        classesMap[_.camelCase(className)] = className;
      });
      break;
    case 'dashes-only':
      _.forIn(classes, (value, className) => {
        classesMap[dashesCamelCase(className)] = className;
      });
      break;
    default:
      _.forIn(classes, (value, className) => {
        classesMap[className] = className;
      });
  }

  return classesMap;
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
    return {}; // user will get error like class 'x' not found
  }

  const fileContent = fs.readFileSync(filePath);

  const syntax = path.extname(filePath).slice(1); // remove leading .

  const ast = gonzales.parse(fileContent.toString(), { syntax });

  if (!ast) {
    // it will be silent and will not show any error
    return null;
  }

  /*
     mutates ast by removing :global scopes
   */
  eliminateGlobals(ast);

  // recursively iterate over imported files and resolve their styles
  const importedClassesMap = getImportedFilePaths(ast, filePath).reduce((all, file) => {
    return { ...all, ...getStyleClasses(file) };
  }, { });

  const classesMap = getRegularClassesMap(ast);
  const composedClassesMap = getComposesClassesMap(ast);
  const extendClassesMap = getExtendClassesMap(ast);
  const parentSelectorClassesMap = getParentSelectorClassesMap(ast);

  return {
    ...importedClassesMap,
    ...classesMap,
    ...composedClassesMap,
    ...extendClassesMap,
    ...parentSelectorClassesMap
  };
};
