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

        if (availableClasses) {
          if (!availableClasses.hasOwnProperty(propertyName)) {
            context.report(node.property, 'Class \'' + propertyName + '\' not found');
          } else {
            // mark as used
            availableClasses[propertyName] = true;
          }
        }
      },
      'Program:exit': function ProgramExit() {
        /*
           Check if all classes defined in css/scss file are used
        */
        _lodash2.default.forOwn(map, function (o) {
          var classes = o.classes,
              node = o.node;

          // classNames not marked as true are unused

          var unusedClasses = Object.keys(_lodash2.default.omitBy(classes, null));

          if (!_lodash2.default.isEmpty(unusedClasses)) {
            context.report(node, 'Unused classes found: ' + unusedClasses.join(', '));
          }
        });
      }
    };
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtb3ItZXh0cmEtY2xhc3MvaW5kZXguanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJzdHlsZUltcG9ydE5vZGVEYXRhIiwiaW1wb3J0TmFtZSIsInN0eWxlRmlsZVBhdGgiLCJpbXBvcnROb2RlIiwic3R5bGVGaWxlQWJzb2x1dGVQYXRoIiwicmVzb2x2ZSIsImNsYXNzTmFtZXNNYXAiLCJzZXQiLCJNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0TmFtZSIsIm9iamVjdCIsIm5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eSIsInZhbHVlIiwic3RhcnRzV2l0aCIsImF2YWlsYWJsZUNsYXNzZXMiLCJnZXQiLCJoYXNPd25Qcm9wZXJ0eSIsInJlcG9ydCIsImZvck93biIsIm8iLCJjbGFzc2VzIiwidW51c2VkQ2xhc3NlcyIsIk9iamVjdCIsImtleXMiLCJvbWl0QnkiLCJpc0VtcHR5Iiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O2tCQU9lO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSwwRUFEVDtBQUVKQyxtQkFBYTtBQUZUO0FBREYsR0FETztBQU9iQyxRQVBhLGtCQU9MQyxPQVBLLEVBT1k7QUFDdkIsUUFBTUMsVUFBVSxlQUFLQyxPQUFMLENBQWFGLFFBQVFHLFdBQVIsRUFBYixDQUFoQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFhQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUM0QjtBQUMvQixZQUFNQyxzQkFBc0Isa0NBQXVCRCxJQUF2QixDQUE1Qjs7QUFFQSxZQUFJLENBQUNDLG1CQUFMLEVBQTBCO0FBQ3hCO0FBQ0Q7O0FBTDhCLFlBUTdCQyxVQVI2QixHQVczQkQsbUJBWDJCLENBUTdCQyxVQVI2QjtBQUFBLFlBUzdCQyxhQVQ2QixHQVczQkYsbUJBWDJCLENBUzdCRSxhQVQ2QjtBQUFBLFlBVTdCQyxVQVY2QixHQVczQkgsbUJBWDJCLENBVTdCRyxVQVY2Qjs7O0FBYS9CLFlBQU1DLHdCQUF3QixlQUFLQyxPQUFMLENBQWFYLE9BQWIsRUFBc0JRLGFBQXRCLENBQTlCOztBQUVBOzs7QUFHQSxZQUFNSSxnQkFBZ0IsMkJBQWdCRixxQkFBaEIsQ0FBdEI7O0FBRUE7QUFDQSx5QkFBRUcsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsZUFBb0NLLGFBQXBDOztBQUVBO0FBQ0EseUJBQUVDLEdBQUYsQ0FBTVYsR0FBTixFQUFjSSxVQUFkLFlBQWlDRSxVQUFqQztBQUNELE9BMUJJOztBQTJCTEssd0JBQWtCLDBCQUFDVCxJQUFELEVBQWtCO0FBQ2xDOzs7O0FBSUEsWUFBTVUsYUFBYVYsS0FBS1csTUFBTCxDQUFZQyxJQUEvQjs7QUFFQSxZQUFNQyxlQUFnQmIsS0FBS2MsUUFBTCxDQUFjRixJQUFkLElBQTBCO0FBQzFCWixhQUFLYyxRQUFMLENBQWNDLEtBRHBDLENBUGtDLENBUVk7O0FBRTlDLFlBQUksQ0FBQ0YsWUFBRCxJQUFpQixpQkFBRUcsVUFBRixDQUFhSCxZQUFiLEVBQTJCLEdBQTNCLENBQXJCLEVBQXNEO0FBQ3BEOzs7Ozs7OztBQVNBO0FBQ0Q7O0FBRUQsWUFBTUksbUJBQW1CLGlCQUFFQyxHQUFGLENBQU1wQixHQUFOLEVBQWNZLFVBQWQsY0FBekI7O0FBRUEsWUFBSU8sZ0JBQUosRUFBc0I7QUFDcEIsY0FBSSxDQUFDQSxpQkFBaUJFLGNBQWpCLENBQWdDTixZQUFoQyxDQUFMLEVBQW9EO0FBQ2xEbkIsb0JBQVEwQixNQUFSLENBQWVwQixLQUFLYyxRQUFwQixlQUF3Q0QsWUFBeEM7QUFDRCxXQUZELE1BRU87QUFDTDtBQUNBSSw2QkFBaUJKLFlBQWpCLElBQWlDLElBQWpDO0FBQ0Q7QUFDRjtBQUNGLE9BNURJO0FBNkRMLG9CQTdESyx5QkE2RGE7QUFDaEI7OztBQUdBLHlCQUFFUSxNQUFGLENBQVN2QixHQUFULEVBQWMsVUFBQ3dCLENBQUQsRUFBTztBQUFBLGNBQ1hDLE9BRFcsR0FDT0QsQ0FEUCxDQUNYQyxPQURXO0FBQUEsY0FDRnZCLElBREUsR0FDT3NCLENBRFAsQ0FDRnRCLElBREU7O0FBR25COztBQUNBLGNBQU13QixnQkFBZ0JDLE9BQU9DLElBQVAsQ0FBWSxpQkFBRUMsTUFBRixDQUFTSixPQUFULEVBQWtCLElBQWxCLENBQVosQ0FBdEI7O0FBRUEsY0FBSSxDQUFDLGlCQUFFSyxPQUFGLENBQVVKLGFBQVYsQ0FBTCxFQUErQjtBQUM3QjlCLG9CQUFRMEIsTUFBUixDQUFlcEIsSUFBZiw2QkFBOEN3QixjQUFjSyxJQUFkLENBQW1CLElBQW5CLENBQTlDO0FBQ0Q7QUFDRixTQVREO0FBVUQ7QUEzRUksS0FBUDtBQTZFRDtBQXRHWSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHtcbiAgZ2V0U3R5bGVJbXBvcnROb2RlRGF0YSxcbiAgZ2V0U3R5bGVDbGFzc2VzLFxufSBmcm9tICcuLi8uLi9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBKc05vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2hlY2tzIHRoYXQgeW91IGFyZSB1c2luZyB0aGUgZXhpc3RlbnQgY3NzL3Njc3MgY2xhc3Nlcywgbm8gbW9yZSBubyBsZXNzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH1cbiAgfSxcbiAgY3JlYXRlIChjb250ZXh0OiBPYmplY3QpIHtcbiAgICBjb25zdCBkaXJOYW1lID0gcGF0aC5kaXJuYW1lKGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG5cbiAgICAvKlxuICAgICAgIG1hcHMgdmFyaWFibGUgbmFtZSB0byBwcm9wZXJ0eSBPYmplY3RcbiAgICAgICBtYXAgPSB7IFt2YXJpYWJsZU5hbWVdOiB7IGNsYXNzZXM6IHsgZm9vOiB0cnVlIH0sIG5vZGU6IHsuLi59IH1cblxuICAgICAgIGV4YW1wbGU6XG4gICAgICAgaW1wb3J0IHMgZnJvbSAnLi9mb28uc2Nzcyc7XG4gICAgICAgcyBpcyB2YXJpYWJsZSBuYW1lXG5cbiAgICAgICBwcm9wZXJ0eSBPYmplY3QgaGFzIHR3byBrZXlzXG4gICAgICAgMS4gY2xhc3NlczogYW4gb2JqZWN0IHdpdGggY2xhc3NOYW1lIGFzIGtleSBhbmQgYSBib29sZWFuIGFzIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgIFRoZSBib29sZWFuIGlzIG1hcmtlZCBpZiBpdCBpcyB1c2VkIGluIGZpbGVcbiAgICAgICAyLiBub2RlOiBub2RlIHRoYXQgY29ycmVzcG9uZCB0byBzIChzZWUgZXhhbXBsZSBhYm92ZSlcbiAgICAqL1xuICAgIGNvbnN0IG1hcCA9IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uIChub2RlOiBKc05vZGUpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVJbXBvcnROb2RlRGF0YSA9IGdldFN0eWxlSW1wb3J0Tm9kZURhdGEobm9kZSk7XG5cbiAgICAgICAgaWYgKCFzdHlsZUltcG9ydE5vZGVEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGltcG9ydE5hbWUsXG4gICAgICAgICAgc3R5bGVGaWxlUGF0aCxcbiAgICAgICAgICBpbXBvcnROb2RlLFxuICAgICAgICB9ID0gc3R5bGVJbXBvcnROb2RlRGF0YTtcblxuICAgICAgICBjb25zdCBzdHlsZUZpbGVBYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUoZGlyTmFtZSwgc3R5bGVGaWxlUGF0aCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgbWFwcyBjbGFzc05hbWVzIHdpdGggYSBib29sZWFuIHRvIG1hcmsgYXMgdXNlZCBpbiBzb3VyY2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZXNNYXAgPSBnZXRTdHlsZUNsYXNzZXMoc3R5bGVGaWxlQWJzb2x1dGVQYXRoKTtcblxuICAgICAgICAvLyB0aGlzIHdpbGwgYmUgdXNlZCB0byBtYXJrIHMuZm9vIGFzIHVzZWQgaW4gTWVtYmVyRXhwcmVzc2lvblxuICAgICAgICBfLnNldChtYXAsIGAke2ltcG9ydE5hbWV9LmNsYXNzZXNgLCBjbGFzc05hbWVzTWFwKTtcblxuICAgICAgICAvLyBzYXZlIG5vZGUgZm9yIHJlcG9ydGluZyB1bnVzZWQgc3R5bGVzXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7aW1wb3J0TmFtZX0ubm9kZWAsIGltcG9ydE5vZGUpO1xuICAgICAgfSxcbiAgICAgIE1lbWJlckV4cHJlc3Npb246IChub2RlOiBKc05vZGUpID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgcHJvcGVydHkgZXhpc3RzIGluIGNzcy9zY3NzIGZpbGUgYXMgY2xhc3NcbiAgICAgICAgICovXG5cbiAgICAgICAgY29uc3Qgb2JqZWN0TmFtZSA9IG5vZGUub2JqZWN0Lm5hbWU7XG5cbiAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gKG5vZGUucHJvcGVydHkubmFtZSB8fCAgICAgLy8gZG90IG5vdGF0aW9uLCBzLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wcm9wZXJ0eS52YWx1ZSk7ICAgLy8gc3F1YXJlIGJyYWNlcyBzWydoZWFkZXInXVxuXG4gICAgICAgIGlmICghcHJvcGVydHlOYW1lIHx8IF8uc3RhcnRzV2l0aChwcm9wZXJ0eU5hbWUsICdfJykpIHtcbiAgICAgICAgICAvKlxuICAgICAgICAgICAgIHNraXAgcHJvcGVydHkgbmFtZXMgc3RhcnRpbmcgd2l0aCBfXG4gICAgICAgICAgICAgZWcuIHNwZWNpYWwgZnVuY3Rpb25zIHByb3ZpZGVkXG4gICAgICAgICAgICAgYnkgY3NzIG1vZHVsZXMgbGlrZSBfLmdldENzcygpXG5cbiAgICAgICAgICAgICBUcmllZCB0byBqdXN0IHNraXAgZnVuY3Rpb24gY2FsbHMsIGJ1dCB0aGUgcGFyc2VyXG4gICAgICAgICAgICAgdGhpbmtzIG9mIG5vcm1hbCBwcm9wZXJ0eSBhY2Nlc3MgbGlrZSBzLl9nZXRDc3MgYW5kXG4gICAgICAgICAgICAgZnVuY3Rpb24gY2FsbHMgbGlrZSBzLl9nZXRDc3MoKSBhcyBzYW1lLlxuICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQ2xhc3NlcyA9IF8uZ2V0KG1hcCwgYCR7b2JqZWN0TmFtZX0uY2xhc3Nlc2ApO1xuXG4gICAgICAgIGlmIChhdmFpbGFibGVDbGFzc2VzKSB7XG4gICAgICAgICAgaWYgKCFhdmFpbGFibGVDbGFzc2VzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUucHJvcGVydHksIGBDbGFzcyAnJHtwcm9wZXJ0eU5hbWV9JyBub3QgZm91bmRgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbWFyayBhcyB1c2VkXG4gICAgICAgICAgICBhdmFpbGFibGVDbGFzc2VzW3Byb3BlcnR5TmFtZV0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdQcm9ncmFtOmV4aXQnICgpIHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgYWxsIGNsYXNzZXMgZGVmaW5lZCBpbiBjc3Mvc2NzcyBmaWxlIGFyZSB1c2VkXG4gICAgICAgICovXG4gICAgICAgIF8uZm9yT3duKG1hcCwgKG8pID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNsYXNzZXMsIG5vZGUgfSA9IG87XG5cbiAgICAgICAgICAvLyBjbGFzc05hbWVzIG5vdCBtYXJrZWQgYXMgdHJ1ZSBhcmUgdW51c2VkXG4gICAgICAgICAgY29uc3QgdW51c2VkQ2xhc3NlcyA9IE9iamVjdC5rZXlzKF8ub21pdEJ5KGNsYXNzZXMsIG51bGwpKTtcblxuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHVudXNlZENsYXNzZXMpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCBgVW51c2VkIGNsYXNzZXMgZm91bmQ6ICR7dW51c2VkQ2xhc3Nlcy5qb2luKCcsICcpfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==