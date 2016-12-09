/* @flow */
// import util from 'util';
import path from 'path';

import { getDefaultImportStyleData } from './utils';
import styleClasses from './styleClasses';

import type { Node } from '../../types';

export const meta = {
  docs: {
    description: 'foo',
    category: 'bar',
    recommended: true,
  }
};

export function create (context: Object) {
  const dirName = path.dirname(context.getFilename());

  return {
    ImportDeclaration (node: Node) {
      const defaultImportData = getDefaultImportStyleData(node);

      if (!defaultImportData) {
        return;
      }

      const styleFilePath = path.resolve(dirName, defaultImportData.path);

      console.log(styleClasses(styleFilePath));

      console.log(defaultImportData);
      // console.log(util.inspect(_.omit(node, 'parent'), false, null));
      // console.log(util.inspect(node, {}, null));
    },
  };
}
