import { RuleTester } from 'eslint';
import { test } from 'mocha';

import rule from '../../../lib/rules/no-undef-class';

import { addDefaultOptions } from '../../utils';

RuleTester.describe = function (text, method) {
  RuleTester.it.title = text;
  return method.call(this);
};

RuleTester.it = function (text, method) {
  test(RuleTester.it.title + ': ' + text, method);
};

const ruleTester = new RuleTester();

ruleTester.run('no-undef-class', rule, {
  /*
     valid cases
   */
  valid: [
    /*
      absolute import
      eg: 'foo/bar.scss'
    */
    addDefaultOptions({
      code: `
        import s from 'test/files/noUndefClass1.scss';

        export default Foo = () => (
          <div className={s.container}></div>
        );
      `,
    }),
    /*
       dot notation
       eg: s.container
     */
    addDefaultOptions({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div className={s.container}></div>
        );
      `,
    }),
    /*
       square bracket string key
       eg: s['container']
     */
    addDefaultOptions({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div className={s['container']}></div>
        );
      `,
    }),
    /*
       does not check for dynamic properties
       eg: s[dynamicValue]
     */
    addDefaultOptions({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = (props) => (
          <div className={s[props.primary]}></div>
        );
      `,
    }),
    /*
       names starting with _ will be ignored
     */
    addDefaultOptions({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div>
            {s._getCss()}
          </div>
        );
      `,
    }),
    /*
       using composes
     */
    addDefaultOptions({
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}></div>
          </div>
        );
      `,
    }),
    /*
      composing with multiple classes
    */
    addDefaultOptions({
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}></div>
          </div>
        );
      `,
    }),
    /*
       using @extend
     */
    addDefaultOptions({
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}></div>
          </div>
        );
      `,
    }),
    /*
       using parent selector (`&`)
     */
    addDefaultOptions({
      code: `
        import s from './parentSelector1.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.foo_bar}></div>
          </div>
        );
      `,
    }),
    addDefaultOptions({
      code: `
        import s from './parentSelector2.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.bar}></div>
            <div className={s.bar_baz}></div>
          </div>
        );
      `,
    }),
    addDefaultOptions({
      code: `
        import s from './parentSelector3.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.foo_bar}></div>
            <div className={s.foo_baz}></div>
          </div>
        );
      `,
    }),
    addDefaultOptions({
      code: `
        import s from './parentSelector4.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.foo_bar}></div>
            <div className={s.foo_baz}></div>
          </div>
        );
      `,
    }),
    addDefaultOptions({
      code: `
        import s from './parentSelector5.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.foo_baz}></div>
            <div className={s.bar_baz}></div>
          </div>
        );
      `,
    }),
    addDefaultOptions({
      code: `
        import s from './parentSelector6.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.foo_bar}></div>
            <div className={s.foo_bar_baz}></div>
          </div>
        );
      `,
    }),
    addDefaultOptions({
      code: `
        import s from './parentSelector8.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.foo_bar}></div>
          </div>
        );
      `,
    }),
    /*
       file that can't be parsed should not give any error
     */
    addDefaultOptions({
      code: `
        import s from './unparsable.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}></div>
          </div>
        );
      `,
    }),
    /*
       :global is ignored
     */
    addDefaultOptions({
      code: `
        import s from './global1.scss';

        export default Foo = () => (
          <div className={s.local1, s.local2, s.local3, s.local4, s.local5, s.local6}>
          </div>
        );
      `,
    }),
    /*
       ICSS :export pseudo-selector with a correct prop name should not give error
       https://github.com/css-modules/icss#export
     */
    addDefaultOptions({
      code: `
        import s from './export1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.myProp}>
            </div>
          </div>
        );
      `,
    }),
    /*
       check if camelCase=true classes work as expected
     */
    addDefaultOptions({
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
    }),
    addDefaultOptions({
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
    }),
    /*
       check if camelCase=dashes classes work as expected
     */
    addDefaultOptions({
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
    }),
    addDefaultOptions({
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
    }),
    /*
       check if camelCase=only classes work as expected
     */
    addDefaultOptions({
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
    }),
    /*
       check if camelCase=dashes-only classes work as expected
     */
    addDefaultOptions({
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
    }),
  ],
  /*
     invalid cases
   */
  invalid: [
    /*
       dot notation
     */
    addDefaultOptions({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div className={s.containr}></div>
        );
      `,
      errors: ["Class or exported property 'containr' not found"],
    }),
    /*
       square bracket
     */
    addDefaultOptions({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div className={s['containr']}></div>
        );
      `,
      errors: ["Class or exported property 'containr' not found"],
    }),
    /*
       classes with global scope for selector are ignored
       eg. :global(.bold) { font-weight: bold; }
    */
    addDefaultOptions({
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
    }),
    /*
       ICSS :export pseudo-selector with wrong prop name
       https://github.com/css-modules/icss#export
     */
    addDefaultOptions({
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
    }),
    /*
      check less support
    */
    addDefaultOptions({
      code: `
        import s from './noUndefClass1.less';

        export default Foo = () => (
          <div className={s.bold}></div>
        );
      `,
      errors: ["Class or exported property 'bold' not found"],
    }),
    /*
       using composes
     */
    addDefaultOptions({
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.bazz}></div>
          </div>
        );
      `,
      errors: ["Class or exported property 'bazz' not found"],
    }),
    /*
       composing multiple classes
     */
    addDefaultOptions({
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
    }),
    /*
       using @extend
     */
    addDefaultOptions({
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.bazz}></div>
          </div>
        );
      `,
      errors: ["Class or exported property 'bazz' not found"],
    }),
    /*
       using parent selector (`&`)
     */
    addDefaultOptions({
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
    }),
    /*
       should show errors for file that does not exist
     */
    addDefaultOptions({
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
    }),
    /*
       should detect if camel case properties are NOT defined when camelCase=true
     */
    addDefaultOptions({
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
    }),
    addDefaultOptions({
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
    }),
    /*
       should detect if camel case properties are NOT defined when camelCase=dashes
     */
    addDefaultOptions({
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
    }),
    /*
       should detect if camel case properties are NOT defined when camelCase=only
     */
    addDefaultOptions({
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
    }),
    /*
       should detect if camel case properties are NOT defined when camelCase=dashes-only
     */
    addDefaultOptions({
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
    }),
  ],
});