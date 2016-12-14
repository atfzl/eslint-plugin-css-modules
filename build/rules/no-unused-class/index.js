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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtY2xhc3MvaW5kZXguanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJzdHlsZUltcG9ydE5vZGVEYXRhIiwiaW1wb3J0TmFtZSIsInN0eWxlRmlsZVBhdGgiLCJpbXBvcnROb2RlIiwic3R5bGVGaWxlQWJzb2x1dGVQYXRoIiwicmVzb2x2ZSIsImNsYXNzTmFtZXNNYXAiLCJzZXQiLCJNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0TmFtZSIsIm9iamVjdCIsIm5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eSIsInZhbHVlIiwic3RhcnRzV2l0aCIsImF2YWlsYWJsZUNsYXNzZXMiLCJnZXQiLCJoYXNPd25Qcm9wZXJ0eSIsImZvck93biIsIm8iLCJjbGFzc2VzIiwidW51c2VkQ2xhc3NlcyIsIk9iamVjdCIsImtleXMiLCJvbWl0QnkiLCJpc0VtcHR5IiwicmVwb3J0Iiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O2tCQU9lO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSwwRUFEVDtBQUVKQyxtQkFBYTtBQUZUO0FBREYsR0FETztBQU9iQyxRQVBhLGtCQU9MQyxPQVBLLEVBT1k7QUFDdkIsUUFBTUMsVUFBVSxlQUFLQyxPQUFMLENBQWFGLFFBQVFHLFdBQVIsRUFBYixDQUFoQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFhQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUM0QjtBQUMvQixZQUFNQyxzQkFBc0Isa0NBQXVCRCxJQUF2QixDQUE1Qjs7QUFFQSxZQUFJLENBQUNDLG1CQUFMLEVBQTBCO0FBQ3hCO0FBQ0Q7O0FBTDhCLFlBUTdCQyxVQVI2QixHQVczQkQsbUJBWDJCLENBUTdCQyxVQVI2QjtBQUFBLFlBUzdCQyxhQVQ2QixHQVczQkYsbUJBWDJCLENBUzdCRSxhQVQ2QjtBQUFBLFlBVTdCQyxVQVY2QixHQVczQkgsbUJBWDJCLENBVTdCRyxVQVY2Qjs7O0FBYS9CLFlBQU1DLHdCQUF3QixlQUFLQyxPQUFMLENBQWFYLE9BQWIsRUFBc0JRLGFBQXRCLENBQTlCOztBQUVBOzs7QUFHQSxZQUFNSSxnQkFBZ0IsMkJBQWdCRixxQkFBaEIsQ0FBdEI7O0FBRUE7QUFDQSx5QkFBRUcsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsZUFBb0NLLGFBQXBDOztBQUVBO0FBQ0EseUJBQUVDLEdBQUYsQ0FBTVYsR0FBTixFQUFjSSxVQUFkLFlBQWlDRSxVQUFqQztBQUNELE9BMUJJOztBQTJCTEssd0JBQWtCLDBCQUFDVCxJQUFELEVBQWtCO0FBQ2xDOzs7O0FBSUEsWUFBTVUsYUFBYVYsS0FBS1csTUFBTCxDQUFZQyxJQUEvQjs7QUFFQSxZQUFNQyxlQUFnQmIsS0FBS2MsUUFBTCxDQUFjRixJQUFkLElBQTBCO0FBQzFCWixhQUFLYyxRQUFMLENBQWNDLEtBRHBDLENBUGtDLENBUVk7O0FBRTlDLFlBQUksQ0FBQ0YsWUFBRCxJQUFpQixpQkFBRUcsVUFBRixDQUFhSCxZQUFiLEVBQTJCLEdBQTNCLENBQXJCLEVBQXNEO0FBQ3BEOzs7Ozs7OztBQVNBO0FBQ0Q7O0FBRUQsWUFBTUksbUJBQW1CLGlCQUFFQyxHQUFGLENBQU1wQixHQUFOLEVBQWNZLFVBQWQsY0FBekI7O0FBRUEsWUFBSU8sb0JBQW9CQSxpQkFBaUJFLGNBQWpCLENBQWdDTixZQUFoQyxDQUF4QixFQUF1RTtBQUNyRTtBQUNBSSwyQkFBaUJKLFlBQWpCLElBQWlDLElBQWpDO0FBQ0Q7QUFDRixPQXhESTtBQXlETCxvQkF6REsseUJBeURhO0FBQ2hCOzs7QUFHQSx5QkFBRU8sTUFBRixDQUFTdEIsR0FBVCxFQUFjLFVBQUN1QixDQUFELEVBQU87QUFBQSxjQUNYQyxPQURXLEdBQ09ELENBRFAsQ0FDWEMsT0FEVztBQUFBLGNBQ0Z0QixJQURFLEdBQ09xQixDQURQLENBQ0ZyQixJQURFOztBQUduQjs7QUFDQSxjQUFNdUIsZ0JBQWdCQyxPQUFPQyxJQUFQLENBQVksaUJBQUVDLE1BQUYsQ0FBU0osT0FBVCxFQUFrQixJQUFsQixDQUFaLENBQXRCOztBQUVBLGNBQUksQ0FBQyxpQkFBRUssT0FBRixDQUFVSixhQUFWLENBQUwsRUFBK0I7QUFDN0I3QixvQkFBUWtDLE1BQVIsQ0FBZTVCLElBQWYsNkJBQThDdUIsY0FBY00sSUFBZCxDQUFtQixJQUFuQixDQUE5QztBQUNEO0FBQ0YsU0FURDtBQVVEO0FBdkVJLEtBQVA7QUF5RUQ7QUFsR1ksQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGdldFN0eWxlSW1wb3J0Tm9kZURhdGEsXG4gIGdldFN0eWxlQ2xhc3Nlcyxcbn0gZnJvbSAnLi4vLi4vY29yZSc7XG5cbmltcG9ydCB0eXBlIHsgSnNOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1ldGE6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0NoZWNrcyB0aGF0IHlvdSBhcmUgdXNpbmcgdGhlIGV4aXN0ZW50IGNzcy9zY3NzIGNsYXNzZXMsIG5vIG1vcmUgbm8gbGVzcycsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICB9XG4gIH0sXG4gIGNyZWF0ZSAoY29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgZGlyTmFtZSA9IHBhdGguZGlybmFtZShjb250ZXh0LmdldEZpbGVuYW1lKCkpO1xuXG4gICAgLypcbiAgICAgICBtYXBzIHZhcmlhYmxlIG5hbWUgdG8gcHJvcGVydHkgT2JqZWN0XG4gICAgICAgbWFwID0geyBbdmFyaWFibGVOYW1lXTogeyBjbGFzc2VzOiB7IGZvbzogdHJ1ZSB9LCBub2RlOiB7Li4ufSB9XG5cbiAgICAgICBleGFtcGxlOlxuICAgICAgIGltcG9ydCBzIGZyb20gJy4vZm9vLnNjc3MnO1xuICAgICAgIHMgaXMgdmFyaWFibGUgbmFtZVxuXG4gICAgICAgcHJvcGVydHkgT2JqZWN0IGhhcyB0d28ga2V5c1xuICAgICAgIDEuIGNsYXNzZXM6IGFuIG9iamVjdCB3aXRoIGNsYXNzTmFtZSBhcyBrZXkgYW5kIGEgYm9vbGVhbiBhcyB2YWx1ZS5cbiAgICAgICBUaGUgYm9vbGVhbiBpcyBtYXJrZWQgaWYgaXQgaXMgdXNlZCBpbiBmaWxlXG4gICAgICAgMi4gbm9kZTogbm9kZSB0aGF0IGNvcnJlc3BvbmQgdG8gcyAoc2VlIGV4YW1wbGUgYWJvdmUpXG4gICAgICovXG4gICAgY29uc3QgbWFwID0ge307XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb24gKG5vZGU6IEpzTm9kZSkge1xuICAgICAgICBjb25zdCBzdHlsZUltcG9ydE5vZGVEYXRhID0gZ2V0U3R5bGVJbXBvcnROb2RlRGF0YShub2RlKTtcblxuICAgICAgICBpZiAoIXN0eWxlSW1wb3J0Tm9kZURhdGEpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgaW1wb3J0TmFtZSxcbiAgICAgICAgICBzdHlsZUZpbGVQYXRoLFxuICAgICAgICAgIGltcG9ydE5vZGUsXG4gICAgICAgIH0gPSBzdHlsZUltcG9ydE5vZGVEYXRhO1xuXG4gICAgICAgIGNvbnN0IHN0eWxlRmlsZUFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShkaXJOYW1lLCBzdHlsZUZpbGVQYXRoKTtcblxuICAgICAgICAvKlxuICAgICAgICAgICBtYXBzIGNsYXNzTmFtZXMgd2l0aCBhIGJvb2xlYW4gdG8gbWFyayBhcyB1c2VkIGluIHNvdXJjZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY2xhc3NOYW1lc01hcCA9IGdldFN0eWxlQ2xhc3NlcyhzdHlsZUZpbGVBYnNvbHV0ZVBhdGgpO1xuXG4gICAgICAgIC8vIHRoaXMgd2lsbCBiZSB1c2VkIHRvIG1hcmsgcy5mb28gYXMgdXNlZCBpbiBNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7aW1wb3J0TmFtZX0uY2xhc3Nlc2AsIGNsYXNzTmFtZXNNYXApO1xuXG4gICAgICAgIC8vIHNhdmUgbm9kZSBmb3IgcmVwb3J0aW5nIHVudXNlZCBzdHlsZXNcbiAgICAgICAgXy5zZXQobWFwLCBgJHtpbXBvcnROYW1lfS5ub2RlYCwgaW1wb3J0Tm9kZSk7XG4gICAgICB9LFxuICAgICAgTWVtYmVyRXhwcmVzc2lvbjogKG5vZGU6IEpzTm9kZSkgPT4ge1xuICAgICAgICAvKlxuICAgICAgICAgICBDaGVjayBpZiBwcm9wZXJ0eSBleGlzdHMgaW4gY3NzL3Njc3MgZmlsZSBhcyBjbGFzc1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBvYmplY3ROYW1lID0gbm9kZS5vYmplY3QubmFtZTtcblxuICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSAobm9kZS5wcm9wZXJ0eS5uYW1lIHx8ICAgICAvLyBkb3Qgbm90YXRpb24sIHMuaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnByb3BlcnR5LnZhbHVlKTsgICAvLyBzcXVhcmUgYnJhY2VzIHNbJ2hlYWRlciddXG5cbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUgfHwgXy5zdGFydHNXaXRoKHByb3BlcnR5TmFtZSwgJ18nKSkge1xuICAgICAgICAgIC8qXG4gICAgICAgICAgICAgc2tpcCBwcm9wZXJ0eSBuYW1lcyBzdGFydGluZyB3aXRoIF9cbiAgICAgICAgICAgICBlZy4gc3BlY2lhbCBmdW5jdGlvbnMgcHJvdmlkZWRcbiAgICAgICAgICAgICBieSBjc3MgbW9kdWxlcyBsaWtlIF8uZ2V0Q3NzKClcblxuICAgICAgICAgICAgIFRyaWVkIHRvIGp1c3Qgc2tpcCBmdW5jdGlvbiBjYWxscywgYnV0IHRoZSBwYXJzZXJcbiAgICAgICAgICAgICB0aGlua3Mgb2Ygbm9ybWFsIHByb3BlcnR5IGFjY2VzcyBsaWtlIHMuX2dldENzcyBhbmRcbiAgICAgICAgICAgICBmdW5jdGlvbiBjYWxscyBsaWtlIHMuX2dldENzcygpIGFzIHNhbWUuXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQ2xhc3NlcyA9IF8uZ2V0KG1hcCwgYCR7b2JqZWN0TmFtZX0uY2xhc3Nlc2ApO1xuXG4gICAgICAgIGlmIChhdmFpbGFibGVDbGFzc2VzICYmIGF2YWlsYWJsZUNsYXNzZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgIC8vIG1hcmsgYXMgdXNlZFxuICAgICAgICAgIGF2YWlsYWJsZUNsYXNzZXNbcHJvcGVydHlOYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnUHJvZ3JhbTpleGl0JyAoKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAgIENoZWNrIGlmIGFsbCBjbGFzc2VzIGRlZmluZWQgaW4gY3NzL3Njc3MgZmlsZSBhcmUgdXNlZFxuICAgICAgICAgKi9cbiAgICAgICAgXy5mb3JPd24obWFwLCAobykgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgY2xhc3Nlcywgbm9kZSB9ID0gbztcblxuICAgICAgICAgIC8vIGNsYXNzTmFtZXMgbm90IG1hcmtlZCBhcyB0cnVlIGFyZSB1bnVzZWRcbiAgICAgICAgICBjb25zdCB1bnVzZWRDbGFzc2VzID0gT2JqZWN0LmtleXMoXy5vbWl0QnkoY2xhc3NlcywgbnVsbCkpO1xuXG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodW51c2VkQ2xhc3NlcykpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsIGBVbnVzZWQgY2xhc3NlcyBmb3VuZDogJHt1bnVzZWRDbGFzc2VzLmpvaW4oJywgJyl9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19