/* @flow */
import thematic from 'sass-thematic';
import path from 'path';
import util from 'util';
import fp from 'lodash/fp';
import Debug from 'debug';

const debug = Debug('import-style');

const ast = thematic.parseASTSync({
  file: path.resolve(__dirname, '../data/foo.scss')
});

type NodeType = {
  type: string,
  content: Array<NodeType> | string,
  syntax: string,
  start: {
    line: number,
    column: number,
  },
  end: {
    line: number,
    column: number,
  },
};

const getStyleClasses = (Node: NodeType): Array<string> => {
  const classes: Array<NodeType> = [];

  traverse(ast);

  function traverse (Node: NodeType) {
    if (!Array.isArray(Node.content)) {
      return;
    }

    if (Node.type === 'class') {
      classes.push(Node);
      return;
    }

    for (let i = 0; i < Node.content.length; ++i) {
      traverse(Node.content[i]);
    }
  }

  const getClassNames = fp.compose(
    fp.flatMap('content'),
    fp.filter({ type: 'ident' }),
    fp.flatMap('content'),
  );

  debug(util.inspect(classes, {}, null));

  return getClassNames(classes);
};

const classes = getStyleClasses(ast);

console.log(classes);
