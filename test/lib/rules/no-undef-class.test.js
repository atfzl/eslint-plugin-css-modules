/* eslint-disable mocha/no-setup-in-describe */
import rule from '../../../lib/rules/no-undef-class';
import { RuleTester, addFilenameOption } from '../../utils';

const ruleTester = new RuleTester();

/**
 * ESLint ruleTester uses its own `describe` and `it` functions. This Mocha
 * `describe` is used merely for test output formatting. Disabling the
 * `mocha/no-setup-in-describe` rule to allow running rule tester in it.
 */
describe('no-undef-class', function () {
  ruleTester.run('no-undef-class', rule, {
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
        name: 'dot notation eg: s.container',
        code: `
          import s from './noUndefClass1.scss';

          export default Foo = () => (
            <div className={s.container}></div>
          );
        `,
      },
      {
        name: "square bracket string key eg: s['container']",
        code: `
          import s from './noUndefClass1.scss';

          export default Foo = () => (
            <div className={s['container']}></div>
          );
        `,
      },
      {
        name: 'does not check for dynamic properties eg: s[dynamicValue]',
        code: `
          import s from './noUndefClass1.scss';

          export default Foo = (props) => (
            <div className={s[props.primary]}></div>
          );
        `,
      },
      {
        name: 'names starting with _ will be ignored',
        code: `
          import s from './noUndefClass1.scss';

          export default Foo = () => (
            <div>
              {s._getCss()}
            </div>
          );
        `,
      },
      {
        name: 'using composes',
        code: `
          import s from './composes1.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'composing with multiple classes',
        code: `
          import s from './composesMultiple1.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'using @extend',
        code: `
          import s from './extend1.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'using parent selector (`&`)',
        code: `
          import s from './parentSelector1.scss';

          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.foo_bar}></div>
            </div>
          );
        `,
      },
      {
        name: 'Add support for parent selectors (&).',
        code: `
          import s from './parentSelector2.scss';

          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.bar}></div>
              <div className={s.bar_baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'Add support for parent selectors (&).',
        code: `
          import s from './parentSelector3.scss';

          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.foo_bar}></div>
              <div className={s.foo_baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'Add support for parent selectors (&).',
        code: `
          import s from './parentSelector4.scss';

          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.foo_bar}></div>
              <div className={s.foo_baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'Add support for parent selectors (&).',
        code: `
          import s from './parentSelector5.scss';

          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.foo_baz}></div>
              <div className={s.bar_baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'Add support for parent selectors (&).',
        code: `
          import s from './parentSelector6.scss';

          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.foo_bar}></div>
              <div className={s.foo_bar_baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'Support parent selectors in include blocks (aka mixins).',
        code: `
          import s from './parentSelector8.scss';

          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.foo_bar}></div>
            </div>
          );
        `,
      },
      {
        name: "file that can't be parsed should not give any error",
        code: `
          import s from './unparsable.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.baz}></div>
            </div>
          );
        `,
      },
      {
        name: 'global is ignored',
        code: `
          import s from './global1.scss';

          export default Foo = () => (
            <div className={s.local1, s.local2, s.local3, s.local4, s.local5, s.local6}>
            </div>
          );
        `,
      },
      {
        name: 'ICSS :export pseudo-selector with a correct prop name should not give error',
        code: `
          import s from './export1.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.myProp}>
              </div>
            </div>
          );
        `,
      },
      {
        name: 'check if camelCase=true classes work as expected',
        code: `
          import s from './noUndefClass3.scss';

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
        name: 'Add support for all variants of the camelCase options.',
        code: `
          import s from './noUndefClass3.scss';

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
          import s from './noUndefClass3.scss';

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
        name: 'Add camelCase option',
        code: `
          import s from './noUndefClass3.scss';

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
          import s from './noUndefClass3.scss';

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
          import s from './noUndefClass3.scss';

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
        name: 'dot notation',
        code: `
          import s from './noUndefClass1.scss';

          export default Foo = () => (
            <div className={s.containr}></div>
          );
        `,
        errors: ["Class or exported property 'containr' not found"],
      },
      {
        name: 'square bracket',
        code: `
          import s from './noUndefClass1.scss';

          export default Foo = () => (
            <div className={s['containr']}></div>
          );
        `,
        errors: ["Class or exported property 'containr' not found"],
      },
      {
        name: 'classes with global scope for selector are ignored eg. :global(.bold) { font-weight: bold; }',
        code: `
          import s from './global1.scss';

          export default Foo = () => (
            <div className={s.global1, s.global2, s.global3}></div>
          );
        `,
        errors: [
          "Class or exported property 'global1' not found",
          "Class or exported property 'global2' not found",
          "Class or exported property 'global3' not found",
        ],
      },
      {
        name: 'ICSS :export pseudo-selector with wrong prop name https://github.com/css-modules/icss#export',
        code: `
          import s from './export2.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.myProp}>
              </div>
            </div>
          );
        `,
        errors: ["Class or exported property 'myProp' not found"],
      },
      {
        name: 'check less support',
        code: `
          import s from './noUndefClass1.less';

          export default Foo = () => (
            <div className={s.bold}></div>
          );
        `,
        errors: ["Class or exported property 'bold' not found"],
      },
      {
        name: 'using composes',
        code: `
          import s from './composes1.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.bazz}></div>
            </div>
          );
        `,
        errors: ["Class or exported property 'bazz' not found"],
      },
      {
        name: 'composing multiple classes',
        code: `
          import s from './composesMultiple1.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.bazz} />
              <div className={s.foo} />
            </div>
          );
        `,
        errors: ["Class or exported property 'bazz' not found"],
      },
      {
        name: 'using @extend',
        code: `
          import s from './extend1.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.bazz}></div>
            </div>
          );
        `,
        errors: ["Class or exported property 'bazz' not found"],
      },
      {
        name: 'using parent selector (`&`)',
        code: `
          import s from './parentSelector1.scss';

          export default Foo = () => (
            <div className={s.foo}>
              <div className={s.foo_bar}></div>
              <div className={s.foo_baz}></div>
            </div>
          );
        `,
        errors: ["Class or exported property 'foo_baz' not found"],
      },
      {
        name: 'should show errors for file that does not exist',
        code: `
          import s from './fileThatDoesNotExist.scss';

          export default Foo = () => (
            <div className={s.bar}>
              <div className={s.baz}></div>
            </div>
          );
        `,
        errors: [
          "Class or exported property 'bar' not found",
          "Class or exported property 'baz' not found",
        ],
      },
      {
        name: 'should detect if camel case properties are NOT defined when camelCase=true',
        code: `
          import s from './noUndefClass3.scss';

          export default Foo = () => (
            <div className={s.fooBar}>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snakeCased}></div>
              <div className={s.fooBaz}></div>
            </div>
          );
        `,
        options: [{ camelCase: true }],
        errors: ["Class or exported property 'fooBaz' not found"],
      },
      {
        name: 'Add support for all variants of the camelCase options.',
        code: `
          import s from './noUndefClass3.scss';

          export default Foo = () => (
            <div className={s['foo-bar']}>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snake_cased}></div>
              <div className={s['foo-baz']}></div>
            </div>
          );
        `,
        options: [{ camelCase: true }],
        errors: ["Class or exported property 'foo-baz' not found"],
      },
      {
        name: 'should detect if camel case properties are NOT defined when camelCase=dashes',
        code: `
          import s from './noUndefClass3.scss';

          export default Foo = () => (
            <div>
              <div className={s.fooBar}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snakeCased}></div>
              <div className={s.fooBaz}></div>

              <div className={s['foo-bar']}></div>
              <div className={s['already-camel-cased']}></div>
              <div className={s.snake_cased}></div>
              <div className={s['foo-baz']}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'dashes' }],
        errors: [
          "Class or exported property 'snakeCased' not found",
          "Class or exported property 'fooBaz' not found",
          "Class or exported property 'already-camel-cased' not found",
          "Class or exported property 'foo-baz' not found",
        ],
      },
      {
        name: 'should detect if camel case properties are NOT defined when camelCase=only',
        code: `
          import s from './noUndefClass3.scss';

          export default Foo = () => (
            <div>
              <div className={s.fooBar}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snakeCased}></div>
              <div className={s.fooBaz}></div>

              <div className={s['foo-bar']}></div>
              <div className={s['already-camel-cased']}></div>
              <div className={s.snake_cased}></div>
              <div className={s['foo-baz']}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'only' }],
        errors: [
          "Class or exported property 'fooBaz' not found",
          "Class or exported property 'foo-bar' not found",
          "Class or exported property 'already-camel-cased' not found",
          "Class or exported property 'snake_cased' not found",
          "Class or exported property 'foo-baz' not found",
        ],
      },
      {
        name: 'should detect if camel case properties are NOT defined when camelCase=dashes-only',
        code: `
          import s from './noUndefClass3.scss';

          export default Foo = () => (
            <div>
              <div className={s.fooBar}></div>
              <div className={s.alreadyCamelCased}></div>
              <div className={s.snakeCased}></div>
              <div className={s.fooBaz}></div>

              <div className={s['foo-bar']}></div>
              <div className={s['already-camel-cased']}></div>
              <div className={s.snake_cased}></div>
              <div className={s['foo-baz']}></div>
            </div>
          );
        `,
        options: [{ camelCase: 'dashes-only' }],
        errors: [
          "Class or exported property 'snakeCased' not found",
          "Class or exported property 'fooBaz' not found",
          "Class or exported property 'foo-bar' not found",
          "Class or exported property 'already-camel-cased' not found",
          "Class or exported property 'foo-baz' not found",
        ],
      },
    ].map((testCase) => addFilenameOption(testCase)),
  });
});
