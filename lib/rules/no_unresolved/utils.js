import fp from 'lodash/fp';

import type { Node } from '../../types';

export const styleExtensionRegex = /\.s?css$/;

export const getDefaultImportStyleData = (() => {
  const getDefaultImportVariableName: Node => string = fp.compose(
    fp.get('name'),
    fp.get('local'),
    fp.first,
    fp.filter({ type: 'ImportDefaultSpecifier' }),
    fp.get('specifiers'),
  );

  const getImportPath: Node => string = fp.compose(
    fp.get('value'),
    fp.get('source'),
  );

  return (node: Node): ?{ variable: string, path: string } => {
    if (!node || node.type !== 'ImportDeclaration') return null;

    // variable will be the default imported name
    const variable = getDefaultImportVariableName(node);

    // it had a default import
    if (variable) {
      // path from which it was imported
      const path = getImportPath(node);

      if (path && styleExtensionRegex.test(path)) {
        return { variable, path };
      }
    }
  };
})();
