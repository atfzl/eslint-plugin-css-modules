import fp from 'lodash/fp';

import type { Node } from '../../types';

export const styleExtensionRegex = /\.s?css$/;

export const defaultImportStyleData = (() => {
  const defaultImportVariableName: Node => string = fp.compose(
    fp.get('name'),
    fp.get('local'),
    fp.first,
    fp.filter({ type: 'ImportDefaultSpecifier' }),
    fp.get('specifiers'),
  );

  const importPath: Node => string = fp.compose(
    fp.get('value'),
    fp.get('source'),
  );

  return (node: Node): ?Object => {
    if (!node || node.type !== 'ImportDeclaration') return null;

    // key will be the default imported name
    const key = defaultImportVariableName(node);

    // value will be the path from which it was imported
    const value = importPath(node);

    if (key &&  // it had a default import
        value &&
        styleExtensionRegex.test(value)) {
      return {
        [key]: value,
      };
    }
  };
})();
