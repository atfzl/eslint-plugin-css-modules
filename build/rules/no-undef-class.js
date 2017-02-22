'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _core = require('../core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  meta: {
    docs: {
      description: 'Checks that you are using the existent css/scss/less classes, no more no less',
      recommended: true
    }
  },
  create: function create(context) {
    var dirName = _path2.default.dirname(context.getFilename());

    /*
       maps variable name to property Object
       map = { [variableName]: { classes: { foo: true }, node: {...} }
        example:
       import s from './foo.scss';
       s is variable name
        property Object has two keys
       1. classes: an object with className as key and a boolean as value.
       The boolean is marked if it is used in file
       2. node: node that correspond to s (see example above)
     */
    var map = {};

    return {
      ImportDeclaration: function ImportDeclaration(node) {
        var styleImportNodeData = (0, _core.getStyleImportNodeData)(node);

        if (!styleImportNodeData) {
          return;
        }

        var importName = styleImportNodeData.importName,
            styleFilePath = styleImportNodeData.styleFilePath,
            importNode = styleImportNodeData.importNode;


        var styleFileAbsolutePath = _path2.default.resolve(dirName, styleFilePath);

        /*
           maps classNames with a boolean to mark as used in source
         */
        var classNamesMap = (0, _core.getStyleClasses)(styleFileAbsolutePath);

        // this will be used to mark s.foo as used in MemberExpression
        _lodash2.default.set(map, importName + '.classes', classNamesMap);

        // save node for reporting unused styles
        _lodash2.default.set(map, importName + '.node', importNode);
      },

      MemberExpression: function MemberExpression(node) {
        /*
           Check if property exists in css/scss file as class
         */

        var objectName = node.object.name;

        var propertyName = (0, _core.getPropertyName)(node);

        if (!propertyName || _lodash2.default.startsWith(propertyName, '_')) {
          /*
             skip property names starting with _
             eg. special functions provided
             by css modules like _getCss()
              Tried to just skip function calls, but the parser
             thinks of normal property access like s._getCss and
             function calls like s._getCss() as same.
           */
          return;
        }

        var availableClasses = _lodash2.default.get(map, objectName + '.classes');

        if (availableClasses && !availableClasses.hasOwnProperty(propertyName)) {
          context.report(node.property, 'Class \'' + propertyName + '\' not found');
        }
      }
    };
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9ydWxlcy9uby11bmRlZi1jbGFzcy5qcyJdLCJuYW1lcyI6WyJtZXRhIiwiZG9jcyIsImRlc2NyaXB0aW9uIiwicmVjb21tZW5kZWQiLCJjcmVhdGUiLCJjb250ZXh0IiwiZGlyTmFtZSIsImRpcm5hbWUiLCJnZXRGaWxlbmFtZSIsIm1hcCIsIkltcG9ydERlY2xhcmF0aW9uIiwibm9kZSIsInN0eWxlSW1wb3J0Tm9kZURhdGEiLCJpbXBvcnROYW1lIiwic3R5bGVGaWxlUGF0aCIsImltcG9ydE5vZGUiLCJzdHlsZUZpbGVBYnNvbHV0ZVBhdGgiLCJyZXNvbHZlIiwiY2xhc3NOYW1lc01hcCIsInNldCIsIk1lbWJlckV4cHJlc3Npb24iLCJvYmplY3ROYW1lIiwib2JqZWN0IiwibmFtZSIsInByb3BlcnR5TmFtZSIsInN0YXJ0c1dpdGgiLCJhdmFpbGFibGVDbGFzc2VzIiwiZ2V0IiwiaGFzT3duUHJvcGVydHkiLCJyZXBvcnQiLCJwcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O2tCQVFlO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSwrRUFEVDtBQUVKQyxtQkFBYTtBQUZUO0FBREYsR0FETztBQU9iQyxRQVBhLGtCQU9MQyxPQVBLLEVBT1k7QUFDdkIsUUFBTUMsVUFBVSxlQUFLQyxPQUFMLENBQWFGLFFBQVFHLFdBQVIsRUFBYixDQUFoQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFhQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUM0QjtBQUMvQixZQUFNQyxzQkFBc0Isa0NBQXVCRCxJQUF2QixDQUE1Qjs7QUFFQSxZQUFJLENBQUNDLG1CQUFMLEVBQTBCO0FBQ3hCO0FBQ0Q7O0FBTDhCLFlBUTdCQyxVQVI2QixHQVczQkQsbUJBWDJCLENBUTdCQyxVQVI2QjtBQUFBLFlBUzdCQyxhQVQ2QixHQVczQkYsbUJBWDJCLENBUzdCRSxhQVQ2QjtBQUFBLFlBVTdCQyxVQVY2QixHQVczQkgsbUJBWDJCLENBVTdCRyxVQVY2Qjs7O0FBYS9CLFlBQU1DLHdCQUF3QixlQUFLQyxPQUFMLENBQWFYLE9BQWIsRUFBc0JRLGFBQXRCLENBQTlCOztBQUVBOzs7QUFHQSxZQUFNSSxnQkFBZ0IsMkJBQWdCRixxQkFBaEIsQ0FBdEI7O0FBRUE7QUFDQSx5QkFBRUcsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsZUFBb0NLLGFBQXBDOztBQUVBO0FBQ0EseUJBQUVDLEdBQUYsQ0FBTVYsR0FBTixFQUFjSSxVQUFkLFlBQWlDRSxVQUFqQztBQUNELE9BMUJJOztBQTJCTEssd0JBQWtCLDBCQUFDVCxJQUFELEVBQWtCO0FBQ2xDOzs7O0FBSUEsWUFBTVUsYUFBYVYsS0FBS1csTUFBTCxDQUFZQyxJQUEvQjs7QUFFQSxZQUFNQyxlQUFlLDJCQUFnQmIsSUFBaEIsQ0FBckI7O0FBRUEsWUFBSSxDQUFDYSxZQUFELElBQWlCLGlCQUFFQyxVQUFGLENBQWFELFlBQWIsRUFBMkIsR0FBM0IsQ0FBckIsRUFBc0Q7QUFDcEQ7Ozs7Ozs7O0FBU0E7QUFDRDs7QUFFRCxZQUFNRSxtQkFBbUIsaUJBQUVDLEdBQUYsQ0FBTWxCLEdBQU4sRUFBY1ksVUFBZCxjQUF6Qjs7QUFFQSxZQUFJSyxvQkFBb0IsQ0FBQ0EsaUJBQWlCRSxjQUFqQixDQUFnQ0osWUFBaEMsQ0FBekIsRUFBd0U7QUFDdEVuQixrQkFBUXdCLE1BQVIsQ0FBZWxCLEtBQUttQixRQUFwQixlQUF3Q04sWUFBeEM7QUFDRDtBQUNGO0FBdERJLEtBQVA7QUF3REQ7QUFqRlksQyIsImZpbGUiOiJuby11bmRlZi1jbGFzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGdldFN0eWxlSW1wb3J0Tm9kZURhdGEsXG4gIGdldFN0eWxlQ2xhc3NlcyxcbiAgZ2V0UHJvcGVydHlOYW1lLFxufSBmcm9tICcuLi9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBKc05vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2hlY2tzIHRoYXQgeW91IGFyZSB1c2luZyB0aGUgZXhpc3RlbnQgY3NzL3Njc3MvbGVzcyBjbGFzc2VzLCBubyBtb3JlIG5vIGxlc3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgfVxuICB9LFxuICBjcmVhdGUgKGNvbnRleHQ6IE9iamVjdCkge1xuICAgIGNvbnN0IGRpck5hbWUgPSBwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRGaWxlbmFtZSgpKTtcblxuICAgIC8qXG4gICAgICAgbWFwcyB2YXJpYWJsZSBuYW1lIHRvIHByb3BlcnR5IE9iamVjdFxuICAgICAgIG1hcCA9IHsgW3ZhcmlhYmxlTmFtZV06IHsgY2xhc3NlczogeyBmb286IHRydWUgfSwgbm9kZTogey4uLn0gfVxuXG4gICAgICAgZXhhbXBsZTpcbiAgICAgICBpbXBvcnQgcyBmcm9tICcuL2Zvby5zY3NzJztcbiAgICAgICBzIGlzIHZhcmlhYmxlIG5hbWVcblxuICAgICAgIHByb3BlcnR5IE9iamVjdCBoYXMgdHdvIGtleXNcbiAgICAgICAxLiBjbGFzc2VzOiBhbiBvYmplY3Qgd2l0aCBjbGFzc05hbWUgYXMga2V5IGFuZCBhIGJvb2xlYW4gYXMgdmFsdWUuXG4gICAgICAgVGhlIGJvb2xlYW4gaXMgbWFya2VkIGlmIGl0IGlzIHVzZWQgaW4gZmlsZVxuICAgICAgIDIuIG5vZGU6IG5vZGUgdGhhdCBjb3JyZXNwb25kIHRvIHMgKHNlZSBleGFtcGxlIGFib3ZlKVxuICAgICAqL1xuICAgIGNvbnN0IG1hcCA9IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uIChub2RlOiBKc05vZGUpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVJbXBvcnROb2RlRGF0YSA9IGdldFN0eWxlSW1wb3J0Tm9kZURhdGEobm9kZSk7XG5cbiAgICAgICAgaWYgKCFzdHlsZUltcG9ydE5vZGVEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGltcG9ydE5hbWUsXG4gICAgICAgICAgc3R5bGVGaWxlUGF0aCxcbiAgICAgICAgICBpbXBvcnROb2RlLFxuICAgICAgICB9ID0gc3R5bGVJbXBvcnROb2RlRGF0YTtcblxuICAgICAgICBjb25zdCBzdHlsZUZpbGVBYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUoZGlyTmFtZSwgc3R5bGVGaWxlUGF0aCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgbWFwcyBjbGFzc05hbWVzIHdpdGggYSBib29sZWFuIHRvIG1hcmsgYXMgdXNlZCBpbiBzb3VyY2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZXNNYXAgPSBnZXRTdHlsZUNsYXNzZXMoc3R5bGVGaWxlQWJzb2x1dGVQYXRoKTtcblxuICAgICAgICAvLyB0aGlzIHdpbGwgYmUgdXNlZCB0byBtYXJrIHMuZm9vIGFzIHVzZWQgaW4gTWVtYmVyRXhwcmVzc2lvblxuICAgICAgICBfLnNldChtYXAsIGAke2ltcG9ydE5hbWV9LmNsYXNzZXNgLCBjbGFzc05hbWVzTWFwKTtcblxuICAgICAgICAvLyBzYXZlIG5vZGUgZm9yIHJlcG9ydGluZyB1bnVzZWQgc3R5bGVzXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7aW1wb3J0TmFtZX0ubm9kZWAsIGltcG9ydE5vZGUpO1xuICAgICAgfSxcbiAgICAgIE1lbWJlckV4cHJlc3Npb246IChub2RlOiBKc05vZGUpID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgcHJvcGVydHkgZXhpc3RzIGluIGNzcy9zY3NzIGZpbGUgYXMgY2xhc3NcbiAgICAgICAgICovXG5cbiAgICAgICAgY29uc3Qgb2JqZWN0TmFtZSA9IG5vZGUub2JqZWN0Lm5hbWU7XG5cbiAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gZ2V0UHJvcGVydHlOYW1lKG5vZGUpO1xuXG4gICAgICAgIGlmICghcHJvcGVydHlOYW1lIHx8IF8uc3RhcnRzV2l0aChwcm9wZXJ0eU5hbWUsICdfJykpIHtcbiAgICAgICAgICAvKlxuICAgICAgICAgICAgIHNraXAgcHJvcGVydHkgbmFtZXMgc3RhcnRpbmcgd2l0aCBfXG4gICAgICAgICAgICAgZWcuIHNwZWNpYWwgZnVuY3Rpb25zIHByb3ZpZGVkXG4gICAgICAgICAgICAgYnkgY3NzIG1vZHVsZXMgbGlrZSBfZ2V0Q3NzKClcblxuICAgICAgICAgICAgIFRyaWVkIHRvIGp1c3Qgc2tpcCBmdW5jdGlvbiBjYWxscywgYnV0IHRoZSBwYXJzZXJcbiAgICAgICAgICAgICB0aGlua3Mgb2Ygbm9ybWFsIHByb3BlcnR5IGFjY2VzcyBsaWtlIHMuX2dldENzcyBhbmRcbiAgICAgICAgICAgICBmdW5jdGlvbiBjYWxscyBsaWtlIHMuX2dldENzcygpIGFzIHNhbWUuXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQ2xhc3NlcyA9IF8uZ2V0KG1hcCwgYCR7b2JqZWN0TmFtZX0uY2xhc3Nlc2ApO1xuXG4gICAgICAgIGlmIChhdmFpbGFibGVDbGFzc2VzICYmICFhdmFpbGFibGVDbGFzc2VzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLnByb3BlcnR5LCBgQ2xhc3MgJyR7cHJvcGVydHlOYW1lfScgbm90IGZvdW5kYCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19