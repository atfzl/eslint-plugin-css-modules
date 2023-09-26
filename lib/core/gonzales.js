import gonzales from 'gonzales-pe';

/**
 * A wrapper to prevent failure on parsing error.
 */
export default {
  parse: (...args) => {
    try {
      return gonzales.parse(...args);
    } catch (e) {
      return null;
    }
  },
};
