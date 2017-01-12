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

        var propertyName = (0, _core.getPropertyName)(node);

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

        /*
           if option is passed to mark a class as used, example:
           eslint css-modules/no-unused-class: [2, { markAsUsed: ['container'] }]
           note: options[0] is actually the element at index 1 in above line
         */
        var markAsUsed = _lodash2.default.get(context, 'options[0].markAsUsed');

        /*
           we are looping over each import style node in program
           example:
           ```
             import s from './foo.css';
             import x from './bar.scss';
           ```
           then the loop will be run 2 times
         */
        _lodash2.default.forOwn(map, function (o) {
          var classes = o.classes,
              node = o.node;


          _lodash2.default.forEach(markAsUsed, function (usedClass) {
            classes[usedClass] = true;
          });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtY2xhc3MuanMiXSwibmFtZXMiOlsibWV0YSIsImRvY3MiLCJkZXNjcmlwdGlvbiIsInJlY29tbWVuZGVkIiwiY3JlYXRlIiwiY29udGV4dCIsImRpck5hbWUiLCJkaXJuYW1lIiwiZ2V0RmlsZW5hbWUiLCJtYXAiLCJJbXBvcnREZWNsYXJhdGlvbiIsIm5vZGUiLCJzdHlsZUltcG9ydE5vZGVEYXRhIiwiaW1wb3J0TmFtZSIsInN0eWxlRmlsZVBhdGgiLCJpbXBvcnROb2RlIiwic3R5bGVGaWxlQWJzb2x1dGVQYXRoIiwicmVzb2x2ZSIsImNsYXNzTmFtZXNNYXAiLCJzZXQiLCJNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0TmFtZSIsIm9iamVjdCIsIm5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJzdGFydHNXaXRoIiwiYXZhaWxhYmxlQ2xhc3NlcyIsImdldCIsImhhc093blByb3BlcnR5IiwibWFya0FzVXNlZCIsImZvck93biIsIm8iLCJjbGFzc2VzIiwiZm9yRWFjaCIsInVzZWRDbGFzcyIsInVudXNlZENsYXNzZXMiLCJPYmplY3QiLCJrZXlzIiwib21pdEJ5IiwiaXNFbXB0eSIsInJlcG9ydCIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztrQkFRZTtBQUNiQSxRQUFNO0FBQ0pDLFVBQU07QUFDSkMsbUJBQWEsMEVBRFQ7QUFFSkMsbUJBQWE7QUFGVDtBQURGLEdBRE87QUFPYkMsUUFQYSxrQkFPTEMsT0FQSyxFQU9ZO0FBQ3ZCLFFBQU1DLFVBQVUsZUFBS0MsT0FBTCxDQUFhRixRQUFRRyxXQUFSLEVBQWIsQ0FBaEI7O0FBRUE7Ozs7Ozs7Ozs7O0FBYUEsUUFBTUMsTUFBTSxFQUFaOztBQUVBLFdBQU87QUFDTEMsdUJBREssNkJBQ2NDLElBRGQsRUFDNEI7QUFDL0IsWUFBTUMsc0JBQXNCLGtDQUF1QkQsSUFBdkIsQ0FBNUI7O0FBRUEsWUFBSSxDQUFDQyxtQkFBTCxFQUEwQjtBQUN4QjtBQUNEOztBQUw4QixZQVE3QkMsVUFSNkIsR0FXM0JELG1CQVgyQixDQVE3QkMsVUFSNkI7QUFBQSxZQVM3QkMsYUFUNkIsR0FXM0JGLG1CQVgyQixDQVM3QkUsYUFUNkI7QUFBQSxZQVU3QkMsVUFWNkIsR0FXM0JILG1CQVgyQixDQVU3QkcsVUFWNkI7OztBQWEvQixZQUFNQyx3QkFBd0IsZUFBS0MsT0FBTCxDQUFhWCxPQUFiLEVBQXNCUSxhQUF0QixDQUE5Qjs7QUFFQTs7O0FBR0EsWUFBTUksZ0JBQWdCLDJCQUFnQkYscUJBQWhCLENBQXRCOztBQUVBO0FBQ0EseUJBQUVHLEdBQUYsQ0FBTVYsR0FBTixFQUFjSSxVQUFkLGVBQW9DSyxhQUFwQzs7QUFFQTtBQUNBLHlCQUFFQyxHQUFGLENBQU1WLEdBQU4sRUFBY0ksVUFBZCxZQUFpQ0UsVUFBakM7QUFDRCxPQTFCSTs7QUEyQkxLLHdCQUFrQiwwQkFBQ1QsSUFBRCxFQUFrQjtBQUNsQzs7OztBQUlBLFlBQU1VLGFBQWFWLEtBQUtXLE1BQUwsQ0FBWUMsSUFBL0I7O0FBRUEsWUFBTUMsZUFBZSwyQkFBZ0JiLElBQWhCLENBQXJCOztBQUVBLFlBQUksQ0FBQ2EsWUFBRCxJQUFpQixpQkFBRUMsVUFBRixDQUFhRCxZQUFiLEVBQTJCLEdBQTNCLENBQXJCLEVBQXNEO0FBQ3BEOzs7Ozs7OztBQVNBO0FBQ0Q7O0FBRUQsWUFBTUUsbUJBQW1CLGlCQUFFQyxHQUFGLENBQU1sQixHQUFOLEVBQWNZLFVBQWQsY0FBekI7O0FBRUEsWUFBSUssb0JBQW9CQSxpQkFBaUJFLGNBQWpCLENBQWdDSixZQUFoQyxDQUF4QixFQUF1RTtBQUNyRTtBQUNBRSwyQkFBaUJGLFlBQWpCLElBQWlDLElBQWpDO0FBQ0Q7QUFDRixPQXZESTtBQXdETCxvQkF4REsseUJBd0RhO0FBQ2hCOzs7O0FBSUE7Ozs7O0FBS0EsWUFBTUssYUFBYSxpQkFBRUYsR0FBRixDQUFNdEIsT0FBTixFQUFlLHVCQUFmLENBQW5COztBQUVBOzs7Ozs7Ozs7QUFTQSx5QkFBRXlCLE1BQUYsQ0FBU3JCLEdBQVQsRUFBYyxVQUFDc0IsQ0FBRCxFQUFPO0FBQUEsY0FDWEMsT0FEVyxHQUNPRCxDQURQLENBQ1hDLE9BRFc7QUFBQSxjQUNGckIsSUFERSxHQUNPb0IsQ0FEUCxDQUNGcEIsSUFERTs7O0FBR25CLDJCQUFFc0IsT0FBRixDQUFVSixVQUFWLEVBQXNCLHFCQUFhO0FBQ2pDRyxvQkFBUUUsU0FBUixJQUFxQixJQUFyQjtBQUNELFdBRkQ7O0FBSUE7QUFDQSxjQUFNQyxnQkFBZ0JDLE9BQU9DLElBQVAsQ0FBWSxpQkFBRUMsTUFBRixDQUFTTixPQUFULEVBQWtCLElBQWxCLENBQVosQ0FBdEI7O0FBRUEsY0FBSSxDQUFDLGlCQUFFTyxPQUFGLENBQVVKLGFBQVYsQ0FBTCxFQUErQjtBQUM3QjlCLG9CQUFRbUMsTUFBUixDQUFlN0IsSUFBZiw2QkFBOEN3QixjQUFjTSxJQUFkLENBQW1CLElBQW5CLENBQTlDO0FBQ0Q7QUFDRixTQWJEO0FBY0Q7QUEzRkksS0FBUDtBQTZGRDtBQXRIWSxDIiwiZmlsZSI6Im5vLXVudXNlZC1jbGFzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7XG4gIGdldFN0eWxlSW1wb3J0Tm9kZURhdGEsXG4gIGdldFN0eWxlQ2xhc3NlcyxcbiAgZ2V0UHJvcGVydHlOYW1lLFxufSBmcm9tICcuLi9jb3JlJztcblxuaW1wb3J0IHR5cGUgeyBKc05vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ2hlY2tzIHRoYXQgeW91IGFyZSB1c2luZyB0aGUgZXhpc3RlbnQgY3NzL3Njc3MgY2xhc3Nlcywgbm8gbW9yZSBubyBsZXNzJyxcbiAgICAgIHJlY29tbWVuZGVkOiB0cnVlLFxuICAgIH1cbiAgfSxcbiAgY3JlYXRlIChjb250ZXh0OiBPYmplY3QpIHtcbiAgICBjb25zdCBkaXJOYW1lID0gcGF0aC5kaXJuYW1lKGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG5cbiAgICAvKlxuICAgICAgIG1hcHMgdmFyaWFibGUgbmFtZSB0byBwcm9wZXJ0eSBPYmplY3RcbiAgICAgICBtYXAgPSB7IFt2YXJpYWJsZU5hbWVdOiB7IGNsYXNzZXM6IHsgZm9vOiB0cnVlIH0sIG5vZGU6IHsuLi59IH1cblxuICAgICAgIGV4YW1wbGU6XG4gICAgICAgaW1wb3J0IHMgZnJvbSAnLi9mb28uc2Nzcyc7XG4gICAgICAgcyBpcyB2YXJpYWJsZSBuYW1lXG5cbiAgICAgICBwcm9wZXJ0eSBPYmplY3QgaGFzIHR3byBrZXlzXG4gICAgICAgMS4gY2xhc3NlczogYW4gb2JqZWN0IHdpdGggY2xhc3NOYW1lIGFzIGtleSBhbmQgYSBib29sZWFuIGFzIHZhbHVlLlxuICAgICAgIFRoZSBib29sZWFuIGlzIG1hcmtlZCBpZiBpdCBpcyB1c2VkIGluIGZpbGVcbiAgICAgICAyLiBub2RlOiBub2RlIHRoYXQgY29ycmVzcG9uZCB0byBzIChzZWUgZXhhbXBsZSBhYm92ZSlcbiAgICAgKi9cbiAgICBjb25zdCBtYXAgPSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbiAobm9kZTogSnNOb2RlKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlSW1wb3J0Tm9kZURhdGEgPSBnZXRTdHlsZUltcG9ydE5vZGVEYXRhKG5vZGUpO1xuXG4gICAgICAgIGlmICghc3R5bGVJbXBvcnROb2RlRGF0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBpbXBvcnROYW1lLFxuICAgICAgICAgIHN0eWxlRmlsZVBhdGgsXG4gICAgICAgICAgaW1wb3J0Tm9kZSxcbiAgICAgICAgfSA9IHN0eWxlSW1wb3J0Tm9kZURhdGE7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVGaWxlQWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpck5hbWUsIHN0eWxlRmlsZVBhdGgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgIG1hcHMgY2xhc3NOYW1lcyB3aXRoIGEgYm9vbGVhbiB0byBtYXJrIGFzIHVzZWQgaW4gc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjbGFzc05hbWVzTWFwID0gZ2V0U3R5bGVDbGFzc2VzKHN0eWxlRmlsZUFic29sdXRlUGF0aCk7XG5cbiAgICAgICAgLy8gdGhpcyB3aWxsIGJlIHVzZWQgdG8gbWFyayBzLmZvbyBhcyB1c2VkIGluIE1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgXy5zZXQobWFwLCBgJHtpbXBvcnROYW1lfS5jbGFzc2VzYCwgY2xhc3NOYW1lc01hcCk7XG5cbiAgICAgICAgLy8gc2F2ZSBub2RlIGZvciByZXBvcnRpbmcgdW51c2VkIHN0eWxlc1xuICAgICAgICBfLnNldChtYXAsIGAke2ltcG9ydE5hbWV9Lm5vZGVgLCBpbXBvcnROb2RlKTtcbiAgICAgIH0sXG4gICAgICBNZW1iZXJFeHByZXNzaW9uOiAobm9kZTogSnNOb2RlKSA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgICAgIENoZWNrIGlmIHByb3BlcnR5IGV4aXN0cyBpbiBjc3Mvc2NzcyBmaWxlIGFzIGNsYXNzXG4gICAgICAgICAqL1xuXG4gICAgICAgIGNvbnN0IG9iamVjdE5hbWUgPSBub2RlLm9iamVjdC5uYW1lO1xuXG4gICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGdldFByb3BlcnR5TmFtZShub2RlKTtcblxuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSB8fCBfLnN0YXJ0c1dpdGgocHJvcGVydHlOYW1lLCAnXycpKSB7XG4gICAgICAgICAgLypcbiAgICAgICAgICAgICBza2lwIHByb3BlcnR5IG5hbWVzIHN0YXJ0aW5nIHdpdGggX1xuICAgICAgICAgICAgIGVnLiBzcGVjaWFsIGZ1bmN0aW9ucyBwcm92aWRlZFxuICAgICAgICAgICAgIGJ5IGNzcyBtb2R1bGVzIGxpa2UgXy5nZXRDc3MoKVxuXG4gICAgICAgICAgICAgVHJpZWQgdG8ganVzdCBza2lwIGZ1bmN0aW9uIGNhbGxzLCBidXQgdGhlIHBhcnNlclxuICAgICAgICAgICAgIHRoaW5rcyBvZiBub3JtYWwgcHJvcGVydHkgYWNjZXNzIGxpa2Ugcy5fZ2V0Q3NzIGFuZFxuICAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxzIGxpa2Ugcy5fZ2V0Q3NzKCkgYXMgc2FtZS5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdmFpbGFibGVDbGFzc2VzID0gXy5nZXQobWFwLCBgJHtvYmplY3ROYW1lfS5jbGFzc2VzYCk7XG5cbiAgICAgICAgaWYgKGF2YWlsYWJsZUNsYXNzZXMgJiYgYXZhaWxhYmxlQ2xhc3Nlcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgLy8gbWFyayBhcyB1c2VkXG4gICAgICAgICAgYXZhaWxhYmxlQ2xhc3Nlc1twcm9wZXJ0eU5hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdQcm9ncmFtOmV4aXQnICgpIHtcbiAgICAgICAgLypcbiAgICAgICAgICAgQ2hlY2sgaWYgYWxsIGNsYXNzZXMgZGVmaW5lZCBpbiBjc3Mvc2NzcyBmaWxlIGFyZSB1c2VkXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgIGlmIG9wdGlvbiBpcyBwYXNzZWQgdG8gbWFyayBhIGNsYXNzIGFzIHVzZWQsIGV4YW1wbGU6XG4gICAgICAgICAgIGVzbGludCBjc3MtbW9kdWxlcy9uby11bnVzZWQtY2xhc3M6IFsyLCB7IG1hcmtBc1VzZWQ6IFsnY29udGFpbmVyJ10gfV1cbiAgICAgICAgICAgbm90ZTogb3B0aW9uc1swXSBpcyBhY3R1YWxseSB0aGUgZWxlbWVudCBhdCBpbmRleCAxIGluIGFib3ZlIGxpbmVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1hcmtBc1VzZWQgPSBfLmdldChjb250ZXh0LCAnb3B0aW9uc1swXS5tYXJrQXNVc2VkJyk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgd2UgYXJlIGxvb3Bpbmcgb3ZlciBlYWNoIGltcG9ydCBzdHlsZSBub2RlIGluIHByb2dyYW1cbiAgICAgICAgICAgZXhhbXBsZTpcbiAgICAgICAgICAgYGBgXG4gICAgICAgICAgICAgaW1wb3J0IHMgZnJvbSAnLi9mb28uY3NzJztcbiAgICAgICAgICAgICBpbXBvcnQgeCBmcm9tICcuL2Jhci5zY3NzJztcbiAgICAgICAgICAgYGBgXG4gICAgICAgICAgIHRoZW4gdGhlIGxvb3Agd2lsbCBiZSBydW4gMiB0aW1lc1xuICAgICAgICAgKi9cbiAgICAgICAgXy5mb3JPd24obWFwLCAobykgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgY2xhc3Nlcywgbm9kZSB9ID0gbztcblxuICAgICAgICAgIF8uZm9yRWFjaChtYXJrQXNVc2VkLCB1c2VkQ2xhc3MgPT4ge1xuICAgICAgICAgICAgY2xhc3Nlc1t1c2VkQ2xhc3NdID0gdHJ1ZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIGNsYXNzTmFtZXMgbm90IG1hcmtlZCBhcyB0cnVlIGFyZSB1bnVzZWRcbiAgICAgICAgICBjb25zdCB1bnVzZWRDbGFzc2VzID0gT2JqZWN0LmtleXMoXy5vbWl0QnkoY2xhc3NlcywgbnVsbCkpO1xuXG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodW51c2VkQ2xhc3NlcykpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUsIGBVbnVzZWQgY2xhc3NlcyBmb3VuZDogJHt1bnVzZWRDbGFzc2VzLmpvaW4oJywgJyl9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuIl19