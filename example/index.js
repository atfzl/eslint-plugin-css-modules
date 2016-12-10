import s from './foo.scss';
import cx from 'classnames';

const component = () => {
  const cls = s['containr'];

  const x = s._getCss();

  return (
    <div className={`${s.foo}`}>
      text
      <div className={cx(cls, s.button)}>
      </div>
      <div className={s.footer}>
        Footer
      </div>
    </div>
  );
};

export default component;
