'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _core = require('../../core');

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

        var propertyName = node.property.name || // dot notation, s.header
        node.property.value; // square braces s['header']

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bmRlZi1jbGFzcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtZXRhIiwiZG9jcyIsImRlc2NyaXB0aW9uIiwicmVjb21tZW5kZWQiLCJjcmVhdGUiLCJjb250ZXh0IiwiZGlyTmFtZSIsImRpcm5hbWUiLCJnZXRGaWxlbmFtZSIsIm1hcCIsIkltcG9ydERlY2xhcmF0aW9uIiwibm9kZSIsInN0eWxlSW1wb3J0Tm9kZURhdGEiLCJpbXBvcnROYW1lIiwic3R5bGVGaWxlUGF0aCIsImltcG9ydE5vZGUiLCJzdHlsZUZpbGVBYnNvbHV0ZVBhdGgiLCJyZXNvbHZlIiwiY2xhc3NOYW1lc01hcCIsInNldCIsIk1lbWJlckV4cHJlc3Npb24iLCJvYmplY3ROYW1lIiwib2JqZWN0IiwibmFtZSIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5IiwidmFsdWUiLCJzdGFydHNXaXRoIiwiYXZhaWxhYmxlQ2xhc3NlcyIsImdldCIsImhhc093blByb3BlcnR5IiwicmVwb3J0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7a0JBT2U7QUFDYkEsUUFBTTtBQUNKQyxVQUFNO0FBQ0pDLG1CQUFhLDBFQURUO0FBRUpDLG1CQUFhO0FBRlQ7QUFERixHQURPO0FBT2JDLFFBUGEsa0JBT0xDLE9BUEssRUFPWTtBQUN2QixRQUFNQyxVQUFVLGVBQUtDLE9BQUwsQ0FBYUYsUUFBUUcsV0FBUixFQUFiLENBQWhCOztBQUVBOzs7Ozs7Ozs7OztBQWFBLFFBQU1DLE1BQU0sRUFBWjs7QUFFQSxXQUFPO0FBQ0xDLHVCQURLLDZCQUNjQyxJQURkLEVBQzRCO0FBQy9CLFlBQU1DLHNCQUFzQixrQ0FBdUJELElBQXZCLENBQTVCOztBQUVBLFlBQUksQ0FBQ0MsbUJBQUwsRUFBMEI7QUFDeEI7QUFDRDs7QUFMOEIsWUFRN0JDLFVBUjZCLEdBVzNCRCxtQkFYMkIsQ0FRN0JDLFVBUjZCO0FBQUEsWUFTN0JDLGFBVDZCLEdBVzNCRixtQkFYMkIsQ0FTN0JFLGFBVDZCO0FBQUEsWUFVN0JDLFVBVjZCLEdBVzNCSCxtQkFYMkIsQ0FVN0JHLFVBVjZCOzs7QUFhL0IsWUFBTUMsd0JBQXdCLGVBQUtDLE9BQUwsQ0FBYVgsT0FBYixFQUFzQlEsYUFBdEIsQ0FBOUI7O0FBRUE7OztBQUdBLFlBQU1JLGdCQUFnQiwyQkFBZ0JGLHFCQUFoQixDQUF0Qjs7QUFFQTtBQUNBLHlCQUFFRyxHQUFGLENBQU1WLEdBQU4sRUFBY0ksVUFBZCxlQUFvQ0ssYUFBcEM7O0FBRUE7QUFDQSx5QkFBRUMsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsWUFBaUNFLFVBQWpDO0FBQ0QsT0ExQkk7O0FBMkJMSyx3QkFBa0IsMEJBQUNULElBQUQsRUFBa0I7QUFDbEM7Ozs7QUFJQSxZQUFNVSxhQUFhVixLQUFLVyxNQUFMLENBQVlDLElBQS9COztBQUVBLFlBQU1DLGVBQWdCYixLQUFLYyxRQUFMLENBQWNGLElBQWQsSUFBMEI7QUFDMUJaLGFBQUtjLFFBQUwsQ0FBY0MsS0FEcEMsQ0FQa0MsQ0FRWTs7QUFFOUMsWUFBSSxDQUFDRixZQUFELElBQWlCLGlCQUFFRyxVQUFGLENBQWFILFlBQWIsRUFBMkIsR0FBM0IsQ0FBckIsRUFBc0Q7QUFDcEQ7Ozs7Ozs7O0FBU0E7QUFDRDs7QUFFRCxZQUFNSSxtQkFBbUIsaUJBQUVDLEdBQUYsQ0FBTXBCLEdBQU4sRUFBY1ksVUFBZCxjQUF6Qjs7QUFFQSxZQUFJTyxvQkFBb0IsQ0FBQ0EsaUJBQWlCRSxjQUFqQixDQUFnQ04sWUFBaEMsQ0FBekIsRUFBd0U7QUFDdEVuQixrQkFBUTBCLE1BQVIsQ0FBZXBCLEtBQUtjLFFBQXBCLGVBQXdDRCxZQUF4QztBQUNEO0FBQ0Y7QUF2REksS0FBUDtBQXlERDtBQWxGWSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHtcbiAgZ2V0U3R5bGVJbXBvcnROb2RlRGF0YSxcbiAgZ2V0U3R5bGVDbGFzc2VzLFxufSBmcm9tICcuLi8uLi9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBKc05vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2hlY2tzIHRoYXQgeW91IGFyZSB1c2luZyB0aGUgZXhpc3RlbnQgY3NzL3Njc3MgY2xhc3Nlcywgbm8gbW9yZSBubyBsZXNzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH1cbiAgfSxcbiAgY3JlYXRlIChjb250ZXh0OiBPYmplY3QpIHtcbiAgICBjb25zdCBkaXJOYW1lID0gcGF0aC5kaXJuYW1lKGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG5cbiAgICAvKlxuICAgICAgIG1hcHMgdmFyaWFibGUgbmFtZSB0byBwcm9wZXJ0eSBPYmplY3RcbiAgICAgICBtYXAgPSB7IFt2YXJpYWJsZU5hbWVdOiB7IGNsYXNzZXM6IHsgZm9vOiB0cnVlIH0sIG5vZGU6IHsuLi59IH1cblxuICAgICAgIGV4YW1wbGU6XG4gICAgICAgaW1wb3J0IHMgZnJvbSAnLi9mb28uc2Nzcyc7XG4gICAgICAgcyBpcyB2YXJpYWJsZSBuYW1lXG5cbiAgICAgICBwcm9wZXJ0eSBPYmplY3QgaGFzIHR3byBrZXlzXG4gICAgICAgMS4gY2xhc3NlczogYW4gb2JqZWN0IHdpdGggY2xhc3NOYW1lIGFzIGtleSBhbmQgYSBib29sZWFuIGFzIHZhbHVlLlxuICAgICAgIFRoZSBib29sZWFuIGlzIG1hcmtlZCBpZiBpdCBpcyB1c2VkIGluIGZpbGVcbiAgICAgICAyLiBub2RlOiBub2RlIHRoYXQgY29ycmVzcG9uZCB0byBzIChzZWUgZXhhbXBsZSBhYm92ZSlcbiAgICAgKi9cbiAgICBjb25zdCBtYXAgPSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbiAobm9kZTogSnNOb2RlKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlSW1wb3J0Tm9kZURhdGEgPSBnZXRTdHlsZUltcG9ydE5vZGVEYXRhKG5vZGUpO1xuXG4gICAgICAgIGlmICghc3R5bGVJbXBvcnROb2RlRGF0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBpbXBvcnROYW1lLFxuICAgICAgICAgIHN0eWxlRmlsZVBhdGgsXG4gICAgICAgICAgaW1wb3J0Tm9kZSxcbiAgICAgICAgfSA9IHN0eWxlSW1wb3J0Tm9kZURhdGE7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVGaWxlQWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpck5hbWUsIHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgIG1hcHMgY2xhc3NOYW1lcyB3aXRoIGEgYm9vbGVhbiB0byBtYXJrIGFzIHVzZWQgaW4gc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjbGFzc05hbWVzTWFwID0gZ2V0U3R5bGVDbGFzc2VzKHN0eWxlRmlsZUFic29sdXRlUGF0aCk7XG5cbiAgICAgICAgLy8gdGhpcyB3aWxsIGJlIHVzZWQgdG8gbWFyayBzLmZvbyBhcyB1c2VkIGluIE1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgXy5zZXQobWFwLCBgJHtpbXBvcnROYW1lfS5jbGFzc2VzYCwgY2xhc3NOYW1lc01hcCk7XG5cbiAgICAgICAgLy8gc2F2ZSBub2RlIGZvciByZXBvcnRpbmcgdW51c2VkIHN0eWxlc1xuICAgICAgICBfLnNldChtYXAsIGAke2ltcG9ydE5hbWV9Lm5vZGVgLCBpbXBvcnROb2RlKTtcbiAgICAgIH0sXG4gICAgICBNZW1iZXJFeHByZXNzaW9uOiAobm9kZTogSnNOb2RlKSA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAgIENoZWNrIGlmIHByb3BlcnR5IGV4aXN0cyBpbiBjc3Mvc2NzcyBmaWxlIGFzIGNsYXNzXG4gICAgICAgICAqL1xuXG4gICAgICAgIGNvbnN0IG9iamVjdE5hbWUgPSBub2RlLm9iamVjdC5uYW1lO1xuXG4gICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IChub2RlLnByb3BlcnR5Lm5hbWUgfHwgICAgIC8vIGRvdCBub3RhdGlvbiwgcy5oZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucHJvcGVydHkudmFsdWUpOyAgIC8vIHNxdWFyZSBicmFjZXMgc1snaGVhZGVyJ11cblxuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSB8fCBfLnN0YXJ0c1dpdGgocHJvcGVydHlOYW1lLCAnXycpKSB7XG4gICAgICAgICAgLypcbiAgICAgICAgICAgICBza2lwIHByb3BlcnR5IG5hbWVzIHN0YXJ0aW5nIHdpdGggX1xuICAgICAgICAgICAgIGVnLiBzcGVjaWFsIGZ1bmN0aW9ucyBwcm92aWRlZFxuICAgICAgICAgICAgIGJ5IGNzcyBtb2R1bGVzIGxpa2UgXy5nZXRDc3MoKVxuXG4gICAgICAgICAgICAgVHJpZWQgdG8ganVzdCBza2lwIGZ1bmN0aW9uIGNhbGxzLCBidXQgdGhlIHBhcnNlclxuICAgICAgICAgICAgIHRoaW5rcyBvZiBub3JtYWwgcHJvcGVydHkgYWNjZXNzIGxpa2Ugcy5fZ2V0Q3NzIGFuZFxuICAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxzIGxpa2Ugcy5fZ2V0Q3NzKCkgYXMgc2FtZS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdmFpbGFibGVDbGFzc2VzID0gXy5nZXQobWFwLCBgJHtvYmplY3ROYW1lfS5jbGFzc2VzYCk7XG5cbiAgICAgICAgaWYgKGF2YWlsYWJsZUNsYXNzZXMgJiYgIWF2YWlsYWJsZUNsYXNzZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUucHJvcGVydHksIGBDbGFzcyAnJHtwcm9wZXJ0eU5hbWV9JyBub3QgZm91bmRgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=