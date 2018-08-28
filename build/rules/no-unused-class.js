'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _core = require('../core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  meta: {
    docs: {
      description: 'Checks that you are using all css/scss/less classes',
      recommended: true
    },
    schema: [{
      type: 'object',
      properties: {
        camelCase: { enum: [true, 'dashes', 'only', 'dashes-only'] },
        markAsUsed: { type: 'array' }
      }
    }]
  },
  create: function create(context) {
    var markAsUsed = _lodash2.default.get(context, 'options[0].markAsUsed');
    var camelCase = _lodash2.default.get(context, 'options[0].camelCase');

    /*
       maps variable name to property Object
       map = {
         [variableName]: {
           classes: { foo: false, 'foo-bar': false },
           classesMap: { foo: 'foo', fooBar: 'foo-bar', 'foo-bar': 'foo-bar' },
           node: {...}
         }
       }
        example:
       import s from './foo.scss';
       s is variable name
        property Object has two keys
       1. classes: an object with className as key and a boolean as value. The boolean is marked if it is used in file
       2. classesMap: an object with propertyName as key and its className as value
       3. node: node that correspond to s (see example above)
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


        var styleFileAbsolutePath = (0, _core.getFilePath)(context, styleFilePath);

        // this will be used to mark s.foo as used in MemberExpression
        var classes = (0, _core.getStyleClasses)(styleFileAbsolutePath);
        var classesMap = classes && (0, _core.getClassesMap)(classes, camelCase);

        _lodash2.default.set(map, importName + '.classes', classes);
        _lodash2.default.set(map, importName + '.classesMap', classesMap);

        // save node for reporting unused styles
        _lodash2.default.set(map, importName + '.node', importNode);
      },

      MemberExpression: function MemberExpression(node) {
        /*
           Check if property exists in css/scss file as class
         */

        var objectName = node.object.name;
        var propertyName = (0, _core.getPropertyName)(node, camelCase);

        if (!propertyName) {
          return;
        }

        var className = _lodash2.default.get(map, objectName + '.classesMap.' + propertyName);

        if (className == null) {
          return;
        }

        // mark this property has used
        _lodash2.default.set(map, objectName + '.classes.' + className, true);
      },
      'Program:exit': function ProgramExit() {
        /*
           Check if all classes defined in css/scss file are used
         */

        /*
           we are looping over each import style node in program
           example:
           ```
             import s from './foo.css';
             import x from './bar.scss';
           ```
           then the loop will be run 2 times
         */
        _lodash2.default.forIn(map, function (o) {
          var classes = o.classes,
              node = o.node;

          /*
             if option is passed to mark a class as used, example:
             eslint css-modules/no-unused-class: [2, { markAsUsed: ['container'] }]
           */

          _lodash2.default.forEach(markAsUsed, function (usedClass) {
            classes[usedClass] = true;
          });

          // classNames not marked as true are unused
          var unusedClasses = _fp2.default.compose(_fp2.default.keys, _fp2.default.omitBy(_fp2.default.identity))(classes);

          if (!_lodash2.default.isEmpty(unusedClasses)) {
            context.report(node, 'Unused classes found: ' + unusedClasses.join(', '));
          }
        });
      }
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtY2xhc3MuanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwic2NoZW1hIiwidHlwZSIsInByb3BlcnRpZXMiLCJjYW1lbENhc2UiLCJlbnVtIiwibWFya0FzVXNlZCIsImNyZWF0ZSIsImNvbnRleHQiLCJnZXQiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJzdHlsZUltcG9ydE5vZGVEYXRhIiwiaW1wb3J0TmFtZSIsInN0eWxlRmlsZVBhdGgiLCJpbXBvcnROb2RlIiwic3R5bGVGaWxlQWJzb2x1dGVQYXRoIiwiY2xhc3NlcyIsImNsYXNzZXNNYXAiLCJzZXQiLCJNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0TmFtZSIsIm9iamVjdCIsIm5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJjbGFzc05hbWUiLCJmb3JJbiIsIm8iLCJmb3JFYWNoIiwidXNlZENsYXNzIiwidW51c2VkQ2xhc3NlcyIsImNvbXBvc2UiLCJrZXlzIiwib21pdEJ5IiwiaWRlbnRpdHkiLCJpc0VtcHR5IiwicmVwb3J0Iiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O2tCQVVlO0FBQ2JBLFFBQU07QUFDSkMsVUFBTTtBQUNKQyxtQkFBYSxxREFEVDtBQUVKQyxtQkFBYTtBQUZULEtBREY7QUFLSkMsWUFBUSxDQUNOO0FBQ0VDLFlBQU0sUUFEUjtBQUVFQyxrQkFBWTtBQUNWQyxtQkFBVyxFQUFFQyxNQUFNLENBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsTUFBakIsRUFBeUIsYUFBekIsQ0FBUixFQUREO0FBRVZDLG9CQUFZLEVBQUVKLE1BQU0sT0FBUjtBQUZGO0FBRmQsS0FETTtBQUxKLEdBRE87QUFnQmJLLFFBaEJhLGtCQWdCTEMsT0FoQkssRUFnQlk7QUFDdkIsUUFBTUYsYUFBYSxpQkFBRUcsR0FBRixDQUFNRCxPQUFOLEVBQWUsdUJBQWYsQ0FBbkI7QUFDQSxRQUFNSixZQUFZLGlCQUFFSyxHQUFGLENBQU1ELE9BQU4sRUFBZSxzQkFBZixDQUFsQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsUUFBTUUsTUFBTSxFQUFaOztBQUVBLFdBQU87QUFDTEMsdUJBREssNkJBQ2NDLElBRGQsRUFDNEI7QUFDL0IsWUFBTUMsc0JBQXNCLGtDQUF1QkQsSUFBdkIsQ0FBNUI7O0FBRUEsWUFBSSxDQUFDQyxtQkFBTCxFQUEwQjtBQUN4QjtBQUNEOztBQUw4QixZQVE3QkMsVUFSNkIsR0FXM0JELG1CQVgyQixDQVE3QkMsVUFSNkI7QUFBQSxZQVM3QkMsYUFUNkIsR0FXM0JGLG1CQVgyQixDQVM3QkUsYUFUNkI7QUFBQSxZQVU3QkMsVUFWNkIsR0FXM0JILG1CQVgyQixDQVU3QkcsVUFWNkI7OztBQWEvQixZQUFNQyx3QkFBd0IsdUJBQVlULE9BQVosRUFBcUJPLGFBQXJCLENBQTlCOztBQUVBO0FBQ0EsWUFBTUcsVUFBVSwyQkFBZ0JELHFCQUFoQixDQUFoQjtBQUNBLFlBQU1FLGFBQWFELFdBQVcseUJBQWNBLE9BQWQsRUFBdUJkLFNBQXZCLENBQTlCOztBQUVBLHlCQUFFZ0IsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsZUFBb0NJLE9BQXBDO0FBQ0EseUJBQUVFLEdBQUYsQ0FBTVYsR0FBTixFQUFjSSxVQUFkLGtCQUF1Q0ssVUFBdkM7O0FBRUE7QUFDQSx5QkFBRUMsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsWUFBaUNFLFVBQWpDO0FBQ0QsT0F6Qkk7O0FBMEJMSyx3QkFBa0IsMEJBQUNULElBQUQsRUFBa0I7QUFDbEM7Ozs7QUFJQSxZQUFNVSxhQUFhVixLQUFLVyxNQUFMLENBQVlDLElBQS9CO0FBQ0EsWUFBTUMsZUFBZSwyQkFBZ0JiLElBQWhCLEVBQXNCUixTQUF0QixDQUFyQjs7QUFFQSxZQUFJLENBQUNxQixZQUFMLEVBQW1CO0FBQ2pCO0FBQ0Q7O0FBRUQsWUFBTUMsWUFBWSxpQkFBRWpCLEdBQUYsQ0FBTUMsR0FBTixFQUFjWSxVQUFkLG9CQUF1Q0csWUFBdkMsQ0FBbEI7O0FBRUEsWUFBSUMsYUFBYSxJQUFqQixFQUF1QjtBQUNyQjtBQUNEOztBQUVEO0FBQ0EseUJBQUVOLEdBQUYsQ0FBTVYsR0FBTixFQUFjWSxVQUFkLGlCQUFvQ0ksU0FBcEMsRUFBaUQsSUFBakQ7QUFDRCxPQTlDSTtBQStDTCxvQkEvQ0sseUJBK0NhO0FBQ2hCOzs7O0FBSUE7Ozs7Ozs7OztBQVNBLHlCQUFFQyxLQUFGLENBQVFqQixHQUFSLEVBQWEsVUFBQ2tCLENBQUQsRUFBTztBQUFBLGNBQ1ZWLE9BRFUsR0FDUVUsQ0FEUixDQUNWVixPQURVO0FBQUEsY0FDRE4sSUFEQyxHQUNRZ0IsQ0FEUixDQUNEaEIsSUFEQzs7QUFHbEI7Ozs7O0FBSUEsMkJBQUVpQixPQUFGLENBQVV2QixVQUFWLEVBQXNCLFVBQUN3QixTQUFELEVBQWU7QUFDbkNaLG9CQUFRWSxTQUFSLElBQXFCLElBQXJCO0FBQ0QsV0FGRDs7QUFJQTtBQUNBLGNBQU1DLGdCQUFnQixhQUFHQyxPQUFILENBQ3BCLGFBQUdDLElBRGlCLEVBRXBCLGFBQUdDLE1BQUgsQ0FBVSxhQUFHQyxRQUFiLENBRm9CLEVBR3BCakIsT0FIb0IsQ0FBdEI7O0FBS0EsY0FBSSxDQUFDLGlCQUFFa0IsT0FBRixDQUFVTCxhQUFWLENBQUwsRUFBK0I7QUFDN0J2QixvQkFBUTZCLE1BQVIsQ0FBZXpCLElBQWYsNkJBQThDbUIsY0FBY08sSUFBZCxDQUFtQixJQUFuQixDQUE5QztBQUNEO0FBQ0YsU0FwQkQ7QUFxQkQ7QUFsRkksS0FBUDtBQW9GRDtBQTdIWSxDIiwiZmlsZSI6Im5vLXVudXNlZC1jbGFzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgZnAgZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGdldFN0eWxlSW1wb3J0Tm9kZURhdGEsXG4gIGdldFN0eWxlQ2xhc3NlcyxcbiAgZ2V0UHJvcGVydHlOYW1lLFxuICBnZXRDbGFzc2VzTWFwLFxuICBnZXRGaWxlUGF0aCxcbn0gZnJvbSAnLi4vY29yZSc7XG5cbmltcG9ydCB0eXBlIHsgSnNOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1ldGE6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0NoZWNrcyB0aGF0IHlvdSBhcmUgdXNpbmcgYWxsIGNzcy9zY3NzL2xlc3MgY2xhc3NlcycsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICB9LFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNhbWVsQ2FzZTogeyBlbnVtOiBbdHJ1ZSwgJ2Rhc2hlcycsICdvbmx5JywgJ2Rhc2hlcy1vbmx5J10gfSxcbiAgICAgICAgICBtYXJrQXNVc2VkOiB7IHR5cGU6ICdhcnJheScgfSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICBdLFxuICB9LFxuICBjcmVhdGUgKGNvbnRleHQ6IE9iamVjdCkge1xuICAgIGNvbnN0IG1hcmtBc1VzZWQgPSBfLmdldChjb250ZXh0LCAnb3B0aW9uc1swXS5tYXJrQXNVc2VkJyk7XG4gICAgY29uc3QgY2FtZWxDYXNlID0gXy5nZXQoY29udGV4dCwgJ29wdGlvbnNbMF0uY2FtZWxDYXNlJyk7XG5cbiAgICAvKlxuICAgICAgIG1hcHMgdmFyaWFibGUgbmFtZSB0byBwcm9wZXJ0eSBPYmplY3RcbiAgICAgICBtYXAgPSB7XG4gICAgICAgICBbdmFyaWFibGVOYW1lXToge1xuICAgICAgICAgICBjbGFzc2VzOiB7IGZvbzogZmFsc2UsICdmb28tYmFyJzogZmFsc2UgfSxcbiAgICAgICAgICAgY2xhc3Nlc01hcDogeyBmb286ICdmb28nLCBmb29CYXI6ICdmb28tYmFyJywgJ2Zvby1iYXInOiAnZm9vLWJhcicgfSxcbiAgICAgICAgICAgbm9kZTogey4uLn1cbiAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICBleGFtcGxlOlxuICAgICAgIGltcG9ydCBzIGZyb20gJy4vZm9vLnNjc3MnO1xuICAgICAgIHMgaXMgdmFyaWFibGUgbmFtZVxuXG4gICAgICAgcHJvcGVydHkgT2JqZWN0IGhhcyB0d28ga2V5c1xuICAgICAgIDEuIGNsYXNzZXM6IGFuIG9iamVjdCB3aXRoIGNsYXNzTmFtZSBhcyBrZXkgYW5kIGEgYm9vbGVhbiBhcyB2YWx1ZS4gVGhlIGJvb2xlYW4gaXMgbWFya2VkIGlmIGl0IGlzIHVzZWQgaW4gZmlsZVxuICAgICAgIDIuIGNsYXNzZXNNYXA6IGFuIG9iamVjdCB3aXRoIHByb3BlcnR5TmFtZSBhcyBrZXkgYW5kIGl0cyBjbGFzc05hbWUgYXMgdmFsdWVcbiAgICAgICAzLiBub2RlOiBub2RlIHRoYXQgY29ycmVzcG9uZCB0byBzIChzZWUgZXhhbXBsZSBhYm92ZSlcbiAgICAgKi9cbiAgICBjb25zdCBtYXAgPSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbiAobm9kZTogSnNOb2RlKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlSW1wb3J0Tm9kZURhdGEgPSBnZXRTdHlsZUltcG9ydE5vZGVEYXRhKG5vZGUpO1xuXG4gICAgICAgIGlmICghc3R5bGVJbXBvcnROb2RlRGF0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBpbXBvcnROYW1lLFxuICAgICAgICAgIHN0eWxlRmlsZVBhdGgsXG4gICAgICAgICAgaW1wb3J0Tm9kZSxcbiAgICAgICAgfSA9IHN0eWxlSW1wb3J0Tm9kZURhdGE7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVGaWxlQWJzb2x1dGVQYXRoID0gZ2V0RmlsZVBhdGgoY29udGV4dCwgc3R5bGVGaWxlUGF0aCk7XG5cbiAgICAgICAgLy8gdGhpcyB3aWxsIGJlIHVzZWQgdG8gbWFyayBzLmZvbyBhcyB1c2VkIGluIE1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IGdldFN0eWxlQ2xhc3NlcyhzdHlsZUZpbGVBYnNvbHV0ZVBhdGgpO1xuICAgICAgICBjb25zdCBjbGFzc2VzTWFwID0gY2xhc3NlcyAmJiBnZXRDbGFzc2VzTWFwKGNsYXNzZXMsIGNhbWVsQ2FzZSk7XG5cbiAgICAgICAgXy5zZXQobWFwLCBgJHtpbXBvcnROYW1lfS5jbGFzc2VzYCwgY2xhc3Nlcyk7XG4gICAgICAgIF8uc2V0KG1hcCwgYCR7aW1wb3J0TmFtZX0uY2xhc3Nlc01hcGAsIGNsYXNzZXNNYXApO1xuXG4gICAgICAgIC8vIHNhdmUgbm9kZSBmb3IgcmVwb3J0aW5nIHVudXNlZCBzdHlsZXNcbiAgICAgICAgXy5zZXQobWFwLCBgJHtpbXBvcnROYW1lfS5ub2RlYCwgaW1wb3J0Tm9kZSk7XG4gICAgICB9LFxuICAgICAgTWVtYmVyRXhwcmVzc2lvbjogKG5vZGU6IEpzTm9kZSkgPT4ge1xuICAgICAgICAvKlxuICAgICAgICAgICBDaGVjayBpZiBwcm9wZXJ0eSBleGlzdHMgaW4gY3NzL3Njc3MgZmlsZSBhcyBjbGFzc1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBvYmplY3ROYW1lID0gbm9kZS5vYmplY3QubmFtZTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gZ2V0UHJvcGVydHlOYW1lKG5vZGUsIGNhbWVsQ2FzZSk7XG5cbiAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBfLmdldChtYXAsIGAke29iamVjdE5hbWV9LmNsYXNzZXNNYXAuJHtwcm9wZXJ0eU5hbWV9YCk7XG5cbiAgICAgICAgaWYgKGNsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFyayB0aGlzIHByb3BlcnR5IGhhcyB1c2VkXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7b2JqZWN0TmFtZX0uY2xhc3Nlcy4ke2NsYXNzTmFtZX1gLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICAnUHJvZ3JhbTpleGl0JyAoKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAgIENoZWNrIGlmIGFsbCBjbGFzc2VzIGRlZmluZWQgaW4gY3NzL3Njc3MgZmlsZSBhcmUgdXNlZFxuICAgICAgICAgKi9cblxuICAgICAgICAvKlxuICAgICAgICAgICB3ZSBhcmUgbG9vcGluZyBvdmVyIGVhY2ggaW1wb3J0IHN0eWxlIG5vZGUgaW4gcHJvZ3JhbVxuICAgICAgICAgICBleGFtcGxlOlxuICAgICAgICAgICBgYGBcbiAgICAgICAgICAgICBpbXBvcnQgcyBmcm9tICcuL2Zvby5jc3MnO1xuICAgICAgICAgICAgIGltcG9ydCB4IGZyb20gJy4vYmFyLnNjc3MnO1xuICAgICAgICAgICBgYGBcbiAgICAgICAgICAgdGhlbiB0aGUgbG9vcCB3aWxsIGJlIHJ1biAyIHRpbWVzXG4gICAgICAgICAqL1xuICAgICAgICBfLmZvckluKG1hcCwgKG8pID0+IHtcbiAgICAgICAgICBjb25zdCB7IGNsYXNzZXMsIG5vZGUgfSA9IG87XG5cbiAgICAgICAgICAvKlxuICAgICAgICAgICAgIGlmIG9wdGlvbiBpcyBwYXNzZWQgdG8gbWFyayBhIGNsYXNzIGFzIHVzZWQsIGV4YW1wbGU6XG4gICAgICAgICAgICAgZXNsaW50IGNzcy1tb2R1bGVzL25vLXVudXNlZC1jbGFzczogWzIsIHsgbWFya0FzVXNlZDogWydjb250YWluZXInXSB9XVxuICAgICAgICAgICAqL1xuICAgICAgICAgIF8uZm9yRWFjaChtYXJrQXNVc2VkLCAodXNlZENsYXNzKSA9PiB7XG4gICAgICAgICAgICBjbGFzc2VzW3VzZWRDbGFzc10gPSB0cnVlO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gY2xhc3NOYW1lcyBub3QgbWFya2VkIGFzIHRydWUgYXJlIHVudXNlZFxuICAgICAgICAgIGNvbnN0IHVudXNlZENsYXNzZXMgPSBmcC5jb21wb3NlKFxuICAgICAgICAgICAgZnAua2V5cyxcbiAgICAgICAgICAgIGZwLm9taXRCeShmcC5pZGVudGl0eSksIC8vIG9taXQgdHJ1dGh5IHZhbHVlc1xuICAgICAgICAgICkoY2xhc3Nlcyk7XG5cbiAgICAgICAgICBpZiAoIV8uaXNFbXB0eSh1bnVzZWRDbGFzc2VzKSkge1xuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZSwgYFVudXNlZCBjbGFzc2VzIGZvdW5kOiAke3VudXNlZENsYXNzZXMuam9pbignLCAnKX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=