/* @flow */
import path from 'path';
import _ from 'lodash';

import {
  getStyleImportNodeData,
  getStyleClasses,
  getPropertyName,
} from '../core';

import type { JsNode } from '../types';

export default {
  meta: {
    docs: {
      description: 'Checks that you are using the existent css/scss classes, no more no less',
      recommended: true,
    }
  },
  create (context: Object) {
    const dirName = path.dirname(context.getFilename());

    /*
       maps variable name to property Object
       map = { [variableName]: { classes: { foo: true }, node: {...} }

       example:
       import s from './foo.scss';
       s is variable name

       property Object has two keys
       1. classes: an object with className as key and a boolean as value.
       The boolean is marked if it is used in file
       2. node: node that correspond to s (see example above)
     */
    const map = {};

    return {
      ImportDeclaration (node: JsNode) {
        const styleImportNodeData = getStyleImportNodeData(node);

        if (!styleImportNodeData) {
          return;
        }

        const {
          importName,
          styleFilePath,
          importNode,
        } = styleImportNodeData;

        const styleFileAbsolutePath = path.resolve(dirName, styleFilePath);

        /*
           maps classNames with a boolean to mark as used in source
         */
        const classNamesMap = getStyleClasses(styleFileAbsolutePath);

        // this will be used to mark s.foo as used in MemberExpression
        _.set(map, `${importName}.classes`, classNamesMap);

        // save node for reporting unused styles
        _.set(map, `${importName}.node`, importNode);
      },
      MemberExpression: (node: JsNode) => {
        /*
           Check if property exists in css/scss file as class
         */

        const objectName = node.object.name;

        const propertyName = getPropertyName(node);

        if (!propertyName || _.startsWith(propertyName, '_')) {
          /*
             skip property names starting with _
             eg. special functions provided
             by css modules like _.getCss()

             Tried to just skip function calls, but the parser
             thinks of normal property access like s._getCss and
             function calls like s._getCss() as same.
           */
          return;
        }

        const availableClasses = _.get(map, `${objectName}.classes`);

        if (availableClasses && !availableClasses.hasOwnProperty(propertyName)) {
          context.report(node.property, `Class '${propertyName}' not found`);
        }
      }
    };
  }
};
