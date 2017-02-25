/* eslint-env mocha */

import { expect } from 'chai';
import gonzales from '../../../lib/core/gonzales';

import { eliminateGlobals } from '../../../lib/core/traversalUtils';

describe('eliminateGlobals()', () => {
  it('should remove :global block', () => {
    const content = `
:global {
  .foo {}
}`;

    const ast = gonzales.parse(
      content,
      { syntax: 'scss' }
    );

    eliminateGlobals(ast);

    expect(ast.toString()).to.be.equal('\n');
  });

  it('should remove :global block, but not local', () => {
    const content = `
.bar {}

:global {
  .foo {}
}`;

    const ast = gonzales.parse(
      content,
      { syntax: 'scss' }
    );

    eliminateGlobals(ast);

    expect(ast.toString()).to.be.equal(
      `
.bar {}

`
    );
  });

  it('should remove nested :global block', () => {
    const content = `
.bar {}

.baz {
  :global {
    .foo {}
  }
}`;

    const ast = gonzales.parse(
      content,
      { syntax: 'scss' }
    );

    eliminateGlobals(ast);

    expect(ast.toString()).to.be.equal(
      `
.bar {}

.baz {
  
}`
    );
  });

  it('should remove :global selector', () => {
    const content = `
.bar {}

:global .baz {}`;

    const ast = gonzales.parse(
      content,
      { syntax: 'scss' }
    );

    eliminateGlobals(ast);

    expect(ast.toString()).to.be.equal(
      `
.bar {}

`
    );
  });

  it('should remove :global selector with multiple classes', () => {
    const content = `
.bar {}

:global .baz.foo {}`;

    const ast = gonzales.parse(
      content,
      { syntax: 'scss' }
    );

    eliminateGlobals(ast);

    expect(ast.toString()).to.be.equal(
      `
.bar {}

`
    );
  });

  it('should remove classes wrapped in :global()', () => {
    const content = `
.bar {}

:global(.bar.foo) {}`;

    const ast = gonzales.parse(
      content,
      { syntax: 'scss' }
    );

    eliminateGlobals(ast);

    expect(ast.toString()).to.be.equal(
      `
.bar {}

`
    );
  });
});
