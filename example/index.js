import s from './foo.scss';

const component = () => {
  const cls = s['containr'];

  const x = s._getCss();

  return (
    <div className={`${s.foo}`}>
      text
      <div className={cls}>
      </div>
      <div className={s.footer}>
        Footer
      </div>
    </div>
  );
};

export default component;
