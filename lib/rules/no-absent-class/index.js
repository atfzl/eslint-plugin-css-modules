/* @flow */
import path from 'path';

import { getDefaultImportStyleData } from './utils';
import styleClasses from './styleClasses';

import type { Node } from '../../types';

export default {
  meta: {
    docs: {
      description: 'foo',
      category: 'bar',
      recommended: true,
    }
  },
  create (context: Object) {
    const dirName = path.dirname(context.getFilename());

    const variableClassesMap: Map<string, Set<string>> = new Map();

    return {
      ImportDeclaration (node: Node) {
        const defaultImportData = getDefaultImportStyleData(node);

        if (!defaultImportData) {
          return;
        }

        const {
          variable: importDefaultVariable,
          path: styleFilePath,
        } = defaultImportData;

        const styleFileAbsolutePath = path.resolve(dirName, styleFilePath);

        const classes: Set<string> = styleClasses(styleFileAbsolutePath);

        variableClassesMap[importDefaultVariable] = classes;
      },
      MemberExpression: (node: Node) => {
        const objectName = node.object.name;

        const propertyName = node.property.name;

        const availableClasses: Set<string> = variableClassesMap[objectName];

        if (availableClasses) {
          if (!availableClasses.has(propertyName)) {
            context.report(node.property, `class '${propertyName}' not found`);
          }
        }
      }
    };
  }
};
