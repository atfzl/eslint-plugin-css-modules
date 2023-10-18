/* eslint-disable mocha/no-setup-in-describe */
import rule from '../../../lib/rules/no-unused-class';
import { RuleTester, addFilenameOption } from '../../utils';

const ruleTester = new RuleTester();

/**
 * ESLint ruleTester uses its own `describe` and `it` functions. This Mocha
 * `describe` is used merely for test output formatting. Disabling the
 * `mocha/no-setup-in-describe` rule to allow running rule tester in it.
 */
describe('no-unused-class', function () {
  ruleTester.run('no-unused-class', rule, {
    valid: [
      {
        name: "absolute import eg: 'foo/bar.scss'",
        code: `
          import s from 'test/files/noUndefClass1.scss';
  
          export default Foo = () => (
            <div className={s.container}></div>
          );
        `,
      },
      {
        name: "dot notation and square brackets eg: s.foo and s['bar']",
        code: `
          import s from './noUnusedClass1.scss';
  
          export default Foo = () => (
            <div className={s.foo}>
              <div className={s['bar']}>
                <span className={s.bold}></span>
              </div>
            </div>
          );
        `,
      },
      {
        name: 'ignore global scope selector',
        code: `
          import s from './noUnusedClass2.scss';
  
          export default Foo = () => (
            <div className={s.foo}>
              <span className="bar"></span>
            </div>
          );
        `,
      },
      {
        name: 'ignore props exported by ICSS :export pseudo-selector https://github.com/css-modules/icss#export',
        code: `
          import s from './export1.scss';
  
          export default Foo = () => (
            <div className={s.bar}></div>
          );
        `,
      },
      {
        name: 'check if composes classes are ignored',
        code: `
          import s from './composes1.scss';
  
          export default Foo = () => (
            <div className={s.bar}>
              <span className={s.baz}></span>
            </div>
          );
        `,
      },
      {
        name: 'composes with multiple classes',
        code: `
          import s from './composesMultiple1.scss';
  
          export default Foo = () => (
            <div className={s.bar}>
              <span className={s.baz}></span>
            </div>
          );
        `,
      },
      {
        name: 'check if @extend classes are ignored',
        code: `
          import s from './extend1.scss';
  
          export default Foo = () => (
            <div className={s.bar}>
              <span className={s.baz}></span>
            </div>
          );
        `,
      },
      {
        name: 'check if classes are ignored if they only exist for nesting parent selectors (`&`)',
        code: `
          import s from './parentSelector7.scss';
  
          export default Foo = () => (
            <div>
              <span className={s.foo_bar}></span>
              <span className={s.foo_baz}></span>
            </div>
          );
        `,
      },
      {
        name: 'check if camelCase=true classes work as expected',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={s.fooBar}>
              <div className={s.barFoo}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snakeCased}></div>
            </div>
          );
        `,
        options: [{ camelCase: true }],
      },
      {
        name: 'Add camelCase option',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={s['foo-bar']}>
              <div className={s['bar-foo']}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snake_cased}></div>
            </div>
          );
        `,
        options: [{ camelCase: true }],
      },
      {
        name: 'check if camelCase=dashes classes work as expected',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={s.fooBar}>
              <div className={s.barFoo}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snake_cased}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'dashes' }],
      },
      {
        name: 'Add support for all variants of the camelCase options',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={s['foo-bar']}>
              <div className={s['bar-foo']}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snake_cased}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'dashes' }],
      },
      {
        name: 'check if camelCase=only classes work as expected',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={s.fooBar}>
              <div className={s.barFoo}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snakeCased}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'only' }],
      },
      {
        name: 'check if camelCase=dashes-only classes work as expected',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={s.fooBar}>
              <div className={s.barFoo}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snake_cased}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'dashes-only' }],
      },
    ].map((testCase) => addFilenameOption(testCase)),
    invalid: [
      {
        name: 'Unused class error',
        code: `
          import s from './noUnusedClass1.scss';
  
          export default Foo = () => (
            <div className={s.bar}></div>
          );
        `,
        errors: ['Unused classes found in noUnusedClass1.scss: foo, bold'],
      },
      {
        name: 'ignored global scope selector class',
        code: `
          import s from './noUnusedClass2.scss';
  
          export default Foo = () => (
            <div>
            </div>
          );
        `,
        errors: ['Unused classes found in noUnusedClass2.scss: foo'],
      },
      {
        name: 'check less support',
        code: `
          import s from './noUnusedClass1.less';
  
          export default Foo = () => (
            <div>
            </div>
          );
        `,
        errors: ['Unused classes found in noUnusedClass1.less: foo'],
      },
      {
        name: 'check composes support',
        code: `
          import s from './composes1.scss';
  
          export default Foo = () => (
            <div className={s.bar}></div>
          );
        `,
        errors: ['Unused classes found in composes1.scss: baz'],
      },
      {
        name: 'check multiple composes support',
        code: `
          import s from './composesMultiple1.scss';
  
          export default Foo = () => (
            <div className={s.bar}></div>
          );
        `,
        errors: ['Unused classes found in composesMultiple1.scss: baz'],
      },
      {
        name: 'check @extend support',
        code: `
          import s from './extend1.scss';
  
          export default Foo = () => (
            <div className={s.bar}></div>
          );
        `,
        errors: ['Unused classes found in extend1.scss: baz'],
      },
      {
        name: 'using parent selector (`&`)',
        code: `
          import s from './parentSelector4.scss';
  
          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.foo_baz}></div>
            </div>
          );
        `,
        errors: ['Unused classes found in parentSelector4.scss: foo_bar'],
      },
      {
        name: 'snake_case',
        code: `
          import s from './parentSelector8.scss';
  
          export default Foo = () => (
            <div className={s.foo} />
          );
        `,
        errors: ['Unused classes found in parentSelector8.scss: foo_bar'],
      },
      {
        name: 'should detect if camel case properties are NOT used when camelCase=true',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={ s.fooBar } />
          );
        `,
        options: [{ camelCase: true }],
        errors: [
          'Unused classes found in noUnusedClass3.scss: bar-foo, alreadyCamelCased, snake_cased',
        ],
      },
      {
        name: 'should detect if camel case properties are NOT used when camelCase=dashes',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={ s.fooBar }>
              <div className={s.snakeCased}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'dashes' }],
        errors: [
          'Unused classes found in noUnusedClass3.scss: bar-foo, alreadyCamelCased, snake_cased',
        ],
      },
      {
        name: 'should detect if camel case properties are NOT used when camelCase=only',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={s['foo-bar']}>
              <div className={s.barFoo}></div>
              <div className={s.snakeCased}></div>
              <div className={s.bar}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'only' }],
        errors: [
          'Unused classes found in noUnusedClass3.scss: foo-bar, alreadyCamelCased',
        ],
      },
      {
        name: 'should detect if camel case properties are NOT used when camelCase=dashes-only',
        code: `
          import s from './noUnusedClass3.scss';
  
          export default Foo = () => (
            <div className={s['foo-bar']}>
              <div className={s.barFoo}></div>
              <div className={s.snakeCased}></div>
              <div className={s.bar}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'dashes-only' }],
        errors: [
          'Unused classes found in noUnusedClass3.scss: foo-bar, alreadyCamelCased, snake_cased',
        ],
      },
    ].map((testCase) => addFilenameOption(testCase)),
  });
});
