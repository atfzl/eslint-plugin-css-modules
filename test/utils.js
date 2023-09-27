/* pattern taken from eslint-plugin-import */

import path from 'path';

/**
 * Adds default option to ESLint TestRunner test cases.
 *
 * TODO:  Replace this function with passing a default option object to
 * TestRunner.
 * @see https://eslint.org/docs/latest/integrate/nodejs-api#ruletester
 */
export function addDefaultOptions (testCase) {
  return {
    ...testCase,
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 6,
      ecmaFeatures: { jsx: true },
    },
    filename: path.resolve(__dirname, './files/foo.js'),
  };
}
