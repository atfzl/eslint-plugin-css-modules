/* @flow */
import _ from 'lodash';

import {
  getStyleImportNodeData,
  getStyleClasses,
  getPropertyName,
  getClassesMap,
  getFilePath,
} from '../core';

import type { JsNode } from '../types';

export default {
  meta: {
    docs: {
      description: 'Checks that you are using the existent css/scss/less classes',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          camelCase: { enum: [true, 'dashes', 'only', 'dashes-only'] }
        },
      }
    ],
  },
  create (context: Object) {
    const camelCase = _.get(context, 'options[0].camelCase');

    /*
       maps variable name to property Object
       map = {
         [variableName]: {
           classesMap: { foo: 'foo', fooBar: 'foo-bar', 'foo-bar': 'foo-bar' },
           node: {...}
         }
       }

       example:
       import s from './foo.scss';
       s is variable name

       property Object has two keys
       1. classesMap: an object with propertyName as key and its className as value
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

        const styleFileAbsolutePath = getFilePath(context, styleFilePath);

        const classes = getStyleClasses(styleFileAbsolutePath);
        const classesMap = classes && getClassesMap(classes, camelCase);

        // this will be used to check if classes are defined
        _.set(map, `${importName}.classesMap`, classesMap);

        // save node for reporting unused styles
        _.set(map, `${importName}.node`, importNode);
      },
      MemberExpression: (node: JsNode) => {
        /*
           Check if property exists in css/scss file as class
         */

        const objectName = node.object.name;

        const propertyName = getPropertyName(node, camelCase);

        if (!propertyName) {
          return;
        }

        const classesMap = _.get(map, `${objectName}.classesMap`);

        if (classesMap && classesMap[propertyName] == null) {
          context.report(node.property, `Class '${propertyName}' not found`);
        }
      }
    };
  }
};
