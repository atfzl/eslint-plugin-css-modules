// @flow
/* eslint-disable no-param-reassign */
import fp from 'lodash/fp';

import type { gASTNode } from '../types';

type classMapType = {
  [key: string]: boolean,
}

export const getICSSExportPropsMap = (ast: gASTNode): classMapType => {
  const ruleSets: Array<gASTNode> = [];
  ast.traverseByType('ruleset', node => ruleSets.push(node));

  return fp.compose(
    fp.reduce((result, key) => {
      const prop = fp.compose(fp.nth(0), fp.map('content'))(key);
      result[prop] = prop; // e.g. { myProp: 'myProp' }
      return result;
    }, {}),
    fp.map('content'),
    fp.filter({ type: 'property' }),
    fp.flatMap('content'),
    fp.filter({ type: 'declaration' }),
    fp.flatMap('content'),
    fp.filter({ type: 'block' }),
    fp.flatMap('content'),
    fp.filter({
      content: [{
        type: 'selector',
        content: [{
          type: 'pseudoClass',
          content: [{
            type: 'ident', content: 'export'
          }]
        }]
      }]
    })
  )(ruleSets);
};

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

/**
 * Resolves parent selectors to their full class names.
 *
 * E.g. `.foo { &_bar {color: blue } }` to `.foo_bar`.
 */
export const getParentSelectorClassesMap = (ast: gASTNode): classMapType => {
  const classesMap: classMapType = {};

  // Recursively traverses down the tree looking for parent selector
  // extensions. Recursion is necessary as these selectors can be nested.
  const getExtensions = nodeContent => {
    const blockContent = fp.compose(
      fp.flatMap('content'),
      fp.filter({ type: 'block' })
    )(nodeContent);

    const rulesetsContent = fp.flatMap('content', fp.concat(
      // `ruleset` children
      fp.filter({ type: 'ruleset' }, blockContent),

      // `ruleset` descendants nested in `include` nodes
      fp.compose(
        fp.filter({ type: 'ruleset' }),
        fp.flatMap('content'),
        fp.filter({ type: 'block' }),
        fp.flatMap('content'),
        fp.filter({ type: 'include' })
      )(blockContent)
    ));

    const extensions = fp.compose(
      fp.map('content'),
      fp.filter({ type: 'ident' }),
      fp.flatMap('content'),
      fp.filter({ type: 'parentSelectorExtension' }),
      fp.flatMap('content'),
      fp.filter({ type: 'selector' })
    )(rulesetsContent);

    if (!extensions.length) return [];

    const nestedExtensions = getExtensions(rulesetsContent);
    const result = extensions;
    if (nestedExtensions.length) {
      nestedExtensions.forEach(nestedExt => {
        extensions.forEach(ext => {
          result.push(ext + nestedExt);
        });
      });
    }

    return result;
  };

  ast.traverseByType('ruleset', node => {
    const classNames = fp.compose(
      fp.map('content'),
      fp.filter({ type: 'ident' }),
      fp.flatMap('content'),
      fp.filter({ type: 'class' }),
      fp.flatMap('content'),
      fp.filter({ type: 'selector' })
    )(node.content);

    if (!classNames.length) return;

    const extensions = getExtensions(node.content);
    if (!extensions.length) return;

    classNames.forEach(className => {
      extensions.forEach(ext => {
        classesMap[className + ext] = false;
      });

      // Ignore the base class if it only exists for nesting parent selectors
      const hasDeclarations = fp.compose(
        fp.filter({ type: 'declaration' }),
        fp.flatMap('content'),
        fp.filter({ type: 'block' })
      )(node.content).length > 0;
      if (!hasDeclarations) classesMap[className] = true;
    });
  });

  return classesMap;
};

/**
 * Mutates the AST by removing `:global` instances.
 *
 * For the AST structure:
 * @see https://github.com/css/gonzales/blob/master/doc/AST.CSSP.en.md
 */
export const eliminateGlobals = (ast: gASTNode) => {
  // Remove all :global/:global(...) in selectors
  ast.traverseByType('selector', (selectorNode) => {
    const selectorContent = selectorNode.content;
    let hasGlobalWithNoArgs = false;
    let i = 0;
    let currNode = selectorContent[i];
    while (currNode) {
      if (currNode.is('pseudoClass')) {
        // Remove all :global/:global(...) and trailing space
        const identifierNode = currNode.content[0];
        if (identifierNode && identifierNode.content === 'global') {
          if (currNode.content.length === 1) hasGlobalWithNoArgs = true;
          selectorNode.removeChild(i);
          if (selectorContent[i] && selectorContent[i].is('space')) {
            selectorNode.removeChild(i);
          }
        } else {
          i++;
        }
      } else if (currNode.is('class') && hasGlobalWithNoArgs) {
        // Remove all class after :global and their trailing space
        selectorNode.removeChild(i);
        if (selectorContent[i] && selectorContent[i].is('space')) {
          selectorNode.removeChild(i);
        }
      } else {
        i++;
      }

      currNode = selectorContent[i];
    }
  });

  // Remove all ruleset with no selectors
  ast.traverseByType('ruleset', (node, index, parent) => {
    const rulesetContent = node.content;

    // Remove empty selectors and trailing deliminator and space
    let i = 0;
    let currNode = rulesetContent[i];
    while (currNode) {
      if (currNode.is('selector') && currNode.content.length === 0) {
        node.removeChild(i);
        if (rulesetContent[i].is('delimiter')) node.removeChild(i);
        if (rulesetContent[i].is('space')) node.removeChild(i);
      } else {
        i++;
      }
      currNode = rulesetContent[i];
    }

    // Remove the ruleset if no selectors
    if (rulesetContent.filter((node) => node.is('selector')).length === 0) {
      parent.removeChild(index);
    }
  });
};
