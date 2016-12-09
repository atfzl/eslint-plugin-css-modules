import s from './foo.scss';
import util from 'util';
import { get } from 'lodash';

const foo = () => {
  return (
    <div className={get(s.cartInfo, util)}>
      foo
    </div>
  );
};

export default foo;
