'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _memoryFs = require('memory-fs');

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _deasync = require('deasync');

var _deasync2 = _interopRequireDefault(_deasync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var path = _ref.path;
  var configPath = _ref.configPath;
  var config = _ref.config;
  var verbose = _ref.verbose;

  var memFs = new _memoryFs2.default();
  var dest = (0, _path.join)(__dirname, '../tmp');
  var name = 'result.js';
  var result = void 0;

  // TODO: Add warnings if entry, output.filename or output.path are already
  // defined.
  config.entry = path;
  config.output = config.output || {};
  config.output.filename = name;
  config.output.path = dest;

  var compiler = (0, _webpack2.default)(config);
  compiler.outputFileSystem = memFs;
  compiler.run(function (err, stats) {
    if (err) {
      throw err;
    }
    // TODO: Test verbose logging.
    // TODO: log errors from stats if they exist...
    if (verbose) {
      console.error( // eslint-disable-line
      _safe2.default.yellow('Webpack stdout for ' + path + '\n') + // eslint-disable-line prefer-template
      _safe2.default.yellow('---------\n') + (JSON.stringify(stats.toJson({
        hash: false,
        version: false,
        timings: true,
        assets: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        cached: false,
        reasons: false,
        source: false,
        errorDetails: false,
        chunkOrigins: false
      })) + '\n') + _safe2.default.yellow('---------'));
    }
    var resultPath = (0, _path.join)(dest, name);
    if (memFs.existsSync(resultPath)) {
      result = memFs.readFileSync(resultPath).toString();
    } else {
      result = '';
    }
  });

  _deasync2.default.loopWhile(function () {
    return result === undefined;
  });

  return result;
};