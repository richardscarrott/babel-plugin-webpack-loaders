import { join } from 'path';
import colors from 'colors/safe';
import webpack from 'webpack';
import MemoryFs from 'memory-fs';
import deasync from 'deasync';

export default ({ path, configPath, config, verbose }) => {
  const memFs = new MemoryFs();
  const dest = join(__dirname, '../tmp');
  const name = 'result.js';
  let result;

  // TODO: Add warnings if entry, output.filename or output.path are already
  // defined.
  config.entry = path;
  config.output = config.output || {};
  config.output.filename = name;
  config.output.path = dest;

  const compiler = webpack(config);
  compiler.outputFileSystem = memFs;
  compiler.run((err, stats) => {
    if (err) {
      throw err;
    }
    // TODO: Test verbose logging.
    // TODO: log errors from stats if they exist...
    if (verbose) {
      console.error( // eslint-disable-line
        colors.yellow('Webpack stdout for ' + path + '\n') + // eslint-disable-line prefer-template
        colors.yellow('---------\n') + (JSON.stringify(stats.toJson({
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
        })) + '\n') + colors.yellow('---------'));
    }
    const resultPath = join(dest, name);
    if (memFs.existsSync(resultPath)) {
      result = memFs.readFileSync(resultPath).toString();
    } else {
      result = '';
    }
  });

  deasync.loopWhile(() => result === undefined);

  return result;
};
