/* @flow */
import path from 'path';
import _ from 'lodash';

import { getDefaultImportStyleData } from './utils';
import getStyleClasses from './getStyleClasses';

import type { Node } from '../../types';

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
      ImportDeclaration (node: Node) {
        const defaultImportData = getDefaultImportStyleData(node);

        if (!defaultImportData) {
          return;
        }

        const {
          variableName,
          path: styleFilePath,
          importNode,
        } = defaultImportData;

        const styleFileAbsolutePath = path.resolve(dirName, styleFilePath);

        /*
           maps classNames with a boolean to mark as used in source
         */
        const classNamesMap = getStyleClasses(styleFileAbsolutePath);

        _.set(map, `${variableName}.classes`, classNamesMap);

        // save node for reporting unused styles
        _.set(map, `${variableName}.node`, importNode);
      },
      MemberExpression: (node: Node) => {
        /*
           Check if property exists in css/scss file as class
        */
        const objectName = node.object.name;

        const propertyName = node.property.name;

        const availableClasses = _.get(map, `${objectName}.classes`);

        if (availableClasses) {
          if (!availableClasses.hasOwnProperty(propertyName)) {
            context.report(node.property, `Class '${propertyName}' not found`);
          } else {
            // mark as used
            availableClasses[propertyName] = true;
          }
        }
      },
      'Program:exit' () {
        /*
           Check if all classes defined in css/scss file are used
        */
        _.forOwn(map, (o) => {
          const { classes, node } = o;

          // classNames not marked as true are unused
          const unusedClasses = Object.keys(_.omitBy(classes, null));

          if (!_.isEmpty(unusedClasses)) {
            context.report(node, `Unused classes found: ${unusedClasses.join(', ')}`);
          }
        });
      }
    };
  }
};
