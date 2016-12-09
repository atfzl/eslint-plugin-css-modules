import s from './foo.scss';

const component = () => {
  const cls = s.container;

  return (
    <div className={`${s.foo}`}>
      text
      <div className={cls}>
      </div>
    </div>
  );
};

export default component;
