import { RuleTester } from 'eslint';

import rule from '../../../lib/rules/no-undef-class';

import { test } from '../../utils';

const ruleTester = new RuleTester();

ruleTester.run('no-undef-class', rule, {
  /*
     valid cases
   */
  valid: [
    /*
       dot notation
       eg: s.container
     */
    test({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div className={s.container}>
          </div>
        );
      `,
    }),
    /*
       square bracket string key
       eg: s['container']
     */
    test({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div className={s['container']}>
          </div>
        );
      `,
    }),
    /*
       does not check for dynamic properties
       eg: s[dynamicValue]
     */
    test({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = (props) => (
          <div className={s[props.primary]}>
          </div>
        );
      `,
    }),
    /*
       names starting with _ will be ignored
     */
    test({
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
    test({
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}>
            </div>
          </div>
        );
      `,
    }),
    /*
      composing with multiple classes
    */
    test({
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}>
            </div>
          </div>
        );
      `,
    }),
    /*
       using @extend
     */
    test({
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}>
            </div>
          </div>
        );
      `,
    }),
    /*
       file that can't be parsed should not give any error
     */
    test({
      code: `
        import s from './unparsable.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}>
            </div>
          </div>
        );
      `,
    }),
    /*
       :global is ignored
     */
    test({
      code: `
        import s from './global1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}>
              <div className={s.foo}></div>
            </div>
          </div>
        );
      `
    }),
    /*
       use gonzales-primitive when gonzales fails to parse
     */
    test({
      code: `
        import s from './gonzalesFail1.css';

        export default Foo = () => (
           <div className={s.foo}></div>
        );
      `
    }),
  ],
  /*
     invalid cases
   */
  invalid: [
    /*
       dot notation
     */
    test({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div className={s.containr}>
          </div>
        );
      `,
      errors: [
        'Class \'containr\' not found'
      ]
    }),
    /*
       square bracket
     */
    test({
      code: `
        import s from './noUndefClass1.scss';

        export default Foo = () => (
          <div className={s['containr']}>
          </div>
        );
      `,
      errors: [
        'Class \'containr\' not found',
      ],
    }),
    /*
       classes with global scope for selector are ignored
       eg. :global(.bold) { font-weight: bold; }
    */
    test({
      code: `
        import s from './noUndefClass2.scss';

        export default Foo = () => (
          <div className={s.bold}>
          </div>
        );
      `,
      errors: [
        'Class \'bold\' not found',
      ],
    }),
    /*
      check less support
    */
    test({
      code: `
        import s from './noUndefClass1.less';

        export default Foo = () => (
          <div className={s.bold}>
          </div>
        );
      `,
      errors: [
        'Class \'bold\' not found',
      ],
    }),
    /*
       using composes
     */
    test({
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.bazz}>
            </div>
          </div>
        );
      `,
      errors: [
        'Class \'bazz\' not found',
      ],
    }),
    /*
       composing multiple classes
     */
    test({
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.bazz} />
            <div className={s.foo} />
          </div>
        );
      `,
      errors: [
        'Class \'bazz\' not found',
      ],
    }),
    /*
       using @extend
     */
    test({
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.bazz}>
            </div>
          </div>
        );
      `,
      errors: [
        'Class \'bazz\' not found',
      ],
    }),
    /*
       should show errors for file that does not exist
     */
    test({
      code: `
        import s from './fileThatDoesNotExist.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <div className={s.baz}>
            </div>
          </div>
        );
      `,
      errors: [
        'Class \'bar\' not found',
        'Class \'baz\' not found',
      ],
    }),
  ],
});
