import { RuleTester } from 'eslint';
import mocha from 'mocha';

import rule from '../../../lib/rules/no-unused-class';

import { addFilenameOption } from '../../utils';

RuleTester.describe = function (text, method) {
  RuleTester.it.title = text;
  return method.call(this);
};

RuleTester.it = function (text, method) {
  mocha.test(RuleTester.it.title + ': ' + text, method);
};

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run('no-unused-class', rule, {
  valid: [
    addFilenameOption({
      name: "absolute import eg: 'foo/bar.scss'",
      code: `
        import s from 'test/files/noUndefClass1.scss';

        export default Foo = () => (
          <div className={s.container}></div>
        );
      `,
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
      name: 'ignore global scope selector',
      code: `
        import s from './noUnusedClass2.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <span className="bar"></span>
          </div>
        );
      `,
    }),
    addFilenameOption({
      name: 'ignore props exported by ICSS :export pseudo-selector https://github.com/css-modules/icss#export',
      code: `
        import s from './export1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
    }),
    addFilenameOption({
      name: 'check if composes classes are ignored',
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    addFilenameOption({
      name: 'composes with multiple classes',
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    addFilenameOption({
      name: 'check if @extend classes are ignored',
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
  ],
  invalid: [
    addFilenameOption({
      name: 'Unused class error',
      code: `
        import s from './noUnusedClass1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
      errors: ['Unused classes found in noUnusedClass1.scss: foo, bold'],
    }),
    addFilenameOption({
      name: 'ignored global scope selector class',
      code: `
        import s from './noUnusedClass2.scss';

        export default Foo = () => (
          <div>
          </div>
        );
      `,
      errors: ['Unused classes found in noUnusedClass2.scss: foo'],
    }),
    addFilenameOption({
      name: 'check less support',
      code: `
        import s from './noUnusedClass1.less';

        export default Foo = () => (
          <div>
          </div>
        );
      `,
      errors: ['Unused classes found in noUnusedClass1.less: foo'],
    }),
    addFilenameOption({
      name: 'check composes support',
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
      errors: ['Unused classes found in composes1.scss: baz'],
    }),
    addFilenameOption({
      name: 'check multiple composes support',
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
      errors: ['Unused classes found in composesMultiple1.scss: baz'],
    }),
    addFilenameOption({
      name: 'check @extend support',
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}></div>
        );
      `,
      errors: ['Unused classes found in extend1.scss: baz'],
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
      name: 'snake_case',
      code: `
        import s from './parentSelector8.scss';

        export default Foo = () => (
          <div className={s.foo} />
        );
      `,
      errors: ['Unused classes found in parentSelector8.scss: foo_bar'],
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
    addFilenameOption({
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
    }),
  ],
});
