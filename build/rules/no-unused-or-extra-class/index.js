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

        var propertyName = node.property.name || node.property.value;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtb3ItZXh0cmEtY2xhc3MvaW5kZXguanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJkZWZhdWx0SW1wb3J0RGF0YSIsInZhcmlhYmxlTmFtZSIsInN0eWxlRmlsZVBhdGgiLCJwYXRoIiwiaW1wb3J0Tm9kZSIsInN0eWxlRmlsZUFic29sdXRlUGF0aCIsInJlc29sdmUiLCJjbGFzc05hbWVzTWFwIiwic2V0IiwiTWVtYmVyRXhwcmVzc2lvbiIsIm9iamVjdE5hbWUiLCJvYmplY3QiLCJuYW1lIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHkiLCJ2YWx1ZSIsImF2YWlsYWJsZUNsYXNzZXMiLCJnZXQiLCJoYXNPd25Qcm9wZXJ0eSIsInJlcG9ydCIsImZvck93biIsIm8iLCJjbGFzc2VzIiwidW51c2VkQ2xhc3NlcyIsIk9iamVjdCIsImtleXMiLCJvbWl0QnkiLCJpc0VtcHR5Iiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOzs7Ozs7a0JBSWU7QUFDYkEsUUFBTTtBQUNKQyxVQUFNO0FBQ0pDLG1CQUFhLDBFQURUO0FBRUpDLG1CQUFhO0FBRlQ7QUFERixHQURPO0FBT2JDLFFBUGEsa0JBT0xDLE9BUEssRUFPWTtBQUN2QixRQUFNQyxVQUFVLGVBQUtDLE9BQUwsQ0FBYUYsUUFBUUcsV0FBUixFQUFiLENBQWhCOztBQUVBOzs7Ozs7Ozs7OztBQWFBLFFBQU1DLE1BQU0sRUFBWjs7QUFFQSxXQUFPO0FBQ0xDLHVCQURLLDZCQUNjQyxJQURkLEVBQzBCO0FBQzdCLFlBQU1DLG9CQUFvQixzQ0FBMEJELElBQTFCLENBQTFCOztBQUVBLFlBQUksQ0FBQ0MsaUJBQUwsRUFBd0I7QUFDdEI7QUFDRDs7QUFMNEIsWUFRM0JDLFlBUjJCLEdBV3pCRCxpQkFYeUIsQ0FRM0JDLFlBUjJCO0FBQUEsWUFTckJDLGFBVHFCLEdBV3pCRixpQkFYeUIsQ0FTM0JHLElBVDJCO0FBQUEsWUFVM0JDLFVBVjJCLEdBV3pCSixpQkFYeUIsQ0FVM0JJLFVBVjJCOzs7QUFhN0IsWUFBTUMsd0JBQXdCLGVBQUtDLE9BQUwsQ0FBYVosT0FBYixFQUFzQlEsYUFBdEIsQ0FBOUI7O0FBRUE7OztBQUdBLFlBQU1LLGdCQUFnQiwrQkFBZ0JGLHFCQUFoQixDQUF0Qjs7QUFFQSx5QkFBRUcsR0FBRixDQUFNWCxHQUFOLEVBQWNJLFlBQWQsZUFBc0NNLGFBQXRDOztBQUVBO0FBQ0EseUJBQUVDLEdBQUYsQ0FBTVgsR0FBTixFQUFjSSxZQUFkLFlBQW1DRyxVQUFuQztBQUNELE9BekJJOztBQTBCTEssd0JBQWtCLDBCQUFDVixJQUFELEVBQWdCO0FBQ2hDOzs7QUFHQSxZQUFNVyxhQUFhWCxLQUFLWSxNQUFMLENBQVlDLElBQS9COztBQUVBLFlBQU1DLGVBQWVkLEtBQUtlLFFBQUwsQ0FBY0YsSUFBZCxJQUFzQmIsS0FBS2UsUUFBTCxDQUFjQyxLQUF6RDs7QUFFQSxZQUFNQyxtQkFBbUIsaUJBQUVDLEdBQUYsQ0FBTXBCLEdBQU4sRUFBY2EsVUFBZCxjQUF6Qjs7QUFFQSxZQUFJTSxnQkFBSixFQUFzQjtBQUNwQixjQUFJLENBQUNBLGlCQUFpQkUsY0FBakIsQ0FBZ0NMLFlBQWhDLENBQUwsRUFBb0Q7QUFDbERwQixvQkFBUTBCLE1BQVIsQ0FBZXBCLEtBQUtlLFFBQXBCLGVBQXdDRCxZQUF4QztBQUNELFdBRkQsTUFFTztBQUNMO0FBQ0FHLDZCQUFpQkgsWUFBakIsSUFBaUMsSUFBakM7QUFDRDtBQUNGO0FBQ0YsT0E1Q0k7QUE2Q0wsb0JBN0NLLHlCQTZDYTtBQUNoQjs7O0FBR0EseUJBQUVPLE1BQUYsQ0FBU3ZCLEdBQVQsRUFBYyxVQUFDd0IsQ0FBRCxFQUFPO0FBQUEsY0FDWEMsT0FEVyxHQUNPRCxDQURQLENBQ1hDLE9BRFc7QUFBQSxjQUNGdkIsSUFERSxHQUNPc0IsQ0FEUCxDQUNGdEIsSUFERTs7QUFHbkI7O0FBQ0EsY0FBTXdCLGdCQUFnQkMsT0FBT0MsSUFBUCxDQUFZLGlCQUFFQyxNQUFGLENBQVNKLE9BQVQsRUFBa0IsSUFBbEIsQ0FBWixDQUF0Qjs7QUFFQSxjQUFJLENBQUMsaUJBQUVLLE9BQUYsQ0FBVUosYUFBVixDQUFMLEVBQStCO0FBQzdCOUIsb0JBQVEwQixNQUFSLENBQWVwQixJQUFmLDZCQUE4Q3dCLGNBQWNLLElBQWQsQ0FBbUIsSUFBbkIsQ0FBOUM7QUFDRDtBQUNGLFNBVEQ7QUFVRDtBQTNESSxLQUFQO0FBNkREO0FBdEZZLEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyBnZXREZWZhdWx0SW1wb3J0U3R5bGVEYXRhIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgZ2V0U3R5bGVDbGFzc2VzIGZyb20gJy4vZ2V0U3R5bGVDbGFzc2VzJztcblxuaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1ldGE6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0NoZWNrcyB0aGF0IHlvdSBhcmUgdXNpbmcgdGhlIGV4aXN0ZW50IGNzcy9zY3NzIGNsYXNzZXMsIG5vIG1vcmUgbm8gbGVzcycsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICB9XG4gIH0sXG4gIGNyZWF0ZSAoY29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgZGlyTmFtZSA9IHBhdGguZGlybmFtZShjb250ZXh0LmdldEZpbGVuYW1lKCkpO1xuXG4gICAgLypcbiAgICAgICBtYXBzIHZhcmlhYmxlIG5hbWUgdG8gcHJvcGVydHkgT2JqZWN0XG4gICAgICAgbWFwID0geyBbdmFyaWFibGVOYW1lXTogeyBjbGFzc2VzOiB7IGZvbzogdHJ1ZSB9LCBub2RlOiB7Li4ufSB9XG5cbiAgICAgICBleGFtcGxlOlxuICAgICAgIGltcG9ydCBzIGZyb20gJy4vZm9vLnNjc3MnO1xuICAgICAgIHMgaXMgdmFyaWFibGUgbmFtZVxuXG4gICAgICAgcHJvcGVydHkgT2JqZWN0IGhhcyB0d28ga2V5c1xuICAgICAgIDEuIGNsYXNzZXM6IGFuIG9iamVjdCB3aXRoIGNsYXNzTmFtZSBhcyBrZXkgYW5kIGEgYm9vbGVhbiBhcyB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICBUaGUgYm9vbGVhbiBpcyBtYXJrZWQgaWYgaXQgaXMgdXNlZCBpbiBmaWxlXG4gICAgICAgMi4gbm9kZTogbm9kZSB0aGF0IGNvcnJlc3BvbmQgdG8gcyAoc2VlIGV4YW1wbGUgYWJvdmUpXG4gICAgKi9cbiAgICBjb25zdCBtYXAgPSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbiAobm9kZTogTm9kZSkge1xuICAgICAgICBjb25zdCBkZWZhdWx0SW1wb3J0RGF0YSA9IGdldERlZmF1bHRJbXBvcnRTdHlsZURhdGEobm9kZSk7XG5cbiAgICAgICAgaWYgKCFkZWZhdWx0SW1wb3J0RGF0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICB2YXJpYWJsZU5hbWUsXG4gICAgICAgICAgcGF0aDogc3R5bGVGaWxlUGF0aCxcbiAgICAgICAgICBpbXBvcnROb2RlLFxuICAgICAgICB9ID0gZGVmYXVsdEltcG9ydERhdGE7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVGaWxlQWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpck5hbWUsIHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgIG1hcHMgY2xhc3NOYW1lcyB3aXRoIGEgYm9vbGVhbiB0byBtYXJrIGFzIHVzZWQgaW4gc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjbGFzc05hbWVzTWFwID0gZ2V0U3R5bGVDbGFzc2VzKHN0eWxlRmlsZUFic29sdXRlUGF0aCk7XG5cbiAgICAgICAgXy5zZXQobWFwLCBgJHt2YXJpYWJsZU5hbWV9LmNsYXNzZXNgLCBjbGFzc05hbWVzTWFwKTtcblxuICAgICAgICAvLyBzYXZlIG5vZGUgZm9yIHJlcG9ydGluZyB1bnVzZWQgc3R5bGVzXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7dmFyaWFibGVOYW1lfS5ub2RlYCwgaW1wb3J0Tm9kZSk7XG4gICAgICB9LFxuICAgICAgTWVtYmVyRXhwcmVzc2lvbjogKG5vZGU6IE5vZGUpID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgcHJvcGVydHkgZXhpc3RzIGluIGNzcy9zY3NzIGZpbGUgYXMgY2xhc3NcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9iamVjdE5hbWUgPSBub2RlLm9iamVjdC5uYW1lO1xuXG4gICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IG5vZGUucHJvcGVydHkubmFtZSB8fCBub2RlLnByb3BlcnR5LnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZUNsYXNzZXMgPSBfLmdldChtYXAsIGAke29iamVjdE5hbWV9LmNsYXNzZXNgKTtcblxuICAgICAgICBpZiAoYXZhaWxhYmxlQ2xhc3Nlcykge1xuICAgICAgICAgIGlmICghYXZhaWxhYmxlQ2xhc3Nlcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLnByb3BlcnR5LCBgQ2xhc3MgJyR7cHJvcGVydHlOYW1lfScgbm90IGZvdW5kYCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG1hcmsgYXMgdXNlZFxuICAgICAgICAgICAgYXZhaWxhYmxlQ2xhc3Nlc1twcm9wZXJ0eU5hbWVdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnUHJvZ3JhbTpleGl0JyAoKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAgIENoZWNrIGlmIGFsbCBjbGFzc2VzIGRlZmluZWQgaW4gY3NzL3Njc3MgZmlsZSBhcmUgdXNlZFxuICAgICAgICAqL1xuICAgICAgICBfLmZvck93bihtYXAsIChvKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBjbGFzc2VzLCBub2RlIH0gPSBvO1xuXG4gICAgICAgICAgLy8gY2xhc3NOYW1lcyBub3QgbWFya2VkIGFzIHRydWUgYXJlIHVudXNlZFxuICAgICAgICAgIGNvbnN0IHVudXNlZENsYXNzZXMgPSBPYmplY3Qua2V5cyhfLm9taXRCeShjbGFzc2VzLCBudWxsKSk7XG5cbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh1bnVzZWRDbGFzc2VzKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZSwgYFVudXNlZCBjbGFzc2VzIGZvdW5kOiAke3VudXNlZENsYXNzZXMuam9pbignLCAnKX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=