'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _getStyleClasses = require('./getStyleClasses');

var _getStyleClasses2 = _interopRequireDefault(_getStyleClasses);

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
        var defaultImportData = (0, _utils.getDefaultImportStyleData)(node);

        if (!defaultImportData) {
          return;
        }

        var variableName = defaultImportData.variableName,
            styleFilePath = defaultImportData.path,
            importNode = defaultImportData.importNode;


        var styleFileAbsolutePath = _path2.default.resolve(dirName, styleFilePath);

        /*
           maps classNames with a boolean to mark as used in source
         */
        var classNamesMap = (0, _getStyleClasses2.default)(styleFileAbsolutePath);

        _lodash2.default.set(map, variableName + '.classes', classNamesMap);

        // save node for reporting unused styles
        _lodash2.default.set(map, variableName + '.node', importNode);
      },

      MemberExpression: function MemberExpression(node) {
        /*
           Check if property exists in css/scss file as class
         */

        var objectName = node.object.name;

        var propertyName = node.property.name || // dot notation, s.header
        node.property.value; // square braces s['header']

        if (!propertyName || propertyName.startsWith('_')) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtb3ItZXh0cmEtY2xhc3MvaW5kZXguanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJkZWZhdWx0SW1wb3J0RGF0YSIsInZhcmlhYmxlTmFtZSIsInN0eWxlRmlsZVBhdGgiLCJwYXRoIiwiaW1wb3J0Tm9kZSIsInN0eWxlRmlsZUFic29sdXRlUGF0aCIsInJlc29sdmUiLCJjbGFzc05hbWVzTWFwIiwic2V0IiwiTWVtYmVyRXhwcmVzc2lvbiIsIm9iamVjdE5hbWUiLCJvYmplY3QiLCJuYW1lIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHkiLCJ2YWx1ZSIsInN0YXJ0c1dpdGgiLCJhdmFpbGFibGVDbGFzc2VzIiwiZ2V0IiwiaGFzT3duUHJvcGVydHkiLCJyZXBvcnQiLCJmb3JPd24iLCJvIiwiY2xhc3NlcyIsInVudXNlZENsYXNzZXMiLCJPYmplY3QiLCJrZXlzIiwib21pdEJ5IiwiaXNFbXB0eSIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7Ozs7O2tCQUllO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSwwRUFEVDtBQUVKQyxtQkFBYTtBQUZUO0FBREYsR0FETztBQU9iQyxRQVBhLGtCQU9MQyxPQVBLLEVBT1k7QUFDdkIsUUFBTUMsVUFBVSxlQUFLQyxPQUFMLENBQWFGLFFBQVFHLFdBQVIsRUFBYixDQUFoQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFhQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUMwQjtBQUM3QixZQUFNQyxvQkFBb0Isc0NBQTBCRCxJQUExQixDQUExQjs7QUFFQSxZQUFJLENBQUNDLGlCQUFMLEVBQXdCO0FBQ3RCO0FBQ0Q7O0FBTDRCLFlBUTNCQyxZQVIyQixHQVd6QkQsaUJBWHlCLENBUTNCQyxZQVIyQjtBQUFBLFlBU3JCQyxhQVRxQixHQVd6QkYsaUJBWHlCLENBUzNCRyxJQVQyQjtBQUFBLFlBVTNCQyxVQVYyQixHQVd6QkosaUJBWHlCLENBVTNCSSxVQVYyQjs7O0FBYTdCLFlBQU1DLHdCQUF3QixlQUFLQyxPQUFMLENBQWFaLE9BQWIsRUFBc0JRLGFBQXRCLENBQTlCOztBQUVBOzs7QUFHQSxZQUFNSyxnQkFBZ0IsK0JBQWdCRixxQkFBaEIsQ0FBdEI7O0FBRUEseUJBQUVHLEdBQUYsQ0FBTVgsR0FBTixFQUFjSSxZQUFkLGVBQXNDTSxhQUF0Qzs7QUFFQTtBQUNBLHlCQUFFQyxHQUFGLENBQU1YLEdBQU4sRUFBY0ksWUFBZCxZQUFtQ0csVUFBbkM7QUFDRCxPQXpCSTs7QUEwQkxLLHdCQUFrQiwwQkFBQ1YsSUFBRCxFQUFnQjtBQUNoQzs7OztBQUlBLFlBQU1XLGFBQWFYLEtBQUtZLE1BQUwsQ0FBWUMsSUFBL0I7O0FBRUEsWUFBTUMsZUFBZ0JkLEtBQUtlLFFBQUwsQ0FBY0YsSUFBZCxJQUEwQjtBQUMxQmIsYUFBS2UsUUFBTCxDQUFjQyxLQURwQyxDQVBnQyxDQVFjOztBQUU5QyxZQUFJLENBQUNGLFlBQUQsSUFBaUJBLGFBQWFHLFVBQWIsQ0FBd0IsR0FBeEIsQ0FBckIsRUFBbUQ7QUFDakQ7Ozs7Ozs7O0FBU0E7QUFDRDs7QUFFRCxZQUFNQyxtQkFBbUIsaUJBQUVDLEdBQUYsQ0FBTXJCLEdBQU4sRUFBY2EsVUFBZCxjQUF6Qjs7QUFFQSxZQUFJTyxnQkFBSixFQUFzQjtBQUNwQixjQUFJLENBQUNBLGlCQUFpQkUsY0FBakIsQ0FBZ0NOLFlBQWhDLENBQUwsRUFBb0Q7QUFDbERwQixvQkFBUTJCLE1BQVIsQ0FBZXJCLEtBQUtlLFFBQXBCLGVBQXdDRCxZQUF4QztBQUNELFdBRkQsTUFFTztBQUNMO0FBQ0FJLDZCQUFpQkosWUFBakIsSUFBaUMsSUFBakM7QUFDRDtBQUNGO0FBQ0YsT0EzREk7QUE0REwsb0JBNURLLHlCQTREYTtBQUNoQjs7O0FBR0EseUJBQUVRLE1BQUYsQ0FBU3hCLEdBQVQsRUFBYyxVQUFDeUIsQ0FBRCxFQUFPO0FBQUEsY0FDWEMsT0FEVyxHQUNPRCxDQURQLENBQ1hDLE9BRFc7QUFBQSxjQUNGeEIsSUFERSxHQUNPdUIsQ0FEUCxDQUNGdkIsSUFERTs7QUFHbkI7O0FBQ0EsY0FBTXlCLGdCQUFnQkMsT0FBT0MsSUFBUCxDQUFZLGlCQUFFQyxNQUFGLENBQVNKLE9BQVQsRUFBa0IsSUFBbEIsQ0FBWixDQUF0Qjs7QUFFQSxjQUFJLENBQUMsaUJBQUVLLE9BQUYsQ0FBVUosYUFBVixDQUFMLEVBQStCO0FBQzdCL0Isb0JBQVEyQixNQUFSLENBQWVyQixJQUFmLDZCQUE4Q3lCLGNBQWNLLElBQWQsQ0FBbUIsSUFBbkIsQ0FBOUM7QUFDRDtBQUNGLFNBVEQ7QUFVRDtBQTFFSSxLQUFQO0FBNEVEO0FBckdZLEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBnZXREZWZhdWx0SW1wb3J0U3R5bGVEYXRhIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgZ2V0U3R5bGVDbGFzc2VzIGZyb20gJy4vZ2V0U3R5bGVDbGFzc2VzJztcblxuaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1ldGE6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0NoZWNrcyB0aGF0IHlvdSBhcmUgdXNpbmcgdGhlIGV4aXN0ZW50IGNzcy9zY3NzIGNsYXNzZXMsIG5vIG1vcmUgbm8gbGVzcycsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICB9XG4gIH0sXG4gIGNyZWF0ZSAoY29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgZGlyTmFtZSA9IHBhdGguZGlybmFtZShjb250ZXh0LmdldEZpbGVuYW1lKCkpO1xuXG4gICAgLypcbiAgICAgICBtYXBzIHZhcmlhYmxlIG5hbWUgdG8gcHJvcGVydHkgT2JqZWN0XG4gICAgICAgbWFwID0geyBbdmFyaWFibGVOYW1lXTogeyBjbGFzc2VzOiB7IGZvbzogdHJ1ZSB9LCBub2RlOiB7Li4ufSB9XG5cbiAgICAgICBleGFtcGxlOlxuICAgICAgIGltcG9ydCBzIGZyb20gJy4vZm9vLnNjc3MnO1xuICAgICAgIHMgaXMgdmFyaWFibGUgbmFtZVxuXG4gICAgICAgcHJvcGVydHkgT2JqZWN0IGhhcyB0d28ga2V5c1xuICAgICAgIDEuIGNsYXNzZXM6IGFuIG9iamVjdCB3aXRoIGNsYXNzTmFtZSBhcyBrZXkgYW5kIGEgYm9vbGVhbiBhcyB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICBUaGUgYm9vbGVhbiBpcyBtYXJrZWQgaWYgaXQgaXMgdXNlZCBpbiBmaWxlXG4gICAgICAgMi4gbm9kZTogbm9kZSB0aGF0IGNvcnJlc3BvbmQgdG8gcyAoc2VlIGV4YW1wbGUgYWJvdmUpXG4gICAgKi9cbiAgICBjb25zdCBtYXAgPSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbiAobm9kZTogTm9kZSkge1xuICAgICAgICBjb25zdCBkZWZhdWx0SW1wb3J0RGF0YSA9IGdldERlZmF1bHRJbXBvcnRTdHlsZURhdGEobm9kZSk7XG5cbiAgICAgICAgaWYgKCFkZWZhdWx0SW1wb3J0RGF0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICB2YXJpYWJsZU5hbWUsXG4gICAgICAgICAgcGF0aDogc3R5bGVGaWxlUGF0aCxcbiAgICAgICAgICBpbXBvcnROb2RlLFxuICAgICAgICB9ID0gZGVmYXVsdEltcG9ydERhdGE7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVGaWxlQWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpck5hbWUsIHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgIG1hcHMgY2xhc3NOYW1lcyB3aXRoIGEgYm9vbGVhbiB0byBtYXJrIGFzIHVzZWQgaW4gc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjbGFzc05hbWVzTWFwID0gZ2V0U3R5bGVDbGFzc2VzKHN0eWxlRmlsZUFic29sdXRlUGF0aCk7XG5cbiAgICAgICAgXy5zZXQobWFwLCBgJHt2YXJpYWJsZU5hbWV9LmNsYXNzZXNgLCBjbGFzc05hbWVzTWFwKTtcblxuICAgICAgICAvLyBzYXZlIG5vZGUgZm9yIHJlcG9ydGluZyB1bnVzZWQgc3R5bGVzXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7dmFyaWFibGVOYW1lfS5ub2RlYCwgaW1wb3J0Tm9kZSk7XG4gICAgICB9LFxuICAgICAgTWVtYmVyRXhwcmVzc2lvbjogKG5vZGU6IE5vZGUpID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgcHJvcGVydHkgZXhpc3RzIGluIGNzcy9zY3NzIGZpbGUgYXMgY2xhc3NcbiAgICAgICAgICovXG5cbiAgICAgICAgY29uc3Qgb2JqZWN0TmFtZSA9IG5vZGUub2JqZWN0Lm5hbWU7XG5cbiAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gKG5vZGUucHJvcGVydHkubmFtZSB8fCAgICAgLy8gZG90IG5vdGF0aW9uLCBzLmhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5wcm9wZXJ0eS52YWx1ZSk7ICAgLy8gc3F1YXJlIGJyYWNlcyBzWydoZWFkZXInXVxuXG4gICAgICAgIGlmICghcHJvcGVydHlOYW1lIHx8IHByb3BlcnR5TmFtZS5zdGFydHNXaXRoKCdfJykpIHtcbiAgICAgICAgICAvKlxuICAgICAgICAgICAgIHNraXAgcHJvcGVydHkgbmFtZXMgc3RhcnRpbmcgd2l0aCBfXG4gICAgICAgICAgICAgZWcuIHNwZWNpYWwgZnVuY3Rpb25zIHByb3ZpZGVkXG4gICAgICAgICAgICAgYnkgY3NzIG1vZHVsZXMgbGlrZSBfLmdldENzcygpXG5cbiAgICAgICAgICAgICBUcmllZCB0byBqdXN0IHNraXAgZnVuY3Rpb24gY2FsbHMsIGJ1dCB0aGUgcGFyc2VyXG4gICAgICAgICAgICAgdGhpbmtzIG9mIG5vcm1hbCBwcm9wZXJ0eSBhY2Nlc3MgbGlrZSBzLl9nZXRDc3MgYW5kXG4gICAgICAgICAgICAgZnVuY3Rpb24gY2FsbHMgbGlrZSBzLl9nZXRDc3MoKSBhcyBzYW1lLlxuICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQ2xhc3NlcyA9IF8uZ2V0KG1hcCwgYCR7b2JqZWN0TmFtZX0uY2xhc3Nlc2ApO1xuXG4gICAgICAgIGlmIChhdmFpbGFibGVDbGFzc2VzKSB7XG4gICAgICAgICAgaWYgKCFhdmFpbGFibGVDbGFzc2VzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUucHJvcGVydHksIGBDbGFzcyAnJHtwcm9wZXJ0eU5hbWV9JyBub3QgZm91bmRgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbWFyayBhcyB1c2VkXG4gICAgICAgICAgICBhdmFpbGFibGVDbGFzc2VzW3Byb3BlcnR5TmFtZV0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdQcm9ncmFtOmV4aXQnICgpIHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgYWxsIGNsYXNzZXMgZGVmaW5lZCBpbiBjc3Mvc2NzcyBmaWxlIGFyZSB1c2VkXG4gICAgICAgICovXG4gICAgICAgIF8uZm9yT3duKG1hcCwgKG8pID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNsYXNzZXMsIG5vZGUgfSA9IG87XG5cbiAgICAgICAgICAvLyBjbGFzc05hbWVzIG5vdCBtYXJrZWQgYXMgdHJ1ZSBhcmUgdW51c2VkXG4gICAgICAgICAgY29uc3QgdW51c2VkQ2xhc3NlcyA9IE9iamVjdC5rZXlzKF8ub21pdEJ5KGNsYXNzZXMsIG51bGwpKTtcblxuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHVudXNlZENsYXNzZXMpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCBgVW51c2VkIGNsYXNzZXMgZm91bmQ6ICR7dW51c2VkQ2xhc3Nlcy5qb2luKCcsICcpfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==