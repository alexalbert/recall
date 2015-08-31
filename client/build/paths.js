var path = require('path');

var serverBaseDir = path.normalize('./..');
var appRoot = 'src/';
var outputRoot = 'dist/';
var nodeStartupScript = 'server.js';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  sourceTS: appRoot + '**/*.ts',
  html: appRoot + '**/*.html',
  style: 'styles/**/*.css',
  output: outputRoot,
  doc:'./doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  sourceMapRelativePath: '/src',
  nodeJsPort:5000,
  webServerPort : 9000,
  serverBaseDir : serverBaseDir,
  nodeStartUpScriptPath : path.join( serverBaseDir,  nodeStartupScript)
};
