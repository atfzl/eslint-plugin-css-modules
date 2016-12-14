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
        var defaultImportData = (0, _core.getDefaultImportStyleData)(node);

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
        var classNamesMap = (0, _core.getStyleClasses)(styleFileAbsolutePath);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtb3ItZXh0cmEtY2xhc3MvaW5kZXguanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJkZWZhdWx0SW1wb3J0RGF0YSIsInZhcmlhYmxlTmFtZSIsInN0eWxlRmlsZVBhdGgiLCJwYXRoIiwiaW1wb3J0Tm9kZSIsInN0eWxlRmlsZUFic29sdXRlUGF0aCIsInJlc29sdmUiLCJjbGFzc05hbWVzTWFwIiwic2V0IiwiTWVtYmVyRXhwcmVzc2lvbiIsIm9iamVjdE5hbWUiLCJvYmplY3QiLCJuYW1lIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHkiLCJ2YWx1ZSIsInN0YXJ0c1dpdGgiLCJhdmFpbGFibGVDbGFzc2VzIiwiZ2V0IiwiaGFzT3duUHJvcGVydHkiLCJyZXBvcnQiLCJmb3JPd24iLCJvIiwiY2xhc3NlcyIsInVudXNlZENsYXNzZXMiLCJPYmplY3QiLCJrZXlzIiwib21pdEJ5IiwiaXNFbXB0eSIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztrQkFPZTtBQUNiQSxRQUFNO0FBQ0pDLFVBQU07QUFDSkMsbUJBQWEsMEVBRFQ7QUFFSkMsbUJBQWE7QUFGVDtBQURGLEdBRE87QUFPYkMsUUFQYSxrQkFPTEMsT0FQSyxFQU9ZO0FBQ3ZCLFFBQU1DLFVBQVUsZUFBS0MsT0FBTCxDQUFhRixRQUFRRyxXQUFSLEVBQWIsQ0FBaEI7O0FBRUE7Ozs7Ozs7Ozs7O0FBYUEsUUFBTUMsTUFBTSxFQUFaOztBQUVBLFdBQU87QUFDTEMsdUJBREssNkJBQ2NDLElBRGQsRUFDNEI7QUFDL0IsWUFBTUMsb0JBQW9CLHFDQUEwQkQsSUFBMUIsQ0FBMUI7O0FBRUEsWUFBSSxDQUFDQyxpQkFBTCxFQUF3QjtBQUN0QjtBQUNEOztBQUw4QixZQVE3QkMsWUFSNkIsR0FXM0JELGlCQVgyQixDQVE3QkMsWUFSNkI7QUFBQSxZQVN2QkMsYUFUdUIsR0FXM0JGLGlCQVgyQixDQVM3QkcsSUFUNkI7QUFBQSxZQVU3QkMsVUFWNkIsR0FXM0JKLGlCQVgyQixDQVU3QkksVUFWNkI7OztBQWEvQixZQUFNQyx3QkFBd0IsZUFBS0MsT0FBTCxDQUFhWixPQUFiLEVBQXNCUSxhQUF0QixDQUE5Qjs7QUFFQTs7O0FBR0EsWUFBTUssZ0JBQWdCLDJCQUFnQkYscUJBQWhCLENBQXRCOztBQUVBLHlCQUFFRyxHQUFGLENBQU1YLEdBQU4sRUFBY0ksWUFBZCxlQUFzQ00sYUFBdEM7O0FBRUE7QUFDQSx5QkFBRUMsR0FBRixDQUFNWCxHQUFOLEVBQWNJLFlBQWQsWUFBbUNHLFVBQW5DO0FBQ0QsT0F6Qkk7O0FBMEJMSyx3QkFBa0IsMEJBQUNWLElBQUQsRUFBa0I7QUFDbEM7Ozs7QUFJQSxZQUFNVyxhQUFhWCxLQUFLWSxNQUFMLENBQVlDLElBQS9COztBQUVBLFlBQU1DLGVBQWdCZCxLQUFLZSxRQUFMLENBQWNGLElBQWQsSUFBMEI7QUFDMUJiLGFBQUtlLFFBQUwsQ0FBY0MsS0FEcEMsQ0FQa0MsQ0FRWTs7QUFFOUMsWUFBSSxDQUFDRixZQUFELElBQWlCLGlCQUFFRyxVQUFGLENBQWFILFlBQWIsRUFBMkIsR0FBM0IsQ0FBckIsRUFBc0Q7QUFDcEQ7Ozs7Ozs7O0FBU0E7QUFDRDs7QUFFRCxZQUFNSSxtQkFBbUIsaUJBQUVDLEdBQUYsQ0FBTXJCLEdBQU4sRUFBY2EsVUFBZCxjQUF6Qjs7QUFFQSxZQUFJTyxnQkFBSixFQUFzQjtBQUNwQixjQUFJLENBQUNBLGlCQUFpQkUsY0FBakIsQ0FBZ0NOLFlBQWhDLENBQUwsRUFBb0Q7QUFDbERwQixvQkFBUTJCLE1BQVIsQ0FBZXJCLEtBQUtlLFFBQXBCLGVBQXdDRCxZQUF4QztBQUNELFdBRkQsTUFFTztBQUNMO0FBQ0FJLDZCQUFpQkosWUFBakIsSUFBaUMsSUFBakM7QUFDRDtBQUNGO0FBQ0YsT0EzREk7QUE0REwsb0JBNURLLHlCQTREYTtBQUNoQjs7O0FBR0EseUJBQUVRLE1BQUYsQ0FBU3hCLEdBQVQsRUFBYyxVQUFDeUIsQ0FBRCxFQUFPO0FBQUEsY0FDWEMsT0FEVyxHQUNPRCxDQURQLENBQ1hDLE9BRFc7QUFBQSxjQUNGeEIsSUFERSxHQUNPdUIsQ0FEUCxDQUNGdkIsSUFERTs7QUFHbkI7O0FBQ0EsY0FBTXlCLGdCQUFnQkMsT0FBT0MsSUFBUCxDQUFZLGlCQUFFQyxNQUFGLENBQVNKLE9BQVQsRUFBa0IsSUFBbEIsQ0FBWixDQUF0Qjs7QUFFQSxjQUFJLENBQUMsaUJBQUVLLE9BQUYsQ0FBVUosYUFBVixDQUFMLEVBQStCO0FBQzdCL0Isb0JBQVEyQixNQUFSLENBQWVyQixJQUFmLDZCQUE4Q3lCLGNBQWNLLElBQWQsQ0FBbUIsSUFBbkIsQ0FBOUM7QUFDRDtBQUNGLFNBVEQ7QUFVRDtBQTFFSSxLQUFQO0FBNEVEO0FBckdZLEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQge1xuICBnZXREZWZhdWx0SW1wb3J0U3R5bGVEYXRhLFxuICBnZXRTdHlsZUNsYXNzZXMsXG59IGZyb20gJy4uLy4uL2NvcmUnO1xuXG5pbXBvcnQgdHlwZSB7IEpzTm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtZXRhOiB7XG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246ICdDaGVja3MgdGhhdCB5b3UgYXJlIHVzaW5nIHRoZSBleGlzdGVudCBjc3Mvc2NzcyBjbGFzc2VzLCBubyBtb3JlIG5vIGxlc3MnLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgfVxuICB9LFxuICBjcmVhdGUgKGNvbnRleHQ6IE9iamVjdCkge1xuICAgIGNvbnN0IGRpck5hbWUgPSBwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRGaWxlbmFtZSgpKTtcblxuICAgIC8qXG4gICAgICAgbWFwcyB2YXJpYWJsZSBuYW1lIHRvIHByb3BlcnR5IE9iamVjdFxuICAgICAgIG1hcCA9IHsgW3ZhcmlhYmxlTmFtZV06IHsgY2xhc3NlczogeyBmb286IHRydWUgfSwgbm9kZTogey4uLn0gfVxuXG4gICAgICAgZXhhbXBsZTpcbiAgICAgICBpbXBvcnQgcyBmcm9tICcuL2Zvby5zY3NzJztcbiAgICAgICBzIGlzIHZhcmlhYmxlIG5hbWVcblxuICAgICAgIHByb3BlcnR5IE9iamVjdCBoYXMgdHdvIGtleXNcbiAgICAgICAxLiBjbGFzc2VzOiBhbiBvYmplY3Qgd2l0aCBjbGFzc05hbWUgYXMga2V5IGFuZCBhIGJvb2xlYW4gYXMgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgVGhlIGJvb2xlYW4gaXMgbWFya2VkIGlmIGl0IGlzIHVzZWQgaW4gZmlsZVxuICAgICAgIDIuIG5vZGU6IG5vZGUgdGhhdCBjb3JyZXNwb25kIHRvIHMgKHNlZSBleGFtcGxlIGFib3ZlKVxuICAgICovXG4gICAgY29uc3QgbWFwID0ge307XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb24gKG5vZGU6IEpzTm9kZSkge1xuICAgICAgICBjb25zdCBkZWZhdWx0SW1wb3J0RGF0YSA9IGdldERlZmF1bHRJbXBvcnRTdHlsZURhdGEobm9kZSk7XG5cbiAgICAgICAgaWYgKCFkZWZhdWx0SW1wb3J0RGF0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICB2YXJpYWJsZU5hbWUsXG4gICAgICAgICAgcGF0aDogc3R5bGVGaWxlUGF0aCxcbiAgICAgICAgICBpbXBvcnROb2RlLFxuICAgICAgICB9ID0gZGVmYXVsdEltcG9ydERhdGE7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVGaWxlQWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpck5hbWUsIHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgIG1hcHMgY2xhc3NOYW1lcyB3aXRoIGEgYm9vbGVhbiB0byBtYXJrIGFzIHVzZWQgaW4gc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjbGFzc05hbWVzTWFwID0gZ2V0U3R5bGVDbGFzc2VzKHN0eWxlRmlsZUFic29sdXRlUGF0aCk7XG5cbiAgICAgICAgXy5zZXQobWFwLCBgJHt2YXJpYWJsZU5hbWV9LmNsYXNzZXNgLCBjbGFzc05hbWVzTWFwKTtcblxuICAgICAgICAvLyBzYXZlIG5vZGUgZm9yIHJlcG9ydGluZyB1bnVzZWQgc3R5bGVzXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7dmFyaWFibGVOYW1lfS5ub2RlYCwgaW1wb3J0Tm9kZSk7XG4gICAgICB9LFxuICAgICAgTWVtYmVyRXhwcmVzc2lvbjogKG5vZGU6IEpzTm9kZSkgPT4ge1xuICAgICAgICAvKlxuICAgICAgICAgICBDaGVjayBpZiBwcm9wZXJ0eSBleGlzdHMgaW4gY3NzL3Njc3MgZmlsZSBhcyBjbGFzc1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBvYmplY3ROYW1lID0gbm9kZS5vYmplY3QubmFtZTtcblxuICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSAobm9kZS5wcm9wZXJ0eS5uYW1lIHx8ICAgICAvLyBkb3Qgbm90YXRpb24sIHMuaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnByb3BlcnR5LnZhbHVlKTsgICAvLyBzcXVhcmUgYnJhY2VzIHNbJ2hlYWRlciddXG5cbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUgfHwgXy5zdGFydHNXaXRoKHByb3BlcnR5TmFtZSwgJ18nKSkge1xuICAgICAgICAgIC8qXG4gICAgICAgICAgICAgc2tpcCBwcm9wZXJ0eSBuYW1lcyBzdGFydGluZyB3aXRoIF9cbiAgICAgICAgICAgICBlZy4gc3BlY2lhbCBmdW5jdGlvbnMgcHJvdmlkZWRcbiAgICAgICAgICAgICBieSBjc3MgbW9kdWxlcyBsaWtlIF8uZ2V0Q3NzKClcblxuICAgICAgICAgICAgIFRyaWVkIHRvIGp1c3Qgc2tpcCBmdW5jdGlvbiBjYWxscywgYnV0IHRoZSBwYXJzZXJcbiAgICAgICAgICAgICB0aGlua3Mgb2Ygbm9ybWFsIHByb3BlcnR5IGFjY2VzcyBsaWtlIHMuX2dldENzcyBhbmRcbiAgICAgICAgICAgICBmdW5jdGlvbiBjYWxscyBsaWtlIHMuX2dldENzcygpIGFzIHNhbWUuXG4gICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdmFpbGFibGVDbGFzc2VzID0gXy5nZXQobWFwLCBgJHtvYmplY3ROYW1lfS5jbGFzc2VzYCk7XG5cbiAgICAgICAgaWYgKGF2YWlsYWJsZUNsYXNzZXMpIHtcbiAgICAgICAgICBpZiAoIWF2YWlsYWJsZUNsYXNzZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZS5wcm9wZXJ0eSwgYENsYXNzICcke3Byb3BlcnR5TmFtZX0nIG5vdCBmb3VuZGApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBtYXJrIGFzIHVzZWRcbiAgICAgICAgICAgIGF2YWlsYWJsZUNsYXNzZXNbcHJvcGVydHlOYW1lXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ1Byb2dyYW06ZXhpdCcgKCkge1xuICAgICAgICAvKlxuICAgICAgICAgICBDaGVjayBpZiBhbGwgY2xhc3NlcyBkZWZpbmVkIGluIGNzcy9zY3NzIGZpbGUgYXJlIHVzZWRcbiAgICAgICAgKi9cbiAgICAgICAgXy5mb3JPd24obWFwLCAobykgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgY2xhc3Nlcywgbm9kZSB9ID0gbztcblxuICAgICAgICAgIC8vIGNsYXNzTmFtZXMgbm90IG1hcmtlZCBhcyB0cnVlIGFyZSB1bnVzZWRcbiAgICAgICAgICBjb25zdCB1bnVzZWRDbGFzc2VzID0gT2JqZWN0LmtleXMoXy5vbWl0QnkoY2xhc3NlcywgbnVsbCkpO1xuXG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodW51c2VkQ2xhc3NlcykpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsIGBVbnVzZWQgY2xhc3NlcyBmb3VuZDogJHt1bnVzZWRDbGFzc2VzLmpvaW4oJywgJyl9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19