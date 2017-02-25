/*
   ignore this file. This just for checking logs
 */

import { RuleTester } from 'eslint';

import rule from '../lib/rules/no-undef-class';

import { test } from '../tests/utils';

const ruleTester = new RuleTester();

ruleTester.run('no-undef-class', rule, {
  valid: [
    { code: '' },
  ],
  invalid: [
    test({
      code: `
        import s from './global1.scss';
      `,
      errors: ['foo'],
    }),
  ]
});
