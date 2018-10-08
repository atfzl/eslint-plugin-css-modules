'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyleClasses = exports.getStyleImportNodeData = exports.getClassesMap = exports.getPropertyName = exports.getFilePath = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _gonzales = require('./gonzales');

var _gonzales2 = _interopRequireDefault(_gonzales);

var _traversalUtils = require('./traversalUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styleExtensionRegex = /\.(s?css|less)$/;

function dashesCamelCase(str) {
  return str.replace(/-+(\w)/g, function (match, firstLetter) {
    return firstLetter.toUpperCase();
  });
}

var getFilePath = exports.getFilePath = function getFilePath(context, styleFilePath) {
  var settings = context.settings && context.settings['css-modules'];

  var dirName = _path2.default.dirname(context.getFilename());
  var basePath = settings && settings.basePath ? settings.basePath : '';

  return styleFilePath.startsWith('.') ? _path2.default.resolve(dirName, styleFilePath) : _path2.default.resolve(basePath, styleFilePath);
};

var getPropertyName = exports.getPropertyName = function getPropertyName(node) {
  var propertyName = node.computed
  /*
     square braces eg s['header']
     we won't use node.property.name because it is for cases like
     s[abc] where abc is a variable
   */
  ? node.property.value
  /* dot notation, eg s.header */
  : node.property.name;

  /*
     skip property names starting with _
     eg. special functions provided
     by css modules like _getCss()
      Tried to just skip function calls, but the parser
     thinks of normal property access like s._getCss and
     function calls like s._getCss() as same.
   */
  if (!propertyName || _lodash2.default.startsWith(propertyName, '_')) {
    return null;
  }

  return propertyName;
};

var getClassesMap = exports.getClassesMap = function getClassesMap(classes, camelCase) {
  var classesMap = {};

  // Unroll the loop because of performance!
  // Remember that this function will run on every lint (e.g.: on file save)
  switch (camelCase) {
    case true:
      _lodash2.default.forIn(classes, function (value, className) {
        classesMap[className] = className;
        classesMap[_lodash2.default.camelCase(className)] = className;
      });
      break;
    case 'dashes':
      _lodash2.default.forIn(classes, function (value, className) {
        classesMap[className] = className;
        classesMap[dashesCamelCase(className)] = className;
      });
      break;
    case 'only':
      _lodash2.default.forIn(classes, function (value, className) {
        classesMap[_lodash2.default.camelCase(className)] = className;
      });
      break;
    case 'dashes-only':
      _lodash2.default.forIn(classes, function (value, className) {
        classesMap[dashesCamelCase(className)] = className;
      });
      break;
    default:
      _lodash2.default.forIn(classes, function (value, className) {
        classesMap[className] = className;
      });
  }

  return classesMap;
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
    return {}; // user will get error like class 'x' not found
  }

  var fileContent = _fs2.default.readFileSync(filePath);

  var syntax = _path2.default.extname(filePath).slice(1); // remove leading .

  var ast = _gonzales2.default.parse(fileContent.toString(), { syntax: syntax });

  if (!ast) {
    // it will be silent and will not show any error
    return null;
  }

  /*
     mutates ast by removing :global scopes
   */
  (0, _traversalUtils.eliminateGlobals)(ast);

  // recursively iterate over imported files and resolve their styles
  var importedClassesMap = (0, _traversalUtils.getImportedFilePaths)(ast, filePath).reduce(function (all, file) {
    return _extends({}, all, getStyleClasses(file));
  }, {});

  var classesMap = (0, _traversalUtils.getRegularClassesMap)(ast);
  var composedClassesMap = (0, _traversalUtils.getComposesClassesMap)(ast);
  var extendClassesMap = (0, _traversalUtils.getExtendClassesMap)(ast);
  var parentSelectorClassesMap = (0, _traversalUtils.getParentSelectorClassesMap)(ast);

  return _extends({}, importedClassesMap, classesMap, composedClassesMap, extendClassesMap, parentSelectorClassesMap);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbInN0eWxlRXh0ZW5zaW9uUmVnZXgiLCJkYXNoZXNDYW1lbENhc2UiLCJzdHIiLCJyZXBsYWNlIiwibWF0Y2giLCJmaXJzdExldHRlciIsInRvVXBwZXJDYXNlIiwiZ2V0RmlsZVBhdGgiLCJjb250ZXh0Iiwic3R5bGVGaWxlUGF0aCIsInNldHRpbmdzIiwiZGlyTmFtZSIsImRpcm5hbWUiLCJnZXRGaWxlbmFtZSIsImJhc2VQYXRoIiwic3RhcnRzV2l0aCIsInJlc29sdmUiLCJnZXRQcm9wZXJ0eU5hbWUiLCJub2RlIiwicHJvcGVydHlOYW1lIiwiY29tcHV0ZWQiLCJwcm9wZXJ0eSIsInZhbHVlIiwibmFtZSIsImdldENsYXNzZXNNYXAiLCJjbGFzc2VzIiwiY2FtZWxDYXNlIiwiY2xhc3Nlc01hcCIsImZvckluIiwiY2xhc3NOYW1lIiwiZ2V0U3R5bGVJbXBvcnROb2RlRGF0YSIsImdldCIsInRlc3QiLCJpbXBvcnROb2RlIiwiY29tcG9zZSIsImZpbmQiLCJ0eXBlIiwiaW1wb3J0TmFtZSIsImdldFN0eWxlQ2xhc3NlcyIsImZpbGVQYXRoIiwic3RhdFN5bmMiLCJlIiwiZmlsZUNvbnRlbnQiLCJyZWFkRmlsZVN5bmMiLCJzeW50YXgiLCJleHRuYW1lIiwic2xpY2UiLCJhc3QiLCJwYXJzZSIsInRvU3RyaW5nIiwiaW1wb3J0ZWRDbGFzc2VzTWFwIiwicmVkdWNlIiwiYWxsIiwiZmlsZSIsImNvbXBvc2VkQ2xhc3Nlc01hcCIsImV4dGVuZENsYXNzZXNNYXAiLCJwYXJlbnRTZWxlY3RvckNsYXNzZXNNYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFJQTs7OztBQVNBLElBQU1BLHNCQUFzQixpQkFBNUI7O0FBRUEsU0FBU0MsZUFBVCxDQUEwQkMsR0FBMUIsRUFBdUM7QUFDckMsU0FBT0EsSUFBSUMsT0FBSixDQUFZ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QWhCLENBQXBCO0FBQ0QsR0FGMEIsRUFFeEIsRUFGd0IsQ0FBM0I7O0FBSUEsTUFBTTFCLGFBQWEsMENBQXFCb0IsR0FBckIsQ0FBbkI7QUFDQSxNQUFNTyxxQkFBcUIsMkNBQXNCUCxHQUF0QixDQUEzQjtBQUNBLE1BQU1RLG1CQUFtQix5Q0FBb0JSLEdBQXBCLENBQXpCO0FBQ0EsTUFBTVMsMkJBQTJCLGlEQUE0QlQsR0FBNUIsQ0FBakM7O0FBRUEsc0JBQ0tHLGtCQURMLEVBRUt2QixVQUZMLEVBR0syQixrQkFITCxFQUlLQyxnQkFKTCxFQUtLQyx3QkFMTDtBQU9ELENBekNNIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZwIGZyb20gJ2xvZGFzaC9mcCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGdvbnphbGVzIGZyb20gJy4vZ29uemFsZXMnO1xuXG5pbXBvcnQgdHlwZSB7IEpzTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHtcbiAgZ2V0UmVndWxhckNsYXNzZXNNYXAsXG4gIGdldENvbXBvc2VzQ2xhc3Nlc01hcCxcbiAgZ2V0RXh0ZW5kQ2xhc3Nlc01hcCxcbiAgZ2V0UGFyZW50U2VsZWN0b3JDbGFzc2VzTWFwLFxuICBlbGltaW5hdGVHbG9iYWxzLFxuICBnZXRJbXBvcnRlZEZpbGVQYXRocyxcbn0gZnJvbSAnLi90cmF2ZXJzYWxVdGlscyc7XG5cbmNvbnN0IHN0eWxlRXh0ZW5zaW9uUmVnZXggPSAvXFwuKHM/Y3NzfGxlc3MpJC87XG5cbmZ1bmN0aW9uIGRhc2hlc0NhbWVsQ2FzZSAoc3RyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8tKyhcXHcpL2csIGZ1bmN0aW9uIChtYXRjaCwgZmlyc3RMZXR0ZXIpIHtcbiAgICByZXR1cm4gZmlyc3RMZXR0ZXIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBnZXRGaWxlUGF0aCA9IChjb250ZXh0LCBzdHlsZUZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IHNldHRpbmdzID0gY29udGV4dC5zZXR0aW5ncyAmJiBjb250ZXh0LnNldHRpbmdzWydjc3MtbW9kdWxlcyddO1xuXG4gIGNvbnN0IGRpck5hbWUgPSBwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRGaWxlbmFtZSgpKTtcbiAgY29uc3QgYmFzZVBhdGggPSAoc2V0dGluZ3MgJiYgc2V0dGluZ3MuYmFzZVBhdGgpID8gc2V0dGluZ3MuYmFzZVBhdGggOiAnJztcblxuICByZXR1cm4gc3R5bGVGaWxlUGF0aC5zdGFydHNXaXRoKCcuJylcbiAgICA/IHBhdGgucmVzb2x2ZShkaXJOYW1lLCBzdHlsZUZpbGVQYXRoKVxuICAgIDogcGF0aC5yZXNvbHZlKGJhc2VQYXRoLCBzdHlsZUZpbGVQYXRoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRQcm9wZXJ0eU5hbWUgPSAobm9kZTogSnNOb2RlKTogP3N0cmluZyA9PiB7XG4gIGNvbnN0IHByb3BlcnR5TmFtZSA9IG5vZGUuY29tcHV0ZWRcbiAgICAvKlxuICAgICAgIHNxdWFyZSBicmFjZXMgZWcgc1snaGVhZGVyJ11cbiAgICAgICB3ZSB3b24ndCB1c2Ugbm9kZS5wcm9wZXJ0eS5uYW1lIGJlY2F1c2UgaXQgaXMgZm9yIGNhc2VzIGxpa2VcbiAgICAgICBzW2FiY10gd2hlcmUgYWJjIGlzIGEgdmFyaWFibGVcbiAgICAgKi9cbiAgICAgPyBub2RlLnByb3BlcnR5LnZhbHVlXG4gICAgIC8qIGRvdCBub3RhdGlvbiwgZWcgcy5oZWFkZXIgKi9cbiAgICAgOiBub2RlLnByb3BlcnR5Lm5hbWU7XG5cbiAgLypcbiAgICAgc2tpcCBwcm9wZXJ0eSBuYW1lcyBzdGFydGluZyB3aXRoIF9cbiAgICAgZWcuIHNwZWNpYWwgZnVuY3Rpb25zIHByb3ZpZGVkXG4gICAgIGJ5IGNzcyBtb2R1bGVzIGxpa2UgX2dldENzcygpXG5cbiAgICAgVHJpZWQgdG8ganVzdCBza2lwIGZ1bmN0aW9uIGNhbGxzLCBidXQgdGhlIHBhcnNlclxuICAgICB0aGlua3Mgb2Ygbm9ybWFsIHByb3BlcnR5IGFjY2VzcyBsaWtlIHMuX2dldENzcyBhbmRcbiAgICAgZnVuY3Rpb24gY2FsbHMgbGlrZSBzLl9nZXRDc3MoKSBhcyBzYW1lLlxuICAgKi9cbiAgaWYgKCFwcm9wZXJ0eU5hbWUgfHwgXy5zdGFydHNXaXRoKHByb3BlcnR5TmFtZSwgJ18nKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHByb3BlcnR5TmFtZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDbGFzc2VzTWFwID0gKGNsYXNzZXM6IE9iamVjdCwgY2FtZWxDYXNlOiBzdHJpbmd8Ym9vbGVhbik6IE9iamVjdCA9PiB7XG4gIGNvbnN0IGNsYXNzZXNNYXAgPSB7fTtcblxuICAvLyBVbnJvbGwgdGhlIGxvb3AgYmVjYXVzZSBvZiBwZXJmb3JtYW5jZSFcbiAgLy8gUmVtZW1iZXIgdGhhdCB0aGlzIGZ1bmN0aW9uIHdpbGwgcnVuIG9uIGV2ZXJ5IGxpbnQgKGUuZy46IG9uIGZpbGUgc2F2ZSlcbiAgc3dpdGNoIChjYW1lbENhc2UpIHtcbiAgICBjYXNlIHRydWU6XG4gICAgICBfLmZvckluKGNsYXNzZXMsICh2YWx1ZSwgY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgIGNsYXNzZXNNYXBbY2xhc3NOYW1lXSA9IGNsYXNzTmFtZTtcbiAgICAgICAgY2xhc3Nlc01hcFtfLmNhbWVsQ2FzZShjbGFzc05hbWUpXSA9IGNsYXNzTmFtZTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZGFzaGVzJzpcbiAgICAgIF8uZm9ySW4oY2xhc3NlcywgKHZhbHVlLCBjbGFzc05hbWUpID0+IHtcbiAgICAgICAgY2xhc3Nlc01hcFtjbGFzc05hbWVdID0gY2xhc3NOYW1lO1xuICAgICAgICBjbGFzc2VzTWFwW2Rhc2hlc0NhbWVsQ2FzZShjbGFzc05hbWUpXSA9IGNsYXNzTmFtZTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnb25seSc6XG4gICAgICBfLmZvckluKGNsYXNzZXMsICh2YWx1ZSwgY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgIGNsYXNzZXNNYXBbXy5jYW1lbENhc2UoY2xhc3NOYW1lKV0gPSBjbGFzc05hbWU7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Rhc2hlcy1vbmx5JzpcbiAgICAgIF8uZm9ySW4oY2xhc3NlcywgKHZhbHVlLCBjbGFzc05hbWUpID0+IHtcbiAgICAgICAgY2xhc3Nlc01hcFtkYXNoZXNDYW1lbENhc2UoY2xhc3NOYW1lKV0gPSBjbGFzc05hbWU7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBfLmZvckluKGNsYXNzZXMsICh2YWx1ZSwgY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgIGNsYXNzZXNNYXBbY2xhc3NOYW1lXSA9IGNsYXNzTmFtZTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGNsYXNzZXNNYXA7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U3R5bGVJbXBvcnROb2RlRGF0YSA9IChub2RlOiBKc05vZGUpOiA/T2JqZWN0ID0+IHtcbiAgLy8gcGF0aCBmcm9tIHdoaWNoIGl0IHdhcyBpbXBvcnRlZFxuICBjb25zdCBzdHlsZUZpbGVQYXRoID0gZnAuZ2V0KCdzb3VyY2UudmFsdWUnKShub2RlKTtcblxuICBpZiAoc3R5bGVGaWxlUGF0aCAmJiBzdHlsZUV4dGVuc2lvblJlZ2V4LnRlc3Qoc3R5bGVGaWxlUGF0aCkpIHtcbiAgICBjb25zdCBpbXBvcnROb2RlID0gZnAuY29tcG9zZShcbiAgICAgIGZwLmZpbmQoeyB0eXBlOiAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcicgfSksXG4gICAgICBmcC5nZXQoJ3NwZWNpZmllcnMnKSxcbiAgICApKG5vZGUpO1xuXG4gICAgLy8gdGhlIGRlZmF1bHQgaW1wb3J0ZWQgbmFtZVxuICAgIGNvbnN0IGltcG9ydE5hbWUgPSBmcC5nZXQoJ2xvY2FsLm5hbWUnKShpbXBvcnROb2RlKTtcblxuICAgIGlmIChpbXBvcnROYW1lKSB7IC8vIGl0IGhhZCBhIGRlZmF1bHQgaW1wb3J0XG4gICAgICByZXR1cm4geyBpbXBvcnROYW1lLCBzdHlsZUZpbGVQYXRoLCBpbXBvcnROb2RlIH07XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U3R5bGVDbGFzc2VzID0gKGZpbGVQYXRoOiBzdHJpbmcpOiA/T2JqZWN0ID0+IHtcbiAgdHJ5IHtcbiAgICAvLyBjaGVjayBpZiBmaWxlIGV4aXN0c1xuICAgIGZzLnN0YXRTeW5jKGZpbGVQYXRoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7fTsgLy8gdXNlciB3aWxsIGdldCBlcnJvciBsaWtlIGNsYXNzICd4JyBub3QgZm91bmRcbiAgfVxuXG4gIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKTtcblxuICBjb25zdCBzeW50YXggPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnNsaWNlKDEpOyAvLyByZW1vdmUgbGVhZGluZyAuXG5cbiAgY29uc3QgYXN0ID0gZ29uemFsZXMucGFyc2UoZmlsZUNvbnRlbnQudG9TdHJpbmcoKSwgeyBzeW50YXggfSk7XG5cbiAgaWYgKCFhc3QpIHtcbiAgICAvLyBpdCB3aWxsIGJlIHNpbGVudCBhbmQgd2lsbCBub3Qgc2hvdyBhbnkgZXJyb3JcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qXG4gICAgIG11dGF0ZXMgYXN0IGJ5IHJlbW92aW5nIDpnbG9iYWwgc2NvcGVzXG4gICAqL1xuICBlbGltaW5hdGVHbG9iYWxzKGFzdCk7XG5cbiAgLy8gcmVjdXJzaXZlbHkgaXRlcmF0ZSBvdmVyIGltcG9ydGVkIGZpbGVzIGFuZCByZXNvbHZlIHRoZWlyIHN0eWxlc1xuICBjb25zdCBpbXBvcnRlZENsYXNzZXNNYXAgPSBnZXRJbXBvcnRlZEZpbGVQYXRocyhhc3QsIGZpbGVQYXRoKS5yZWR1Y2UoKGFsbCwgZmlsZSkgPT4ge1xuICAgIHJldHVybiB7IC4uLmFsbCwgLi4uZ2V0U3R5bGVDbGFzc2VzKGZpbGUpIH07XG4gIH0sIHsgfSk7XG5cbiAgY29uc3QgY2xhc3Nlc01hcCA9IGdldFJlZ3VsYXJDbGFzc2VzTWFwKGFzdCk7XG4gIGNvbnN0IGNvbXBvc2VkQ2xhc3Nlc01hcCA9IGdldENvbXBvc2VzQ2xhc3Nlc01hcChhc3QpO1xuICBjb25zdCBleHRlbmRDbGFzc2VzTWFwID0gZ2V0RXh0ZW5kQ2xhc3Nlc01hcChhc3QpO1xuICBjb25zdCBwYXJlbnRTZWxlY3RvckNsYXNzZXNNYXAgPSBnZXRQYXJlbnRTZWxlY3RvckNsYXNzZXNNYXAoYXN0KTtcblxuICByZXR1cm4ge1xuICAgIC4uLmltcG9ydGVkQ2xhc3Nlc01hcCxcbiAgICAuLi5jbGFzc2VzTWFwLFxuICAgIC4uLmNvbXBvc2VkQ2xhc3Nlc01hcCxcbiAgICAuLi5leHRlbmRDbGFzc2VzTWFwLFxuICAgIC4uLnBhcmVudFNlbGVjdG9yQ2xhc3Nlc01hcFxuICB9O1xufTtcbiJdfQ==