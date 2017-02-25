/*
   ignore this file. This just for checking logs
 */

import { RuleTester } from 'eslint';

import rule from '../lib/rules/no-undef-class';

import { test } from '../test/utils';

const ruleTester = new RuleTester();

ruleTester.run('no-undef-class', rule, {
  valid: [
    { code: '' },
  ],
  invalid: [
    test({
      code: `
        import s from './gonzalesFail1.css';

        export default Foo = () => (
           <div className={s.foo}></div>
        );
      `,
      errors: ['foo'],
    }),
  ]
});
