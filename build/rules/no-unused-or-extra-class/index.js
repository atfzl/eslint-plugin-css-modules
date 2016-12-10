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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtb3ItZXh0cmEtY2xhc3MvaW5kZXguanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJkZWZhdWx0SW1wb3J0RGF0YSIsInZhcmlhYmxlTmFtZSIsInN0eWxlRmlsZVBhdGgiLCJwYXRoIiwiaW1wb3J0Tm9kZSIsInN0eWxlRmlsZUFic29sdXRlUGF0aCIsInJlc29sdmUiLCJjbGFzc05hbWVzTWFwIiwic2V0IiwiTWVtYmVyRXhwcmVzc2lvbiIsIm9iamVjdE5hbWUiLCJvYmplY3QiLCJuYW1lIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHkiLCJ2YWx1ZSIsInN0YXJ0c1dpdGgiLCJhdmFpbGFibGVDbGFzc2VzIiwiZ2V0IiwiaGFzT3duUHJvcGVydHkiLCJyZXBvcnQiLCJmb3JPd24iLCJvIiwiY2xhc3NlcyIsInVudXNlZENsYXNzZXMiLCJPYmplY3QiLCJrZXlzIiwib21pdEJ5IiwiaXNFbXB0eSIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7Ozs7O2tCQUllO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSwwRUFEVDtBQUVKQyxtQkFBYTtBQUZUO0FBREYsR0FETztBQU9iQyxRQVBhLGtCQU9MQyxPQVBLLEVBT1k7QUFDdkIsUUFBTUMsVUFBVSxlQUFLQyxPQUFMLENBQWFGLFFBQVFHLFdBQVIsRUFBYixDQUFoQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFhQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUMwQjtBQUM3QixZQUFNQyxvQkFBb0Isc0NBQTBCRCxJQUExQixDQUExQjs7QUFFQSxZQUFJLENBQUNDLGlCQUFMLEVBQXdCO0FBQ3RCO0FBQ0Q7O0FBTDRCLFlBUTNCQyxZQVIyQixHQVd6QkQsaUJBWHlCLENBUTNCQyxZQVIyQjtBQUFBLFlBU3JCQyxhQVRxQixHQVd6QkYsaUJBWHlCLENBUzNCRyxJQVQyQjtBQUFBLFlBVTNCQyxVQVYyQixHQVd6QkosaUJBWHlCLENBVTNCSSxVQVYyQjs7O0FBYTdCLFlBQU1DLHdCQUF3QixlQUFLQyxPQUFMLENBQWFaLE9BQWIsRUFBc0JRLGFBQXRCLENBQTlCOztBQUVBOzs7QUFHQSxZQUFNSyxnQkFBZ0IsK0JBQWdCRixxQkFBaEIsQ0FBdEI7O0FBRUEseUJBQUVHLEdBQUYsQ0FBTVgsR0FBTixFQUFjSSxZQUFkLGVBQXNDTSxhQUF0Qzs7QUFFQTtBQUNBLHlCQUFFQyxHQUFGLENBQU1YLEdBQU4sRUFBY0ksWUFBZCxZQUFtQ0csVUFBbkM7QUFDRCxPQXpCSTs7QUEwQkxLLHdCQUFrQiwwQkFBQ1YsSUFBRCxFQUFnQjtBQUNoQzs7OztBQUlBLFlBQU1XLGFBQWFYLEtBQUtZLE1BQUwsQ0FBWUMsSUFBL0I7O0FBRUEsWUFBTUMsZUFBZ0JkLEtBQUtlLFFBQUwsQ0FBY0YsSUFBZCxJQUEwQjtBQUMxQmIsYUFBS2UsUUFBTCxDQUFjQyxLQURwQyxDQVBnQyxDQVFjOztBQUU5QyxZQUFJLENBQUNGLFlBQUQsSUFBaUIsaUJBQUVHLFVBQUYsQ0FBYUgsWUFBYixFQUEyQixHQUEzQixDQUFyQixFQUFzRDtBQUNwRDs7Ozs7Ozs7QUFTQTtBQUNEOztBQUVELFlBQU1JLG1CQUFtQixpQkFBRUMsR0FBRixDQUFNckIsR0FBTixFQUFjYSxVQUFkLGNBQXpCOztBQUVBLFlBQUlPLGdCQUFKLEVBQXNCO0FBQ3BCLGNBQUksQ0FBQ0EsaUJBQWlCRSxjQUFqQixDQUFnQ04sWUFBaEMsQ0FBTCxFQUFvRDtBQUNsRHBCLG9CQUFRMkIsTUFBUixDQUFlckIsS0FBS2UsUUFBcEIsZUFBd0NELFlBQXhDO0FBQ0QsV0FGRCxNQUVPO0FBQ0w7QUFDQUksNkJBQWlCSixZQUFqQixJQUFpQyxJQUFqQztBQUNEO0FBQ0Y7QUFDRixPQTNESTtBQTRETCxvQkE1REsseUJBNERhO0FBQ2hCOzs7QUFHQSx5QkFBRVEsTUFBRixDQUFTeEIsR0FBVCxFQUFjLFVBQUN5QixDQUFELEVBQU87QUFBQSxjQUNYQyxPQURXLEdBQ09ELENBRFAsQ0FDWEMsT0FEVztBQUFBLGNBQ0Z4QixJQURFLEdBQ091QixDQURQLENBQ0Z2QixJQURFOztBQUduQjs7QUFDQSxjQUFNeUIsZ0JBQWdCQyxPQUFPQyxJQUFQLENBQVksaUJBQUVDLE1BQUYsQ0FBU0osT0FBVCxFQUFrQixJQUFsQixDQUFaLENBQXRCOztBQUVBLGNBQUksQ0FBQyxpQkFBRUssT0FBRixDQUFVSixhQUFWLENBQUwsRUFBK0I7QUFDN0IvQixvQkFBUTJCLE1BQVIsQ0FBZXJCLElBQWYsNkJBQThDeUIsY0FBY0ssSUFBZCxDQUFtQixJQUFuQixDQUE5QztBQUNEO0FBQ0YsU0FURDtBQVVEO0FBMUVJLEtBQVA7QUE0RUQ7QUFyR1ksQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7IGdldERlZmF1bHRJbXBvcnRTdHlsZURhdGEgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBnZXRTdHlsZUNsYXNzZXMgZnJvbSAnLi9nZXRTdHlsZUNsYXNzZXMnO1xuXG5pbXBvcnQgdHlwZSB7IE5vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2hlY2tzIHRoYXQgeW91IGFyZSB1c2luZyB0aGUgZXhpc3RlbnQgY3NzL3Njc3MgY2xhc3Nlcywgbm8gbW9yZSBubyBsZXNzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH1cbiAgfSxcbiAgY3JlYXRlIChjb250ZXh0OiBPYmplY3QpIHtcbiAgICBjb25zdCBkaXJOYW1lID0gcGF0aC5kaXJuYW1lKGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG5cbiAgICAvKlxuICAgICAgIG1hcHMgdmFyaWFibGUgbmFtZSB0byBwcm9wZXJ0eSBPYmplY3RcbiAgICAgICBtYXAgPSB7IFt2YXJpYWJsZU5hbWVdOiB7IGNsYXNzZXM6IHsgZm9vOiB0cnVlIH0sIG5vZGU6IHsuLi59IH1cblxuICAgICAgIGV4YW1wbGU6XG4gICAgICAgaW1wb3J0IHMgZnJvbSAnLi9mb28uc2Nzcyc7XG4gICAgICAgcyBpcyB2YXJpYWJsZSBuYW1lXG5cbiAgICAgICBwcm9wZXJ0eSBPYmplY3QgaGFzIHR3byBrZXlzXG4gICAgICAgMS4gY2xhc3NlczogYW4gb2JqZWN0IHdpdGggY2xhc3NOYW1lIGFzIGtleSBhbmQgYSBib29sZWFuIGFzIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgIFRoZSBib29sZWFuIGlzIG1hcmtlZCBpZiBpdCBpcyB1c2VkIGluIGZpbGVcbiAgICAgICAyLiBub2RlOiBub2RlIHRoYXQgY29ycmVzcG9uZCB0byBzIChzZWUgZXhhbXBsZSBhYm92ZSlcbiAgICAqL1xuICAgIGNvbnN0IG1hcCA9IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uIChub2RlOiBOb2RlKSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRJbXBvcnREYXRhID0gZ2V0RGVmYXVsdEltcG9ydFN0eWxlRGF0YShub2RlKTtcblxuICAgICAgICBpZiAoIWRlZmF1bHRJbXBvcnREYXRhKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIHZhcmlhYmxlTmFtZSxcbiAgICAgICAgICBwYXRoOiBzdHlsZUZpbGVQYXRoLFxuICAgICAgICAgIGltcG9ydE5vZGUsXG4gICAgICAgIH0gPSBkZWZhdWx0SW1wb3J0RGF0YTtcblxuICAgICAgICBjb25zdCBzdHlsZUZpbGVBYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUoZGlyTmFtZSwgc3R5bGVGaWxlUGF0aCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgbWFwcyBjbGFzc05hbWVzIHdpdGggYSBib29sZWFuIHRvIG1hcmsgYXMgdXNlZCBpbiBzb3VyY2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZXNNYXAgPSBnZXRTdHlsZUNsYXNzZXMoc3R5bGVGaWxlQWJzb2x1dGVQYXRoKTtcblxuICAgICAgICBfLnNldChtYXAsIGAke3ZhcmlhYmxlTmFtZX0uY2xhc3Nlc2AsIGNsYXNzTmFtZXNNYXApO1xuXG4gICAgICAgIC8vIHNhdmUgbm9kZSBmb3IgcmVwb3J0aW5nIHVudXNlZCBzdHlsZXNcbiAgICAgICAgXy5zZXQobWFwLCBgJHt2YXJpYWJsZU5hbWV9Lm5vZGVgLCBpbXBvcnROb2RlKTtcbiAgICAgIH0sXG4gICAgICBNZW1iZXJFeHByZXNzaW9uOiAobm9kZTogTm9kZSkgPT4ge1xuICAgICAgICAvKlxuICAgICAgICAgICBDaGVjayBpZiBwcm9wZXJ0eSBleGlzdHMgaW4gY3NzL3Njc3MgZmlsZSBhcyBjbGFzc1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBvYmplY3ROYW1lID0gbm9kZS5vYmplY3QubmFtZTtcblxuICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSAobm9kZS5wcm9wZXJ0eS5uYW1lIHx8ICAgICAvLyBkb3Qgbm90YXRpb24sIHMuaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnByb3BlcnR5LnZhbHVlKTsgICAvLyBzcXVhcmUgYnJhY2VzIHNbJ2hlYWRlciddXG5cbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUgfHwgXy5zdGFydHNXaXRoKHByb3BlcnR5TmFtZSwgJ18nKSkge1xuICAgICAgICAgIC8qXG4gICAgICAgICAgICAgc2tpcCBwcm9wZXJ0eSBuYW1lcyBzdGFydGluZyB3aXRoIF9cbiAgICAgICAgICAgICBlZy4gc3BlY2lhbCBmdW5jdGlvbnMgcHJvdmlkZWRcbiAgICAgICAgICAgICBieSBjc3MgbW9kdWxlcyBsaWtlIF8uZ2V0Q3NzKClcblxuICAgICAgICAgICAgIFRyaWVkIHRvIGp1c3Qgc2tpcCBmdW5jdGlvbiBjYWxscywgYnV0IHRoZSBwYXJzZXJcbiAgICAgICAgICAgICB0aGlua3Mgb2Ygbm9ybWFsIHByb3BlcnR5IGFjY2VzcyBsaWtlIHMuX2dldENzcyBhbmRcbiAgICAgICAgICAgICBmdW5jdGlvbiBjYWxscyBsaWtlIHMuX2dldENzcygpIGFzIHNhbWUuXG4gICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdmFpbGFibGVDbGFzc2VzID0gXy5nZXQobWFwLCBgJHtvYmplY3ROYW1lfS5jbGFzc2VzYCk7XG5cbiAgICAgICAgaWYgKGF2YWlsYWJsZUNsYXNzZXMpIHtcbiAgICAgICAgICBpZiAoIWF2YWlsYWJsZUNsYXNzZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZS5wcm9wZXJ0eSwgYENsYXNzICcke3Byb3BlcnR5TmFtZX0nIG5vdCBmb3VuZGApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBtYXJrIGFzIHVzZWRcbiAgICAgICAgICAgIGF2YWlsYWJsZUNsYXNzZXNbcHJvcGVydHlOYW1lXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ1Byb2dyYW06ZXhpdCcgKCkge1xuICAgICAgICAvKlxuICAgICAgICAgICBDaGVjayBpZiBhbGwgY2xhc3NlcyBkZWZpbmVkIGluIGNzcy9zY3NzIGZpbGUgYXJlIHVzZWRcbiAgICAgICAgKi9cbiAgICAgICAgXy5mb3JPd24obWFwLCAobykgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgY2xhc3Nlcywgbm9kZSB9ID0gbztcblxuICAgICAgICAgIC8vIGNsYXNzTmFtZXMgbm90IG1hcmtlZCBhcyB0cnVlIGFyZSB1bnVzZWRcbiAgICAgICAgICBjb25zdCB1bnVzZWRDbGFzc2VzID0gT2JqZWN0LmtleXMoXy5vbWl0QnkoY2xhc3NlcywgbnVsbCkpO1xuXG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodW51c2VkQ2xhc3NlcykpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsIGBVbnVzZWQgY2xhc3NlcyBmb3VuZDogJHt1bnVzZWRDbGFzc2VzLmpvaW4oJywgJyl9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19