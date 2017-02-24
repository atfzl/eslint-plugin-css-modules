'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyleClasses = exports.getStyleImportNodeData = exports.getPropertyName = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _gonzalesPe = require('gonzales-pe');

var _gonzalesPe2 = _interopRequireDefault(_gonzalesPe);

var _cssClasses = require('./cssClasses');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styleExtensionRegex = /\.(s?css|less)$/;

var getPropertyName = exports.getPropertyName = function getPropertyName(node) {
  if (node.computed) {
    /*
       square braces eg s['header']
       we won't use node.property.name because it is for cases like
       s[abc] where abc is a variable
     */
    return node.property.value;
  }

  return node.property.name; /* dot notation, eg s.header */
};

var getStyleImportNodeData = exports.getStyleImportNodeData = function getStyleImportNodeData(node) {
  // path from which it was imported
  var styleFilePath = _fp2.default.get('source.value')(node);

  if (styleFilePath && styleExtensionRegex.test(styleFilePath)) {
    var importNode = _fp2.default.compose(_fp2.default.find({ type: 'ImportDefaultSpecifier' }), _fp2.default.get('specifiers'))(node);

    // the default imported name
    var importName = _fp2.default.get('local.name')(importNode);

    if (importName) {
      // it had a default import
      return { importName: importName, styleFilePath: styleFilePath, importNode: importNode };
    }
  }
};

var getStyleClasses = exports.getStyleClasses = function getStyleClasses(filePath) {
  try {
    // check if file exists
    _fs2.default.statSync(filePath);
  } catch (e) {
    return {};
  }

  var fileContent = _fs2.default.readFileSync(filePath);

  var syntax = _path2.default.extname(filePath).slice(1); // remove leading .

  var ast = void 0;
  try {
    ast = _gonzalesPe2.default.parse(fileContent.toString(), { syntax: syntax });
  } catch (e) {
    // MAYBE: send message to tell about failure to parse file
    return null;
  }

  var classesMap = (0, _cssClasses.getRegularClassesMap)(ast);
  var composedClassesMap = (0, _cssClasses.getComposesClassesMap)(ast);
  var extendClassesMap = (0, _cssClasses.getExtendClassesMap)(ast);

  return _extends({}, classesMap, composedClassesMap, extendClassesMap);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbInN0eWxlRXh0ZW5zaW9uUmVnZXgiLCJnZXRQcm9wZXJ0eU5hbWUiLCJub2RlIiwiY29tcHV0ZWQiLCJwcm9wZXJ0eSIsInZhbHVlIiwibmFtZSIsImdldFN0eWxlSW1wb3J0Tm9kZURhdGEiLCJzdHlsZUZpbGVQYXRoIiwiZ2V0IiwidGVzdCIsImltcG9ydE5vZGUiLCJjb21wb3NlIiwiZmluZCIsInR5cGUiLCJpbXBvcnROYW1lIiwiZ2V0U3R5bGVDbGFzc2VzIiwiZmlsZVBhdGgiLCJzdGF0U3luYyIsImUiLCJmaWxlQ29udGVudCIsInJlYWRGaWxlU3luYyIsInN5bnRheCIsImV4dG5hbWUiLCJzbGljZSIsImFzdCIsInBhcnNlIiwidG9TdHJpbmciLCJjbGFzc2VzTWFwIiwiY29tcG9zZWRDbGFzc2VzTWFwIiwiZXh0ZW5kQ2xhc3Nlc01hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFJQTs7OztBQU1BLElBQU1BLHNCQUFzQixpQkFBNUI7O0FBRU8sSUFBTUMsNENBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxJQUFELEVBQTJCO0FBQ3hELE1BQUlBLEtBQUtDLFFBQVQsRUFBbUI7QUFDakI7Ozs7O0FBS0EsV0FBT0QsS0FBS0UsUUFBTCxDQUFjQyxLQUFyQjtBQUNEOztBQUVELFNBQU9ILEtBQUtFLFFBQUwsQ0FBY0UsSUFBckIsQ0FWd0QsQ0FVNUI7QUFDN0IsQ0FYTTs7QUFhQSxJQUFNQywwREFBeUIsU0FBekJBLHNCQUF5QixDQUFDTCxJQUFELEVBQTJCO0FBQy9EO0FBQ0EsTUFBTU0sZ0JBQWdCLGFBQUdDLEdBQUgsQ0FBTyxjQUFQLEVBQXVCUCxJQUF2QixDQUF0Qjs7QUFFQSxNQUFJTSxpQkFBaUJSLG9CQUFvQlUsSUFBcEIsQ0FBeUJGLGFBQXpCLENBQXJCLEVBQThEO0FBQzVELFFBQU1HLGFBQWEsYUFBR0MsT0FBSCxDQUNqQixhQUFHQyxJQUFILENBQVEsRUFBRUMsTUFBTSx3QkFBUixFQUFSLENBRGlCLEVBRWpCLGFBQUdMLEdBQUgsQ0FBTyxZQUFQLENBRmlCLEVBR2pCUCxJQUhpQixDQUFuQjs7QUFLQTtBQUNBLFFBQU1hLGFBQWEsYUFBR04sR0FBSCxDQUFPLFlBQVAsRUFBcUJFLFVBQXJCLENBQW5COztBQUVBLFFBQUlJLFVBQUosRUFBZ0I7QUFBRTtBQUNoQixhQUFPLEVBQUVBLHNCQUFGLEVBQWNQLDRCQUFkLEVBQTZCRyxzQkFBN0IsRUFBUDtBQUNEO0FBQ0Y7QUFDRixDQWpCTTs7QUFtQkEsSUFBTUssNENBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxRQUFELEVBQStCO0FBQzVELE1BQUk7QUFDRjtBQUNBLGlCQUFHQyxRQUFILENBQVlELFFBQVo7QUFDRCxHQUhELENBR0UsT0FBT0UsQ0FBUCxFQUFVO0FBQ1YsV0FBTyxFQUFQO0FBQ0Q7O0FBRUQsTUFBTUMsY0FBYyxhQUFHQyxZQUFILENBQWdCSixRQUFoQixDQUFwQjs7QUFFQSxNQUFNSyxTQUFTLGVBQUtDLE9BQUwsQ0FBYU4sUUFBYixFQUF1Qk8sS0FBdkIsQ0FBNkIsQ0FBN0IsQ0FBZixDQVY0RCxDQVVaOztBQUVoRCxNQUFJQyxZQUFKO0FBQ0EsTUFBSTtBQUNGQSxVQUFNLHFCQUFTQyxLQUFULENBQWVOLFlBQVlPLFFBQVosRUFBZixFQUF1QyxFQUFFTCxjQUFGLEVBQXZDLENBQU47QUFDRCxHQUZELENBRUUsT0FBT0gsQ0FBUCxFQUFVO0FBQ1Y7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFNUyxhQUFhLHNDQUFxQkgsR0FBckIsQ0FBbkI7QUFDQSxNQUFNSSxxQkFBcUIsdUNBQXNCSixHQUF0QixDQUEzQjtBQUNBLE1BQU1LLG1CQUFtQixxQ0FBb0JMLEdBQXBCLENBQXpCOztBQUVBLHNCQUFZRyxVQUFaLEVBQTJCQyxrQkFBM0IsRUFBa0RDLGdCQUFsRDtBQUNELENBekJNIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZwIGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgZ29uemFsZXMgZnJvbSAnZ29uemFsZXMtcGUnO1xuXG5pbXBvcnQgdHlwZSB7IEpzTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtcbiAgZ2V0UmVndWxhckNsYXNzZXNNYXAsXG4gIGdldENvbXBvc2VzQ2xhc3Nlc01hcCxcbiAgZ2V0RXh0ZW5kQ2xhc3Nlc01hcCxcbn0gZnJvbSAnLi9jc3NDbGFzc2VzJztcblxuY29uc3Qgc3R5bGVFeHRlbnNpb25SZWdleCA9IC9cXC4ocz9jc3N8bGVzcykkLztcblxuZXhwb3J0IGNvbnN0IGdldFByb3BlcnR5TmFtZSA9IChub2RlOiBKc05vZGUpOiA/c3RyaW5nID0+IHtcbiAgaWYgKG5vZGUuY29tcHV0ZWQpIHtcbiAgICAvKlxuICAgICAgIHNxdWFyZSBicmFjZXMgZWcgc1snaGVhZGVyJ11cbiAgICAgICB3ZSB3b24ndCB1c2Ugbm9kZS5wcm9wZXJ0eS5uYW1lIGJlY2F1c2UgaXQgaXMgZm9yIGNhc2VzIGxpa2VcbiAgICAgICBzW2FiY10gd2hlcmUgYWJjIGlzIGEgdmFyaWFibGVcbiAgICAgKi9cbiAgICByZXR1cm4gbm9kZS5wcm9wZXJ0eS52YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBub2RlLnByb3BlcnR5Lm5hbWU7ICAvKiBkb3Qgbm90YXRpb24sIGVnIHMuaGVhZGVyICovXG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U3R5bGVJbXBvcnROb2RlRGF0YSA9IChub2RlOiBKc05vZGUpOiA/T2JqZWN0ID0+IHtcbiAgLy8gcGF0aCBmcm9tIHdoaWNoIGl0IHdhcyBpbXBvcnRlZFxuICBjb25zdCBzdHlsZUZpbGVQYXRoID0gZnAuZ2V0KCdzb3VyY2UudmFsdWUnKShub2RlKTtcblxuICBpZiAoc3R5bGVGaWxlUGF0aCAmJiBzdHlsZUV4dGVuc2lvblJlZ2V4LnRlc3Qoc3R5bGVGaWxlUGF0aCkpIHtcbiAgICBjb25zdCBpbXBvcnROb2RlID0gZnAuY29tcG9zZShcbiAgICAgIGZwLmZpbmQoeyB0eXBlOiAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcicgfSksXG4gICAgICBmcC5nZXQoJ3NwZWNpZmllcnMnKSxcbiAgICApKG5vZGUpO1xuXG4gICAgLy8gdGhlIGRlZmF1bHQgaW1wb3J0ZWQgbmFtZVxuICAgIGNvbnN0IGltcG9ydE5hbWUgPSBmcC5nZXQoJ2xvY2FsLm5hbWUnKShpbXBvcnROb2RlKTtcblxuICAgIGlmIChpbXBvcnROYW1lKSB7IC8vIGl0IGhhZCBhIGRlZmF1bHQgaW1wb3J0XG4gICAgICByZXR1cm4geyBpbXBvcnROYW1lLCBzdHlsZUZpbGVQYXRoLCBpbXBvcnROb2RlIH07XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U3R5bGVDbGFzc2VzID0gKGZpbGVQYXRoOiBzdHJpbmcpOiA/T2JqZWN0ID0+IHtcbiAgdHJ5IHtcbiAgICAvLyBjaGVjayBpZiBmaWxlIGV4aXN0c1xuICAgIGZzLnN0YXRTeW5jKGZpbGVQYXRoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKTtcblxuICBjb25zdCBzeW50YXggPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnNsaWNlKDEpOyAvLyByZW1vdmUgbGVhZGluZyAuXG5cbiAgbGV0IGFzdDtcbiAgdHJ5IHtcbiAgICBhc3QgPSBnb256YWxlcy5wYXJzZShmaWxlQ29udGVudC50b1N0cmluZygpLCB7IHN5bnRheCB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIE1BWUJFOiBzZW5kIG1lc3NhZ2UgdG8gdGVsbCBhYm91dCBmYWlsdXJlIHRvIHBhcnNlIGZpbGVcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNsYXNzZXNNYXAgPSBnZXRSZWd1bGFyQ2xhc3Nlc01hcChhc3QpO1xuICBjb25zdCBjb21wb3NlZENsYXNzZXNNYXAgPSBnZXRDb21wb3Nlc0NsYXNzZXNNYXAoYXN0KTtcbiAgY29uc3QgZXh0ZW5kQ2xhc3Nlc01hcCA9IGdldEV4dGVuZENsYXNzZXNNYXAoYXN0KTtcblxuICByZXR1cm4geyAuLi5jbGFzc2VzTWFwLCAuLi5jb21wb3NlZENsYXNzZXNNYXAsIC4uLmV4dGVuZENsYXNzZXNNYXAgfTtcbn07XG4iXX0=