/* eslint-env mocha */

import { expect } from 'chai';
import gonzales from 'gonzales-pe';

import { eliminateGlobals } from '../../../lib/core/traversalUtils';

describe('eliminateGlobals()', function () {
  describe('resolving :global pseudo class', function () {
    it('should remove :global operator and the global class', function () {
      const content = `
      :global .global {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal('');
    });

    it('should remove :global operator and the global classes', function () {
      const content = `
      :global .global1 .global2 .global3.global4 {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal('');
    });

    it('should only remove :global operator and the global classes', function () {
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

  describe('resolving :global() pseudo class', function () {
    it('should remove :global() pseudo class and its argument class', function () {
      const content = `
      :global(.global1) {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal('');
    });

    it('should remove :global() pseudo class and its argument classes', function () {
      const content = `
      :global(.global1) :global(.global2, .global3), :global(.global4.global5) {}
      `;

      const ast = gonzales.parse(content, { syntax: 'scss' });

      eliminateGlobals(ast);

      expect(ast.toString().trim()).to.be.equal('');
    });

    it('should only remove :global() pseudo class and its argument classes', function () {
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
