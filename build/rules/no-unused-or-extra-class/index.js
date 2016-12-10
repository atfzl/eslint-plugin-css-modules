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

        if (node.parent.type === 'CallExpression') {
          // must not be a function call, eg: s._getCss()
          return;
        }

        var objectName = node.object.name;

        var propertyName = node.property.name || // dot notation, s.header
        node.property.value; // square braces s['header']

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtb3ItZXh0cmEtY2xhc3MvaW5kZXguanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJkZWZhdWx0SW1wb3J0RGF0YSIsInZhcmlhYmxlTmFtZSIsInN0eWxlRmlsZVBhdGgiLCJwYXRoIiwiaW1wb3J0Tm9kZSIsInN0eWxlRmlsZUFic29sdXRlUGF0aCIsInJlc29sdmUiLCJjbGFzc05hbWVzTWFwIiwic2V0IiwiTWVtYmVyRXhwcmVzc2lvbiIsInBhcmVudCIsInR5cGUiLCJvYmplY3ROYW1lIiwib2JqZWN0IiwibmFtZSIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5IiwidmFsdWUiLCJhdmFpbGFibGVDbGFzc2VzIiwiZ2V0IiwiaGFzT3duUHJvcGVydHkiLCJyZXBvcnQiLCJmb3JPd24iLCJvIiwiY2xhc3NlcyIsInVudXNlZENsYXNzZXMiLCJPYmplY3QiLCJrZXlzIiwib21pdEJ5IiwiaXNFbXB0eSIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7Ozs7O2tCQUllO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSwwRUFEVDtBQUVKQyxtQkFBYTtBQUZUO0FBREYsR0FETztBQU9iQyxRQVBhLGtCQU9MQyxPQVBLLEVBT1k7QUFDdkIsUUFBTUMsVUFBVSxlQUFLQyxPQUFMLENBQWFGLFFBQVFHLFdBQVIsRUFBYixDQUFoQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFhQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUMwQjtBQUM3QixZQUFNQyxvQkFBb0Isc0NBQTBCRCxJQUExQixDQUExQjs7QUFFQSxZQUFJLENBQUNDLGlCQUFMLEVBQXdCO0FBQ3RCO0FBQ0Q7O0FBTDRCLFlBUTNCQyxZQVIyQixHQVd6QkQsaUJBWHlCLENBUTNCQyxZQVIyQjtBQUFBLFlBU3JCQyxhQVRxQixHQVd6QkYsaUJBWHlCLENBUzNCRyxJQVQyQjtBQUFBLFlBVTNCQyxVQVYyQixHQVd6QkosaUJBWHlCLENBVTNCSSxVQVYyQjs7O0FBYTdCLFlBQU1DLHdCQUF3QixlQUFLQyxPQUFMLENBQWFaLE9BQWIsRUFBc0JRLGFBQXRCLENBQTlCOztBQUVBOzs7QUFHQSxZQUFNSyxnQkFBZ0IsK0JBQWdCRixxQkFBaEIsQ0FBdEI7O0FBRUEseUJBQUVHLEdBQUYsQ0FBTVgsR0FBTixFQUFjSSxZQUFkLGVBQXNDTSxhQUF0Qzs7QUFFQTtBQUNBLHlCQUFFQyxHQUFGLENBQU1YLEdBQU4sRUFBY0ksWUFBZCxZQUFtQ0csVUFBbkM7QUFDRCxPQXpCSTs7QUEwQkxLLHdCQUFrQiwwQkFBQ1YsSUFBRCxFQUFnQjtBQUNoQzs7OztBQUlBLFlBQUlBLEtBQUtXLE1BQUwsQ0FBWUMsSUFBWixLQUFxQixnQkFBekIsRUFBMkM7QUFDekM7QUFDQTtBQUNEOztBQUVELFlBQU1DLGFBQWFiLEtBQUtjLE1BQUwsQ0FBWUMsSUFBL0I7O0FBRUEsWUFBTUMsZUFBZ0JoQixLQUFLaUIsUUFBTCxDQUFjRixJQUFkLElBQTBCO0FBQzFCZixhQUFLaUIsUUFBTCxDQUFjQyxLQURwQyxDQVpnQyxDQWFjOztBQUU5QyxZQUFNQyxtQkFBbUIsaUJBQUVDLEdBQUYsQ0FBTXRCLEdBQU4sRUFBY2UsVUFBZCxjQUF6Qjs7QUFFQSxZQUFJTSxnQkFBSixFQUFzQjtBQUNwQixjQUFJLENBQUNBLGlCQUFpQkUsY0FBakIsQ0FBZ0NMLFlBQWhDLENBQUwsRUFBb0Q7QUFDbER0QixvQkFBUTRCLE1BQVIsQ0FBZXRCLEtBQUtpQixRQUFwQixlQUF3Q0QsWUFBeEM7QUFDRCxXQUZELE1BRU87QUFDTDtBQUNBRyw2QkFBaUJILFlBQWpCLElBQWlDLElBQWpDO0FBQ0Q7QUFDRjtBQUNGLE9BbkRJO0FBb0RMLG9CQXBESyx5QkFvRGE7QUFDaEI7OztBQUdBLHlCQUFFTyxNQUFGLENBQVN6QixHQUFULEVBQWMsVUFBQzBCLENBQUQsRUFBTztBQUFBLGNBQ1hDLE9BRFcsR0FDT0QsQ0FEUCxDQUNYQyxPQURXO0FBQUEsY0FDRnpCLElBREUsR0FDT3dCLENBRFAsQ0FDRnhCLElBREU7O0FBR25COztBQUNBLGNBQU0wQixnQkFBZ0JDLE9BQU9DLElBQVAsQ0FBWSxpQkFBRUMsTUFBRixDQUFTSixPQUFULEVBQWtCLElBQWxCLENBQVosQ0FBdEI7O0FBRUEsY0FBSSxDQUFDLGlCQUFFSyxPQUFGLENBQVVKLGFBQVYsQ0FBTCxFQUErQjtBQUM3QmhDLG9CQUFRNEIsTUFBUixDQUFldEIsSUFBZiw2QkFBOEMwQixjQUFjSyxJQUFkLENBQW1CLElBQW5CLENBQTlDO0FBQ0Q7QUFDRixTQVREO0FBVUQ7QUFsRUksS0FBUDtBQW9FRDtBQTdGWSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgZ2V0RGVmYXVsdEltcG9ydFN0eWxlRGF0YSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IGdldFN0eWxlQ2xhc3NlcyBmcm9tICcuL2dldFN0eWxlQ2xhc3Nlcyc7XG5cbmltcG9ydCB0eXBlIHsgTm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtZXRhOiB7XG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246ICdDaGVja3MgdGhhdCB5b3UgYXJlIHVzaW5nIHRoZSBleGlzdGVudCBjc3Mvc2NzcyBjbGFzc2VzLCBubyBtb3JlIG5vIGxlc3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgfVxuICB9LFxuICBjcmVhdGUgKGNvbnRleHQ6IE9iamVjdCkge1xuICAgIGNvbnN0IGRpck5hbWUgPSBwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRGaWxlbmFtZSgpKTtcblxuICAgIC8qXG4gICAgICAgbWFwcyB2YXJpYWJsZSBuYW1lIHRvIHByb3BlcnR5IE9iamVjdFxuICAgICAgIG1hcCA9IHsgW3ZhcmlhYmxlTmFtZV06IHsgY2xhc3NlczogeyBmb286IHRydWUgfSwgbm9kZTogey4uLn0gfVxuXG4gICAgICAgZXhhbXBsZTpcbiAgICAgICBpbXBvcnQgcyBmcm9tICcuL2Zvby5zY3NzJztcbiAgICAgICBzIGlzIHZhcmlhYmxlIG5hbWVcblxuICAgICAgIHByb3BlcnR5IE9iamVjdCBoYXMgdHdvIGtleXNcbiAgICAgICAxLiBjbGFzc2VzOiBhbiBvYmplY3Qgd2l0aCBjbGFzc05hbWUgYXMga2V5IGFuZCBhIGJvb2xlYW4gYXMgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgVGhlIGJvb2xlYW4gaXMgbWFya2VkIGlmIGl0IGlzIHVzZWQgaW4gZmlsZVxuICAgICAgIDIuIG5vZGU6IG5vZGUgdGhhdCBjb3JyZXNwb25kIHRvIHMgKHNlZSBleGFtcGxlIGFib3ZlKVxuICAgICovXG4gICAgY29uc3QgbWFwID0ge307XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb24gKG5vZGU6IE5vZGUpIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdEltcG9ydERhdGEgPSBnZXREZWZhdWx0SW1wb3J0U3R5bGVEYXRhKG5vZGUpO1xuXG4gICAgICAgIGlmICghZGVmYXVsdEltcG9ydERhdGEpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgdmFyaWFibGVOYW1lLFxuICAgICAgICAgIHBhdGg6IHN0eWxlRmlsZVBhdGgsXG4gICAgICAgICAgaW1wb3J0Tm9kZSxcbiAgICAgICAgfSA9IGRlZmF1bHRJbXBvcnREYXRhO1xuXG4gICAgICAgIGNvbnN0IHN0eWxlRmlsZUFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShkaXJOYW1lLCBzdHlsZUZpbGVQYXRoKTtcblxuICAgICAgICAvKlxuICAgICAgICAgICBtYXBzIGNsYXNzTmFtZXMgd2l0aCBhIGJvb2xlYW4gdG8gbWFyayBhcyB1c2VkIGluIHNvdXJjZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY2xhc3NOYW1lc01hcCA9IGdldFN0eWxlQ2xhc3NlcyhzdHlsZUZpbGVBYnNvbHV0ZVBhdGgpO1xuXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7dmFyaWFibGVOYW1lfS5jbGFzc2VzYCwgY2xhc3NOYW1lc01hcCk7XG5cbiAgICAgICAgLy8gc2F2ZSBub2RlIGZvciByZXBvcnRpbmcgdW51c2VkIHN0eWxlc1xuICAgICAgICBfLnNldChtYXAsIGAke3ZhcmlhYmxlTmFtZX0ubm9kZWAsIGltcG9ydE5vZGUpO1xuICAgICAgfSxcbiAgICAgIE1lbWJlckV4cHJlc3Npb246IChub2RlOiBOb2RlKSA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAgIENoZWNrIGlmIHByb3BlcnR5IGV4aXN0cyBpbiBjc3Mvc2NzcyBmaWxlIGFzIGNsYXNzXG4gICAgICAgICAqL1xuXG4gICAgICAgIGlmIChub2RlLnBhcmVudC50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nKSB7XG4gICAgICAgICAgLy8gbXVzdCBub3QgYmUgYSBmdW5jdGlvbiBjYWxsLCBlZzogcy5fZ2V0Q3NzKClcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvYmplY3ROYW1lID0gbm9kZS5vYmplY3QubmFtZTtcblxuICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSAobm9kZS5wcm9wZXJ0eS5uYW1lIHx8ICAgICAvLyBkb3Qgbm90YXRpb24sIHMuaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnByb3BlcnR5LnZhbHVlKTsgICAvLyBzcXVhcmUgYnJhY2VzIHNbJ2hlYWRlciddXG5cbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQ2xhc3NlcyA9IF8uZ2V0KG1hcCwgYCR7b2JqZWN0TmFtZX0uY2xhc3Nlc2ApO1xuXG4gICAgICAgIGlmIChhdmFpbGFibGVDbGFzc2VzKSB7XG4gICAgICAgICAgaWYgKCFhdmFpbGFibGVDbGFzc2VzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUucHJvcGVydHksIGBDbGFzcyAnJHtwcm9wZXJ0eU5hbWV9JyBub3QgZm91bmRgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbWFyayBhcyB1c2VkXG4gICAgICAgICAgICBhdmFpbGFibGVDbGFzc2VzW3Byb3BlcnR5TmFtZV0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdQcm9ncmFtOmV4aXQnICgpIHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgYWxsIGNsYXNzZXMgZGVmaW5lZCBpbiBjc3Mvc2NzcyBmaWxlIGFyZSB1c2VkXG4gICAgICAgICovXG4gICAgICAgIF8uZm9yT3duKG1hcCwgKG8pID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNsYXNzZXMsIG5vZGUgfSA9IG87XG5cbiAgICAgICAgICAvLyBjbGFzc05hbWVzIG5vdCBtYXJrZWQgYXMgdHJ1ZSBhcmUgdW51c2VkXG4gICAgICAgICAgY29uc3QgdW51c2VkQ2xhc3NlcyA9IE9iamVjdC5rZXlzKF8ub21pdEJ5KGNsYXNzZXMsIG51bGwpKTtcblxuICAgICAgICAgIGlmICghXy5pc0VtcHR5KHVudXNlZENsYXNzZXMpKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCBgVW51c2VkIGNsYXNzZXMgZm91bmQ6ICR7dW51c2VkQ2xhc3Nlcy5qb2luKCcsICcpfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==