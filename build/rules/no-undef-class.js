'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _core = require('../core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  meta: {
    docs: {
      description: 'Checks that you are using the existent css/scss/less classes',
      recommended: true
    },
    schema: [{
      type: 'object',
      properties: {
        camelCase: { enum: [true, 'dashes', 'only', 'dashes-only'] }
      }
    }]
  },
  create: function create(context) {
    var camelCase = _lodash2.default.get(context, 'options[0].camelCase');

    /*
       maps variable name to property Object
       map = {
         [variableName]: {
           classesMap: { foo: 'foo', fooBar: 'foo-bar', 'foo-bar': 'foo-bar' },
           node: {...}
         }
       }
        example:
       import s from './foo.scss';
       s is variable name
        property Object has two keys
       1. classesMap: an object with propertyName as key and its className as value
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


        var styleFileAbsolutePath = (0, _core.getFilePath)(context, styleFilePath);

        var classes = (0, _core.getStyleClasses)(styleFileAbsolutePath);
        var classesMap = classes && (0, _core.getClassesMap)(classes, camelCase);

        // this will be used to check if classes are defined
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

        var classesMap = _lodash2.default.get(map, objectName + '.classesMap');

        if (classesMap && classesMap[propertyName] == null) {
          context.report(node.property, 'Class \'' + propertyName + '\' not found');
        }
      }
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9ydWxlcy9uby11bmRlZi1jbGFzcy5qcyJdLCJuYW1lcyI6WyJtZXRhIiwiZG9jcyIsImRlc2NyaXB0aW9uIiwicmVjb21tZW5kZWQiLCJzY2hlbWEiLCJ0eXBlIiwicHJvcGVydGllcyIsImNhbWVsQ2FzZSIsImVudW0iLCJjcmVhdGUiLCJjb250ZXh0IiwiZ2V0IiwibWFwIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJub2RlIiwic3R5bGVJbXBvcnROb2RlRGF0YSIsImltcG9ydE5hbWUiLCJzdHlsZUZpbGVQYXRoIiwiaW1wb3J0Tm9kZSIsInN0eWxlRmlsZUFic29sdXRlUGF0aCIsImNsYXNzZXMiLCJjbGFzc2VzTWFwIiwic2V0IiwiTWVtYmVyRXhwcmVzc2lvbiIsIm9iamVjdE5hbWUiLCJvYmplY3QiLCJuYW1lIiwicHJvcGVydHlOYW1lIiwicmVwb3J0IiwicHJvcGVydHkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBRUE7Ozs7a0JBVWU7QUFDYkEsUUFBTTtBQUNKQyxVQUFNO0FBQ0pDLG1CQUFhLDhEQURUO0FBRUpDLG1CQUFhO0FBRlQsS0FERjtBQUtKQyxZQUFRLENBQ047QUFDRUMsWUFBTSxRQURSO0FBRUVDLGtCQUFZO0FBQ1ZDLG1CQUFXLEVBQUVDLE1BQU0sQ0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixNQUFqQixFQUF5QixhQUF6QixDQUFSO0FBREQ7QUFGZCxLQURNO0FBTEosR0FETztBQWViQyxRQWZhLGtCQWVMQyxPQWZLLEVBZVk7QUFDdkIsUUFBTUgsWUFBWSxpQkFBRUksR0FBRixDQUFNRCxPQUFOLEVBQWUsc0JBQWYsQ0FBbEI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxRQUFNRSxNQUFNLEVBQVo7O0FBRUEsV0FBTztBQUNMQyx1QkFESyw2QkFDY0MsSUFEZCxFQUM0QjtBQUMvQixZQUFNQyxzQkFBc0Isa0NBQXVCRCxJQUF2QixDQUE1Qjs7QUFFQSxZQUFJLENBQUNDLG1CQUFMLEVBQTBCO0FBQ3hCO0FBQ0Q7O0FBTDhCLFlBUTdCQyxVQVI2QixHQVczQkQsbUJBWDJCLENBUTdCQyxVQVI2QjtBQUFBLFlBUzdCQyxhQVQ2QixHQVczQkYsbUJBWDJCLENBUzdCRSxhQVQ2QjtBQUFBLFlBVTdCQyxVQVY2QixHQVczQkgsbUJBWDJCLENBVTdCRyxVQVY2Qjs7O0FBYS9CLFlBQU1DLHdCQUF3Qix1QkFBWVQsT0FBWixFQUFxQk8sYUFBckIsQ0FBOUI7O0FBRUEsWUFBTUcsVUFBVSwyQkFBZ0JELHFCQUFoQixDQUFoQjtBQUNBLFlBQU1FLGFBQWFELFdBQVcseUJBQWNBLE9BQWQsRUFBdUJiLFNBQXZCLENBQTlCOztBQUVBO0FBQ0EseUJBQUVlLEdBQUYsQ0FBTVYsR0FBTixFQUFjSSxVQUFkLGtCQUF1Q0ssVUFBdkM7O0FBRUE7QUFDQSx5QkFBRUMsR0FBRixDQUFNVixHQUFOLEVBQWNJLFVBQWQsWUFBaUNFLFVBQWpDO0FBQ0QsT0F4Qkk7O0FBeUJMSyx3QkFBa0IsMEJBQUNULElBQUQsRUFBa0I7QUFDbEM7Ozs7QUFJQSxZQUFNVSxhQUFhVixLQUFLVyxNQUFMLENBQVlDLElBQS9COztBQUVBLFlBQU1DLGVBQWUsMkJBQWdCYixJQUFoQixFQUFzQlAsU0FBdEIsQ0FBckI7O0FBRUEsWUFBSSxDQUFDb0IsWUFBTCxFQUFtQjtBQUNqQjtBQUNEOztBQUVELFlBQU1OLGFBQWEsaUJBQUVWLEdBQUYsQ0FBTUMsR0FBTixFQUFjWSxVQUFkLGlCQUFuQjs7QUFFQSxZQUFJSCxjQUFjQSxXQUFXTSxZQUFYLEtBQTRCLElBQTlDLEVBQW9EO0FBQ2xEakIsa0JBQVFrQixNQUFSLENBQWVkLEtBQUtlLFFBQXBCLGVBQXdDRixZQUF4QztBQUNEO0FBQ0Y7QUEzQ0ksS0FBUDtBQTZDRDtBQWxGWSxDIiwiZmlsZSI6Im5vLXVuZGVmLWNsYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGdldFN0eWxlSW1wb3J0Tm9kZURhdGEsXG4gIGdldFN0eWxlQ2xhc3NlcyxcbiAgZ2V0UHJvcGVydHlOYW1lLFxuICBnZXRDbGFzc2VzTWFwLFxuICBnZXRGaWxlUGF0aCxcbn0gZnJvbSAnLi4vY29yZSc7XG5cbmltcG9ydCB0eXBlIHsgSnNOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1ldGE6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0NoZWNrcyB0aGF0IHlvdSBhcmUgdXNpbmcgdGhlIGV4aXN0ZW50IGNzcy9zY3NzL2xlc3MgY2xhc3NlcycsXG4gICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICB9LFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNhbWVsQ2FzZTogeyBlbnVtOiBbdHJ1ZSwgJ2Rhc2hlcycsICdvbmx5JywgJ2Rhc2hlcy1vbmx5J10gfVxuICAgICAgICB9LFxuICAgICAgfVxuICAgIF0sXG4gIH0sXG4gIGNyZWF0ZSAoY29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgY2FtZWxDYXNlID0gXy5nZXQoY29udGV4dCwgJ29wdGlvbnNbMF0uY2FtZWxDYXNlJyk7XG5cbiAgICAvKlxuICAgICAgIG1hcHMgdmFyaWFibGUgbmFtZSB0byBwcm9wZXJ0eSBPYmplY3RcbiAgICAgICBtYXAgPSB7XG4gICAgICAgICBbdmFyaWFibGVOYW1lXToge1xuICAgICAgICAgICBjbGFzc2VzTWFwOiB7IGZvbzogJ2ZvbycsIGZvb0JhcjogJ2Zvby1iYXInLCAnZm9vLWJhcic6ICdmb28tYmFyJyB9LFxuICAgICAgICAgICBub2RlOiB7Li4ufVxuICAgICAgICAgfVxuICAgICAgIH1cblxuICAgICAgIGV4YW1wbGU6XG4gICAgICAgaW1wb3J0IHMgZnJvbSAnLi9mb28uc2Nzcyc7XG4gICAgICAgcyBpcyB2YXJpYWJsZSBuYW1lXG5cbiAgICAgICBwcm9wZXJ0eSBPYmplY3QgaGFzIHR3byBrZXlzXG4gICAgICAgMS4gY2xhc3Nlc01hcDogYW4gb2JqZWN0IHdpdGggcHJvcGVydHlOYW1lIGFzIGtleSBhbmQgaXRzIGNsYXNzTmFtZSBhcyB2YWx1ZVxuICAgICAgIDIuIG5vZGU6IG5vZGUgdGhhdCBjb3JyZXNwb25kIHRvIHMgKHNlZSBleGFtcGxlIGFib3ZlKVxuICAgICAqL1xuICAgIGNvbnN0IG1hcCA9IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uIChub2RlOiBKc05vZGUpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVJbXBvcnROb2RlRGF0YSA9IGdldFN0eWxlSW1wb3J0Tm9kZURhdGEobm9kZSk7XG5cbiAgICAgICAgaWYgKCFzdHlsZUltcG9ydE5vZGVEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGltcG9ydE5hbWUsXG4gICAgICAgICAgc3R5bGVGaWxlUGF0aCxcbiAgICAgICAgICBpbXBvcnROb2RlLFxuICAgICAgICB9ID0gc3R5bGVJbXBvcnROb2RlRGF0YTtcblxuICAgICAgICBjb25zdCBzdHlsZUZpbGVBYnNvbHV0ZVBhdGggPSBnZXRGaWxlUGF0aChjb250ZXh0LCBzdHlsZUZpbGVQYXRoKTtcblxuICAgICAgICBjb25zdCBjbGFzc2VzID0gZ2V0U3R5bGVDbGFzc2VzKHN0eWxlRmlsZUFic29sdXRlUGF0aCk7XG4gICAgICAgIGNvbnN0IGNsYXNzZXNNYXAgPSBjbGFzc2VzICYmIGdldENsYXNzZXNNYXAoY2xhc3NlcywgY2FtZWxDYXNlKTtcblxuICAgICAgICAvLyB0aGlzIHdpbGwgYmUgdXNlZCB0byBjaGVjayBpZiBjbGFzc2VzIGFyZSBkZWZpbmVkXG4gICAgICAgIF8uc2V0KG1hcCwgYCR7aW1wb3J0TmFtZX0uY2xhc3Nlc01hcGAsIGNsYXNzZXNNYXApO1xuXG4gICAgICAgIC8vIHNhdmUgbm9kZSBmb3IgcmVwb3J0aW5nIHVudXNlZCBzdHlsZXNcbiAgICAgICAgXy5zZXQobWFwLCBgJHtpbXBvcnROYW1lfS5ub2RlYCwgaW1wb3J0Tm9kZSk7XG4gICAgICB9LFxuICAgICAgTWVtYmVyRXhwcmVzc2lvbjogKG5vZGU6IEpzTm9kZSkgPT4ge1xuICAgICAgICAvKlxuICAgICAgICAgICBDaGVjayBpZiBwcm9wZXJ0eSBleGlzdHMgaW4gY3NzL3Njc3MgZmlsZSBhcyBjbGFzc1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBvYmplY3ROYW1lID0gbm9kZS5vYmplY3QubmFtZTtcblxuICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBnZXRQcm9wZXJ0eU5hbWUobm9kZSwgY2FtZWxDYXNlKTtcblxuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNsYXNzZXNNYXAgPSBfLmdldChtYXAsIGAke29iamVjdE5hbWV9LmNsYXNzZXNNYXBgKTtcblxuICAgICAgICBpZiAoY2xhc3Nlc01hcCAmJiBjbGFzc2VzTWFwW3Byb3BlcnR5TmFtZV0gPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUucHJvcGVydHksIGBDbGFzcyAnJHtwcm9wZXJ0eU5hbWV9JyBub3QgZm91bmRgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=