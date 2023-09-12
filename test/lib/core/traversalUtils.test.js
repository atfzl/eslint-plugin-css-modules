/* eslint-env mocha */

import { expect } from 'chai';
import gonzales from '../../../lib/core/gonzales';

import { eliminateGlobals } from '../../../lib/core/traversalUtils';

describe('eliminateGlobals()', () => {
  describe('resolving :global pseudo class', () => {
    it('should remove :global operator and the global class', () => {
      const content = `
      :global .global {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal('');
    });

    it('should remove :global operator and the global classes', () => {
      const content = `
      :global .global1 .global2 .global3.global4 {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal('');
    });

    it('should only remove :global operator and the global classes', () => {
      const content = `
      .local1 :global .global1 :local(.local2) .global2 :local(.local3), .local4 {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal(
        '.local1 :local(.local2) :local(.local3), .local4 {}'
      );
    });
  });

  describe('resolving :global() pseudo class', () => {
    it('should remove :global() pseudo class and its argument class', () => {
      const content = `
      :global(.global1) {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal('');
    });

    it('should remove :global() pseudo class and its argument classes', () => {
      const content = `
      :global(.global1) :global(.global2, .global3), :global(.global4.global5) {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal('');
    });

    it('should only remove :global() pseudo class and its argument classes', () => {
      const content = `
      .local1 :global(.global1) .local2, .local3 :global(.global2, .global3) :local(.local4) {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal(
        '.local1 .local2, .local3 :local(.local4) {}'
      );
    });
  });
});
