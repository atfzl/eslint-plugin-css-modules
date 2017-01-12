/* eslint css-modules/no-unused-class: [2, { markAsUsed: ['container'] }] */

import s from './foo.scss';

const component = () => {
  const cls = s['containr'];

  s._getCss();

  return (
    <div className={`${s.foo}`}>
      text
      <div className={`${cls} ${s.button}`}>
      </div>
      <div className={s.footer}>
        Footer
      </div>
    </div>
  );
};

export default component;
