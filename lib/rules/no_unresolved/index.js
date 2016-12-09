/* @flow */
// import util from 'util';
import path from 'path';

import { defaultImportStyleData } from './utils';
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
      const defaultImportData = defaultImportStyleData(node);

      if (!defaultImportData) {
        return;
      }

      console.log(path.resolve(dirName, defaultImportData.s));

      console.log(defaultImportData);
      // console.log(util.inspect(_.omit(node, 'parent'), false, null));
      // console.log(util.inspect(node, {}, null));
    },
  };
}
