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

        if (availableClasses && availableClasses.hasOwnProperty(propertyName)) {
          // mark as used
          availableClasses[propertyName] = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtY2xhc3MuanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJzdHlsZUltcG9ydE5vZGVEYXRhIiwiaW1wb3J0TmFtZSIsInN0eWxlRmlsZVBhdGgiLCJpbXBvcnROb2RlIiwic3R5bGVGaWxlQWJzb2x1dGVQYXRoIiwicmVzb2x2ZSIsImNsYXNzTmFtZXNNYXAiLCJzZXQiLCJNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0TmFtZSIsIm9iamVjdCIsIm5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eSIsInZhbHVlIiwic3RhcnRzV2l0aCIsImF2YWlsYWJsZUNsYXNzZXMiLCJnZXQiLCJoYXNPd25Qcm9wZXJ0eSIsImZvck93biIsIm8iLCJjbGFzc2VzIiwidW51c2VkQ2xhc3NlcyIsIk9iamVjdCIsImtleXMiLCJvbWl0QnkiLCJpc0VtcHR5IiwicmVwb3J0Iiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O2tCQU9lO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSwwRUFEVDtBQUVKQyxtQkFBYTtBQUZUO0FBREYsR0FETztBQU9iQyxRQVBhLGtCQU9MQyxPQVBLLEVBT1k7QUFDdkIsUUFBTUMsVUFBVSxlQUFLQyxPQUFMLENBQWFGLFFBQVFHLFdBQVIsRUFBYixDQUFoQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFhQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUM0QjtBQUMvQixZQUFNQyxzQkFBc0Isa0NBQXVCRCxJQUF2QixDQUE1Qjs7QUFFQSxZQUFJLENBQUNDLG1CQUFMLEVBQTBCO0FBQ3hCO0FBQ0Q7O0FBTDhCLFlBUTdCQyxVQVI2QixHQVczQkQsbUJBWDJCLENBUTdCQyxVQVI2QjtBQUFBLFlBUzdCQyxhQVQ2QixHQVczQkYsbUJBWDJCLENBUzdCRSxhQVQ2QjtBQUFBLFlBVTdCQyxVQVY2QixHQVczQkgsbUJBWDJCLENBVTdCRyxVQVY2Qjs7O0FBYS9CLFlBQU1DLHdCQUF3QixlQUFLQyxPQUFMLENBQWFYLE9BQWIsRUFBc0JRLGFBQXRCLENBQTlCOztBQUVBOzs7QUFHQSxZQUFNSSxnQkFBZ0IsMkJBQWdCRixxQkFBaEIsQ0FBdEI7O0FBRUE7QUFDQSx5QkFBRUcsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsZUFBb0NLLGFBQXBDOztBQUVBO0FBQ0EseUJBQUVDLEdBQUYsQ0FBTVYsR0FBTixFQUFjSSxVQUFkLFlBQWlDRSxVQUFqQztBQUNELE9BMUJJOztBQTJCTEssd0JBQWtCLDBCQUFDVCxJQUFELEVBQWtCO0FBQ2xDOzs7O0FBSUEsWUFBTVUsYUFBYVYsS0FBS1csTUFBTCxDQUFZQyxJQUEvQjs7QUFFQSxZQUFNQyxlQUFnQmIsS0FBS2MsUUFBTCxDQUFjRixJQUFkLElBQTBCO0FBQzFCWixhQUFLYyxRQUFMLENBQWNDLEtBRHBDLENBUGtDLENBUVk7O0FBRTlDLFlBQUksQ0FBQ0YsWUFBRCxJQUFpQixpQkFBRUcsVUFBRixDQUFhSCxZQUFiLEVBQTJCLEdBQTNCLENBQXJCLEVBQXNEO0FBQ3BEOzs7Ozs7OztBQVNBO0FBQ0Q7O0FBRUQsWUFBTUksbUJBQW1CLGlCQUFFQyxHQUFGLENBQU1wQixHQUFOLEVBQWNZLFVBQWQsY0FBekI7O0FBRUEsWUFBSU8sb0JBQW9CQSxpQkFBaUJFLGNBQWpCLENBQWdDTixZQUFoQyxDQUF4QixFQUF1RTtBQUNyRTtBQUNBSSwyQkFBaUJKLFlBQWpCLElBQWlDLElBQWpDO0FBQ0Q7QUFDRixPQXhESTtBQXlETCxvQkF6REsseUJBeURhO0FBQ2hCOzs7QUFHQSx5QkFBRU8sTUFBRixDQUFTdEIsR0FBVCxFQUFjLFVBQUN1QixDQUFELEVBQU87QUFBQSxjQUNYQyxPQURXLEdBQ09ELENBRFAsQ0FDWEMsT0FEVztBQUFBLGNBQ0Z0QixJQURFLEdBQ09xQixDQURQLENBQ0ZyQixJQURFOztBQUduQjs7QUFDQSxjQUFNdUIsZ0JBQWdCQyxPQUFPQyxJQUFQLENBQVksaUJBQUVDLE1BQUYsQ0FBU0osT0FBVCxFQUFrQixJQUFsQixDQUFaLENBQXRCOztBQUVBLGNBQUksQ0FBQyxpQkFBRUssT0FBRixDQUFVSixhQUFWLENBQUwsRUFBK0I7QUFDN0I3QixvQkFBUWtDLE1BQVIsQ0FBZTVCLElBQWYsNkJBQThDdUIsY0FBY00sSUFBZCxDQUFtQixJQUFuQixDQUE5QztBQUNEO0FBQ0YsU0FURDtBQVVEO0FBdkVJLEtBQVA7QUF5RUQ7QUFsR1ksQyIsImZpbGUiOiJuby11bnVzZWQtY2xhc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQge1xuICBnZXRTdHlsZUltcG9ydE5vZGVEYXRhLFxuICBnZXRTdHlsZUNsYXNzZXMsXG59IGZyb20gJy4uL2NvcmUnO1xuXG5pbXBvcnQgdHlwZSB7IEpzTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtZXRhOiB7XG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246ICdDaGVja3MgdGhhdCB5b3UgYXJlIHVzaW5nIHRoZSBleGlzdGVudCBjc3Mvc2NzcyBjbGFzc2VzLCBubyBtb3JlIG5vIGxlc3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgfVxuICB9LFxuICBjcmVhdGUgKGNvbnRleHQ6IE9iamVjdCkge1xuICAgIGNvbnN0IGRpck5hbWUgPSBwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRGaWxlbmFtZSgpKTtcblxuICAgIC8qXG4gICAgICAgbWFwcyB2YXJpYWJsZSBuYW1lIHRvIHByb3BlcnR5IE9iamVjdFxuICAgICAgIG1hcCA9IHsgW3ZhcmlhYmxlTmFtZV06IHsgY2xhc3NlczogeyBmb286IHRydWUgfSwgbm9kZTogey4uLn0gfVxuXG4gICAgICAgZXhhbXBsZTpcbiAgICAgICBpbXBvcnQgcyBmcm9tICcuL2Zvby5zY3NzJztcbiAgICAgICBzIGlzIHZhcmlhYmxlIG5hbWVcblxuICAgICAgIHByb3BlcnR5IE9iamVjdCBoYXMgdHdvIGtleXNcbiAgICAgICAxLiBjbGFzc2VzOiBhbiBvYmplY3Qgd2l0aCBjbGFzc05hbWUgYXMga2V5IGFuZCBhIGJvb2xlYW4gYXMgdmFsdWUuXG4gICAgICAgVGhlIGJvb2xlYW4gaXMgbWFya2VkIGlmIGl0IGlzIHVzZWQgaW4gZmlsZVxuICAgICAgIDIuIG5vZGU6IG5vZGUgdGhhdCBjb3JyZXNwb25kIHRvIHMgKHNlZSBleGFtcGxlIGFib3ZlKVxuICAgICAqL1xuICAgIGNvbnN0IG1hcCA9IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uIChub2RlOiBKc05vZGUpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVJbXBvcnROb2RlRGF0YSA9IGdldFN0eWxlSW1wb3J0Tm9kZURhdGEobm9kZSk7XG5cbiAgICAgICAgaWYgKCFzdHlsZUltcG9ydE5vZGVEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGltcG9ydE5hbWUsXG4gICAgICAgICAgc3R5bGVGaWxlUGF0aCxcbiAgICAgICAgICBpbXBvcnROb2RlLFxuICAgICAgICB9ID0gc3R5bGVJbXBvcnROb2RlRGF0YTtcblxuICAgICAgICBjb25zdCBzdHlsZUZpbGVBYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUoZGlyTmFtZSwgc3R5bGVGaWxlUGF0aCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgbWFwcyBjbGFzc05hbWVzIHdpdGggYSBib29sZWFuIHRvIG1hcmsgYXMgdXNlZCBpbiBzb3VyY2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZXNNYXAgPSBnZXRTdHlsZUNsYXNzZXMoc3R5bGVGaWxlQWJzb2x1dGVQYXRoKTtcblxuICAgICAgICAvLyB0aGlzIHdpbGwgYmUgdXNlZCB0byBtYXJrIHMuZm9vIGFzIHVzZWQgaW4gTWVtYmVyRXhwcmVzc2lvblxuICAgICAgICBfLnNldChtYXAsIGAke2ltcG9ydE5hbWV9LmNsYXNzZXNgLCBjbGFzc05hbWVzTWFwKTtcblxuICAgICAgICAvLyBzYXZlIG5vZGUgZm9yIHJlcG9ydGluZyB1bnVzZWQgc3R5bGVzXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7aW1wb3J0TmFtZX0ubm9kZWAsIGltcG9ydE5vZGUpO1xuICAgICAgfSxcbiAgICAgIE1lbWJlckV4cHJlc3Npb246IChub2RlOiBKc05vZGUpID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgcHJvcGVydHkgZXhpc3RzIGluIGNzcy9zY3NzIGZpbGUgYXMgY2xhc3NcbiAgICAgICAgICovXG5cbiAgICAgICAgY29uc3Qgb2JqZWN0TmFtZSA9IG5vZGUub2JqZWN0Lm5hbWU7XG5cbiAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gKG5vZGUucHJvcGVydHkubmFtZSB8fCAgICAgLy8gZG90IG5vdGF0aW9uLCBzLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wcm9wZXJ0eS52YWx1ZSk7ICAgLy8gc3F1YXJlIGJyYWNlcyBzWydoZWFkZXInXVxuXG4gICAgICAgIGlmICghcHJvcGVydHlOYW1lIHx8IF8uc3RhcnRzV2l0aChwcm9wZXJ0eU5hbWUsICdfJykpIHtcbiAgICAgICAgICAvKlxuICAgICAgICAgICAgIHNraXAgcHJvcGVydHkgbmFtZXMgc3RhcnRpbmcgd2l0aCBfXG4gICAgICAgICAgICAgZWcuIHNwZWNpYWwgZnVuY3Rpb25zIHByb3ZpZGVkXG4gICAgICAgICAgICAgYnkgY3NzIG1vZHVsZXMgbGlrZSBfLmdldENzcygpXG5cbiAgICAgICAgICAgICBUcmllZCB0byBqdXN0IHNraXAgZnVuY3Rpb24gY2FsbHMsIGJ1dCB0aGUgcGFyc2VyXG4gICAgICAgICAgICAgdGhpbmtzIG9mIG5vcm1hbCBwcm9wZXJ0eSBhY2Nlc3MgbGlrZSBzLl9nZXRDc3MgYW5kXG4gICAgICAgICAgICAgZnVuY3Rpb24gY2FsbHMgbGlrZSBzLl9nZXRDc3MoKSBhcyBzYW1lLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZUNsYXNzZXMgPSBfLmdldChtYXAsIGAke29iamVjdE5hbWV9LmNsYXNzZXNgKTtcblxuICAgICAgICBpZiAoYXZhaWxhYmxlQ2xhc3NlcyAmJiBhdmFpbGFibGVDbGFzc2VzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAvLyBtYXJrIGFzIHVzZWRcbiAgICAgICAgICBhdmFpbGFibGVDbGFzc2VzW3Byb3BlcnR5TmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ1Byb2dyYW06ZXhpdCcgKCkge1xuICAgICAgICAvKlxuICAgICAgICAgICBDaGVjayBpZiBhbGwgY2xhc3NlcyBkZWZpbmVkIGluIGNzcy9zY3NzIGZpbGUgYXJlIHVzZWRcbiAgICAgICAgICovXG4gICAgICAgIF8uZm9yT3duKG1hcCwgKG8pID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNsYXNzZXMsIG5vZGUgfSA9IG87XG5cbiAgICAgICAgICAvLyBjbGFzc05hbWVzIG5vdCBtYXJrZWQgYXMgdHJ1ZSBhcmUgdW51c2VkXG4gICAgICAgICAgY29uc3QgdW51c2VkQ2xhc3NlcyA9IE9iamVjdC5rZXlzKF8ub21pdEJ5KGNsYXNzZXMsIG51bGwpKTtcblxuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHVudXNlZENsYXNzZXMpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCBgVW51c2VkIGNsYXNzZXMgZm91bmQ6ICR7dW51c2VkQ2xhc3Nlcy5qb2luKCcsICcpfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==