'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultImportStyleData = undefined;

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styleExtensionRegex = /\.s?css$/;

var getDefaultImportStyleData = exports.getDefaultImportStyleData = function getDefaultImportStyleData(node) {
  // path from which it was imported
  var path = _lodash2.default.get(node, 'source.value');

  if (path && styleExtensionRegex.test(path)) {
    var importNode = _fp2.default.compose(_fp2.default.first, _fp2.default.filter({ type: 'ImportDefaultSpecifier' }), _fp2.default.get('specifiers'))(node);

    // the default imported name
    var variableName = _lodash2.default.get(importNode, 'local.name');

    if (variableName) {
      // it had a default import
      return { variableName: variableName, path: path, importNode: importNode };
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9ydWxlcy9uby11bnVzZWQtb3ItZXh0cmEtY2xhc3MvdXRpbHMuanMiXSwibmFtZXMiOlsic3R5bGVFeHRlbnNpb25SZWdleCIsImdldERlZmF1bHRJbXBvcnRTdHlsZURhdGEiLCJub2RlIiwicGF0aCIsImdldCIsInRlc3QiLCJpbXBvcnROb2RlIiwiY29tcG9zZSIsImZpcnN0IiwiZmlsdGVyIiwidHlwZSIsInZhcmlhYmxlTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUlBLElBQU1BLHNCQUFzQixVQUE1Qjs7QUFFTyxJQUFNQyxnRUFBNEIsU0FBNUJBLHlCQUE0QixDQUFDQyxJQUFELEVBQXlCO0FBQ2hFO0FBQ0EsTUFBTUMsT0FBTyxpQkFBRUMsR0FBRixDQUFNRixJQUFOLEVBQVksY0FBWixDQUFiOztBQUVBLE1BQUlDLFFBQVFILG9CQUFvQkssSUFBcEIsQ0FBeUJGLElBQXpCLENBQVosRUFBNEM7QUFDMUMsUUFBTUcsYUFBYSxhQUFHQyxPQUFILENBQ2pCLGFBQUdDLEtBRGMsRUFFakIsYUFBR0MsTUFBSCxDQUFVLEVBQUVDLE1BQU0sd0JBQVIsRUFBVixDQUZpQixFQUdqQixhQUFHTixHQUFILENBQU8sWUFBUCxDQUhpQixFQUlqQkYsSUFKaUIsQ0FBbkI7O0FBTUE7QUFDQSxRQUFNUyxlQUFlLGlCQUFFUCxHQUFGLENBQU1FLFVBQU4sRUFBa0IsWUFBbEIsQ0FBckI7O0FBRUEsUUFBSUssWUFBSixFQUFrQjtBQUFFO0FBQ2xCLGFBQU8sRUFBRUEsMEJBQUYsRUFBZ0JSLFVBQWhCLEVBQXNCRyxzQkFBdEIsRUFBUDtBQUNEO0FBQ0Y7QUFDRixDQWxCTSIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcCBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5jb25zdCBzdHlsZUV4dGVuc2lvblJlZ2V4ID0gL1xcLnM/Y3NzJC87XG5cbmV4cG9ydCBjb25zdCBnZXREZWZhdWx0SW1wb3J0U3R5bGVEYXRhID0gKG5vZGU6IE5vZGUpOiA/T2JqZWN0ID0+IHtcbiAgLy8gcGF0aCBmcm9tIHdoaWNoIGl0IHdhcyBpbXBvcnRlZFxuICBjb25zdCBwYXRoID0gXy5nZXQobm9kZSwgJ3NvdXJjZS52YWx1ZScpO1xuXG4gIGlmIChwYXRoICYmIHN0eWxlRXh0ZW5zaW9uUmVnZXgudGVzdChwYXRoKSkge1xuICAgIGNvbnN0IGltcG9ydE5vZGUgPSBmcC5jb21wb3NlKFxuICAgICAgZnAuZmlyc3QsXG4gICAgICBmcC5maWx0ZXIoeyB0eXBlOiAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcicgfSksXG4gICAgICBmcC5nZXQoJ3NwZWNpZmllcnMnKSxcbiAgICApKG5vZGUpO1xuXG4gICAgLy8gdGhlIGRlZmF1bHQgaW1wb3J0ZWQgbmFtZVxuICAgIGNvbnN0IHZhcmlhYmxlTmFtZSA9IF8uZ2V0KGltcG9ydE5vZGUsICdsb2NhbC5uYW1lJyk7XG5cbiAgICBpZiAodmFyaWFibGVOYW1lKSB7IC8vIGl0IGhhZCBhIGRlZmF1bHQgaW1wb3J0XG4gICAgICByZXR1cm4geyB2YXJpYWJsZU5hbWUsIHBhdGgsIGltcG9ydE5vZGUgfTtcbiAgICB9XG4gIH1cbn07XG4iXX0=