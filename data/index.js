import s from './foo.scss';
import m from './bar.css';
import _ from 'lodash';

const foo = () => {
  const cls = s.foo || m.bar;

  return (
    <div className={`${s.cartInfo} ${cls}`}>
      foo
    </div>
  );
};

export default foo;
