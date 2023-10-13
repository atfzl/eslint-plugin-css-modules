// @flow

import fs from 'fs';
import path from 'path';
import fp from 'lodash/fp';
import _ from 'lodash';
import gonzales from './gonzales';

import type { JsNode, gASTNode } from '../types';

import {
  getRegularClassesMap,
  getComposesClassesMap,
  getExtendClassesMap,
  getParentSelectorClassesMap,
  getICSSExportPropsMap,
  eliminateGlobals,
} from './traversalUtils';

const styleExtensionRegex = /\.(s?css|less)$/;

function dashesCamelCase (str: string) {
  return str.replace(/-+(\w)/g, function (match, firstLetter) {
    return firstLetter.toUpperCase();
  });
}

export const getFilePath = (context, styleFilePath) => {
  const settings = context.settings['@pager/eslint-plugin-css-modules'];

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

export const fileExists = (filePath: string): boolean => {
  try {
    // check if file exists
    fs.statSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
};

export const getAST = (filePath: string): gASTNode | null => {
  const fileContent = fs.readFileSync(filePath);

  const syntax = path.extname(filePath).slice(1); // remove leading .

  const ampersandRegex = /([A-Za-z]+)&/;
  const fileContentString = fileContent
    .toString()
    .split('\n')
    /* There is a bug in gonzales.parse. Parsing `.less` files which define css custom properties (like `--my-variable`) fails.
     * So we just omit lines containing custom properties overrides. It's a quick and dirty fix, but it gets the job done. */
    .filter((line) => !line.trim().startsWith('--'))
    /* Another bug in gonzales. Parsing `.less` files which contains `&` attached to the right of selectors fails (so, things like `button&`,
     * `.myClass&`, `.myClass& button`, `.myClass& button&`, ...). So, we just remove the `&` from such expressions. */
    .map(line => {
      let purgedLine = line;
      let matchResult = purgedLine.match(ampersandRegex);
      while (matchResult) {
        purgedLine = purgedLine.replace(matchResult[0], matchResult[1]);
        matchResult = purgedLine.match(ampersandRegex);
      }
      return purgedLine;
    })
    .join('\n');

  const ast = gonzales.parse(fileContentString, { syntax });

  if (!ast) {
    throw new Error(`Could not parse ${filePath}`);
  }

  return ast;
};

export const getStyleClasses = (ast: gASTNode): ?Object => {
  // eliminateGlobals(ast); // mutates ast by removing :global scopes
  // This was in the original repo, so I'm leaving it commented for now. Invoking eliminateGlobals(ast)
  // eliminates any class which has a :global ancestor. For example, for
  // :global(.ant-styles) { .my-class { border: red; } }
  // the class .my-class gets removed. Also, I haven't fount a case where it helps with anything

  const classesMap = getRegularClassesMap(ast);
  const composedClassesMap = getComposesClassesMap(ast);
  const extendClassesMap = getExtendClassesMap(ast);
  const parentSelectorClassesMap = getParentSelectorClassesMap(ast);

  return {
    ...classesMap,
    ...composedClassesMap,
    ...extendClassesMap,
    ...parentSelectorClassesMap
  };
};

export const getExportPropsMap = (ast: gASTNode): ?Object => {
  const exportPropsMap = getICSSExportPropsMap(ast);
  return {
    ...exportPropsMap
  };
};
