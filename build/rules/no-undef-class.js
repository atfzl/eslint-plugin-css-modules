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
      description: 'Checks that you are using the existent css/scss classes, no more no less',
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
             by css modules like _.getCss()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9ydWxlcy9uby11bmRlZi1jbGFzcy5qcyJdLCJuYW1lcyI6WyJtZXRhIiwiZG9jcyIsImRlc2NyaXB0aW9uIiwicmVjb21tZW5kZWQiLCJjcmVhdGUiLCJjb250ZXh0IiwiZGlyTmFtZSIsImRpcm5hbWUiLCJnZXRGaWxlbmFtZSIsIm1hcCIsIkltcG9ydERlY2xhcmF0aW9uIiwibm9kZSIsInN0eWxlSW1wb3J0Tm9kZURhdGEiLCJpbXBvcnROYW1lIiwic3R5bGVGaWxlUGF0aCIsImltcG9ydE5vZGUiLCJzdHlsZUZpbGVBYnNvbHV0ZVBhdGgiLCJyZXNvbHZlIiwiY2xhc3NOYW1lc01hcCIsInNldCIsIk1lbWJlckV4cHJlc3Npb24iLCJvYmplY3ROYW1lIiwib2JqZWN0IiwibmFtZSIsInByb3BlcnR5TmFtZSIsInN0YXJ0c1dpdGgiLCJhdmFpbGFibGVDbGFzc2VzIiwiZ2V0IiwiaGFzT3duUHJvcGVydHkiLCJyZXBvcnQiLCJwcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O2tCQVFlO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSwwRUFEVDtBQUVKQyxtQkFBYTtBQUZUO0FBREYsR0FETztBQU9iQyxRQVBhLGtCQU9MQyxPQVBLLEVBT1k7QUFDdkIsUUFBTUMsVUFBVSxlQUFLQyxPQUFMLENBQWFGLFFBQVFHLFdBQVIsRUFBYixDQUFoQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFhQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUM0QjtBQUMvQixZQUFNQyxzQkFBc0Isa0NBQXVCRCxJQUF2QixDQUE1Qjs7QUFFQSxZQUFJLENBQUNDLG1CQUFMLEVBQTBCO0FBQ3hCO0FBQ0Q7O0FBTDhCLFlBUTdCQyxVQVI2QixHQVczQkQsbUJBWDJCLENBUTdCQyxVQVI2QjtBQUFBLFlBUzdCQyxhQVQ2QixHQVczQkYsbUJBWDJCLENBUzdCRSxhQVQ2QjtBQUFBLFlBVTdCQyxVQVY2QixHQVczQkgsbUJBWDJCLENBVTdCRyxVQVY2Qjs7O0FBYS9CLFlBQU1DLHdCQUF3QixlQUFLQyxPQUFMLENBQWFYLE9BQWIsRUFBc0JRLGFBQXRCLENBQTlCOztBQUVBOzs7QUFHQSxZQUFNSSxnQkFBZ0IsMkJBQWdCRixxQkFBaEIsQ0FBdEI7O0FBRUE7QUFDQSx5QkFBRUcsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsZUFBb0NLLGFBQXBDOztBQUVBO0FBQ0EseUJBQUVDLEdBQUYsQ0FBTVYsR0FBTixFQUFjSSxVQUFkLFlBQWlDRSxVQUFqQztBQUNELE9BMUJJOztBQTJCTEssd0JBQWtCLDBCQUFDVCxJQUFELEVBQWtCO0FBQ2xDOzs7O0FBSUEsWUFBTVUsYUFBYVYsS0FBS1csTUFBTCxDQUFZQyxJQUEvQjs7QUFFQSxZQUFNQyxlQUFlLDJCQUFnQmIsSUFBaEIsQ0FBckI7O0FBRUEsWUFBSSxDQUFDYSxZQUFELElBQWlCLGlCQUFFQyxVQUFGLENBQWFELFlBQWIsRUFBMkIsR0FBM0IsQ0FBckIsRUFBc0Q7QUFDcEQ7Ozs7Ozs7O0FBU0E7QUFDRDs7QUFFRCxZQUFNRSxtQkFBbUIsaUJBQUVDLEdBQUYsQ0FBTWxCLEdBQU4sRUFBY1ksVUFBZCxjQUF6Qjs7QUFFQSxZQUFJSyxvQkFBb0IsQ0FBQ0EsaUJBQWlCRSxjQUFqQixDQUFnQ0osWUFBaEMsQ0FBekIsRUFBd0U7QUFDdEVuQixrQkFBUXdCLE1BQVIsQ0FBZWxCLEtBQUttQixRQUFwQixlQUF3Q04sWUFBeEM7QUFDRDtBQUNGO0FBdERJLEtBQVA7QUF3REQ7QUFqRlksQyIsImZpbGUiOiJuby11bmRlZi1jbGFzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGdldFN0eWxlSW1wb3J0Tm9kZURhdGEsXG4gIGdldFN0eWxlQ2xhc3NlcyxcbiAgZ2V0UHJvcGVydHlOYW1lLFxufSBmcm9tICcuLi9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBKc05vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2hlY2tzIHRoYXQgeW91IGFyZSB1c2luZyB0aGUgZXhpc3RlbnQgY3NzL3Njc3MgY2xhc3Nlcywgbm8gbW9yZSBubyBsZXNzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH1cbiAgfSxcbiAgY3JlYXRlIChjb250ZXh0OiBPYmplY3QpIHtcbiAgICBjb25zdCBkaXJOYW1lID0gcGF0aC5kaXJuYW1lKGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG5cbiAgICAvKlxuICAgICAgIG1hcHMgdmFyaWFibGUgbmFtZSB0byBwcm9wZXJ0eSBPYmplY3RcbiAgICAgICBtYXAgPSB7IFt2YXJpYWJsZU5hbWVdOiB7IGNsYXNzZXM6IHsgZm9vOiB0cnVlIH0sIG5vZGU6IHsuLi59IH1cblxuICAgICAgIGV4YW1wbGU6XG4gICAgICAgaW1wb3J0IHMgZnJvbSAnLi9mb28uc2Nzcyc7XG4gICAgICAgcyBpcyB2YXJpYWJsZSBuYW1lXG5cbiAgICAgICBwcm9wZXJ0eSBPYmplY3QgaGFzIHR3byBrZXlzXG4gICAgICAgMS4gY2xhc3NlczogYW4gb2JqZWN0IHdpdGggY2xhc3NOYW1lIGFzIGtleSBhbmQgYSBib29sZWFuIGFzIHZhbHVlLlxuICAgICAgIFRoZSBib29sZWFuIGlzIG1hcmtlZCBpZiBpdCBpcyB1c2VkIGluIGZpbGVcbiAgICAgICAyLiBub2RlOiBub2RlIHRoYXQgY29ycmVzcG9uZCB0byBzIChzZWUgZXhhbXBsZSBhYm92ZSlcbiAgICAgKi9cbiAgICBjb25zdCBtYXAgPSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbiAobm9kZTogSnNOb2RlKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlSW1wb3J0Tm9kZURhdGEgPSBnZXRTdHlsZUltcG9ydE5vZGVEYXRhKG5vZGUpO1xuXG4gICAgICAgIGlmICghc3R5bGVJbXBvcnROb2RlRGF0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBpbXBvcnROYW1lLFxuICAgICAgICAgIHN0eWxlRmlsZVBhdGgsXG4gICAgICAgICAgaW1wb3J0Tm9kZSxcbiAgICAgICAgfSA9IHN0eWxlSW1wb3J0Tm9kZURhdGE7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVGaWxlQWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpck5hbWUsIHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgIG1hcHMgY2xhc3NOYW1lcyB3aXRoIGEgYm9vbGVhbiB0byBtYXJrIGFzIHVzZWQgaW4gc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjbGFzc05hbWVzTWFwID0gZ2V0U3R5bGVDbGFzc2VzKHN0eWxlRmlsZUFic29sdXRlUGF0aCk7XG5cbiAgICAgICAgLy8gdGhpcyB3aWxsIGJlIHVzZWQgdG8gbWFyayBzLmZvbyBhcyB1c2VkIGluIE1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgXy5zZXQobWFwLCBgJHtpbXBvcnROYW1lfS5jbGFzc2VzYCwgY2xhc3NOYW1lc01hcCk7XG5cbiAgICAgICAgLy8gc2F2ZSBub2RlIGZvciByZXBvcnRpbmcgdW51c2VkIHN0eWxlc1xuICAgICAgICBfLnNldChtYXAsIGAke2ltcG9ydE5hbWV9Lm5vZGVgLCBpbXBvcnROb2RlKTtcbiAgICAgIH0sXG4gICAgICBNZW1iZXJFeHByZXNzaW9uOiAobm9kZTogSnNOb2RlKSA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAgIENoZWNrIGlmIHByb3BlcnR5IGV4aXN0cyBpbiBjc3Mvc2NzcyBmaWxlIGFzIGNsYXNzXG4gICAgICAgICAqL1xuXG4gICAgICAgIGNvbnN0IG9iamVjdE5hbWUgPSBub2RlLm9iamVjdC5uYW1lO1xuXG4gICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGdldFByb3BlcnR5TmFtZShub2RlKTtcblxuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSB8fCBfLnN0YXJ0c1dpdGgocHJvcGVydHlOYW1lLCAnXycpKSB7XG4gICAgICAgICAgLypcbiAgICAgICAgICAgICBza2lwIHByb3BlcnR5IG5hbWVzIHN0YXJ0aW5nIHdpdGggX1xuICAgICAgICAgICAgIGVnLiBzcGVjaWFsIGZ1bmN0aW9ucyBwcm92aWRlZFxuICAgICAgICAgICAgIGJ5IGNzcyBtb2R1bGVzIGxpa2UgXy5nZXRDc3MoKVxuXG4gICAgICAgICAgICAgVHJpZWQgdG8ganVzdCBza2lwIGZ1bmN0aW9uIGNhbGxzLCBidXQgdGhlIHBhcnNlclxuICAgICAgICAgICAgIHRoaW5rcyBvZiBub3JtYWwgcHJvcGVydHkgYWNjZXNzIGxpa2Ugcy5fZ2V0Q3NzIGFuZFxuICAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxzIGxpa2Ugcy5fZ2V0Q3NzKCkgYXMgc2FtZS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdmFpbGFibGVDbGFzc2VzID0gXy5nZXQobWFwLCBgJHtvYmplY3ROYW1lfS5jbGFzc2VzYCk7XG5cbiAgICAgICAgaWYgKGF2YWlsYWJsZUNsYXNzZXMgJiYgIWF2YWlsYWJsZUNsYXNzZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUucHJvcGVydHksIGBDbGFzcyAnJHtwcm9wZXJ0eU5hbWV9JyBub3QgZm91bmRgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=