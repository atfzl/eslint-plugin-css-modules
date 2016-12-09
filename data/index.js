import s from './foo.scss';
import m from './bar.css';

const foo = () => {
  const cls = s.foo || m.bar;

  return (
    <div className={`${s.cartInfo} ${cls}`}>
      foo
    </div>
  );
};

export default foo;
