export rules from './rules';

export const configs = {
  recommended: {
    plugins: ['css-modules'],
    rules: {
      'css-modules/no-unused-class': 2, // error
      'css-modules/no-undef-class': 2,  // error
    }
  }
};
