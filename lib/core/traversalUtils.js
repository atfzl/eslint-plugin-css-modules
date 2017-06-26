// @flow
/* eslint-disable no-param-reassign */
import fp from 'lodash/fp';

import type { gASTNode } from '../types';

type classMapType = {
  [key: string]: boolean,
}

export const getRegularClassesMap = (ast: gASTNode): classMapType => {
  const ruleSets: Array<gASTNode> = [];
  ast.traverseByType('ruleset', node => ruleSets.push(node));

  return fp.compose(
    fp.reduce((result, key) => {
      result[key] = false; // classes haven't been used
      return result;
    }, {}),
    fp.map('content'),
    fp.filter({ type: 'ident' }),
    fp.flatMap('content'),
    fp.filter({ type: 'class' }),
    fp.flatMap('content'),
    fp.filter({ type: 'selector' }),
    fp.flatMap('content'),
  )(ruleSets);
};

export const getComposesClassesMap = (ast: gASTNode): classMapType => {
  const declarations = [];
  ast.traverseByType('declaration', node => declarations.push(node));

  return fp.compose(
    fp.reduce((result, key) => {
      result[key] = true; // mark composed classes as true
      return result;
    }, {}),
    fp.flatMap(fp.compose(
      fp.map(fp.get('content')),
      fp.filter({ type: 'ident' }),
      fp.get('content'),
      fp.find({ type: 'value' }),
      fp.get('content'),
    )),
    /*
       reject classes composing from other files
       eg.
       .foo {
       composes: .bar from './otherFile';
       }
     */
    fp.reject(fp.compose(
      fp.find({ type: 'ident', content: 'from' }),
      fp.get('content'),
      fp.find({ type: 'value' }),
      fp.get('content'),
    )),
    fp.filter(fp.compose(
      fp.find({ type: 'ident', content: 'composes' }),
      fp.get('content'),
      fp.find({ type: 'property' }),
      fp.get('content'),
    )),
  )(declarations);
};

export const getExtendClassesMap = (ast: gASTNode): classMapType => {
  const extendNodes = [];
  ast.traverseByType('extend', node => extendNodes.push(node));

  return fp.compose(
    fp.reduce((result, key) => {
      result[key] = true; // mark extend classes as true
      return result;
    }, {}),
    fp.map(fp.compose(
      fp.get('content'),
      fp.find({ type: 'ident' }),
      fp.get('content'),
      fp.find({ type: 'class' }),
      fp.get('content'),
      fp.find({ type: 'selector' }),
      fp.get('content'),
    )),
  )(extendNodes);
};

/*
   mutates ast by removing instances of :global
 */
export const eliminateGlobals = (ast: gASTNode) => {
  ast.traverse((node, index, parent) => {
    if (node.type === 'ruleset') {
      if (
        fp.compose(
          fp.negate(fp.isEmpty),
          fp.find({ type: 'ident', content: 'global' }),
          fp.get('content'),
          fp.find({ type: 'pseudoClass' }),
          fp.get('content'),
          fp.find({ type: 'selector' }),
          fp.get('content'),
        )(node)
      ) {
        parent.removeChild(index);
      }
    }
  });
};
