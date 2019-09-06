var prebid = require('./package.json');
var path = require('path');
var webpack = require('webpack');
var helpers = require('./gulpHelpers');
var RequireEnsureWithoutJsonp = require('./plugins/RequireEnsureWithoutJsonp.js');
var { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
var argv = require('yargs').argv;
var allowedModules = require('./allowedModules');

// list of module names to never include in the common bundle chunk
var neverBundle = [
  'AnalyticsAdapter.js'
];

var plugins = [
  new RequireEnsureWithoutJsonp()
];

if (argv.analyze) {
  plugins.push(
    new BundleAnalyzerPlugin()
  )
}

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  resolve: {
    modules: [
      path.resolve('.'),
      'node_modules'
    ],
  },
  output: {
    library: prebid.globalVarName
    // jsonpFunction: prebid.globalVarName + "Chunk"
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve('./node_modules'), // required to prevent loader from choking non-Prebid.js node_modules
        use: [
          {
            loader: 'babel-loader',
            options: helpers.getAnalyticsOptions(),
          }
        ]
      },
      { // This makes sure babel-loader is ran on our intended Prebid.js modules that happen to be in node_modules
        test: /\.js$/,
        include: helpers.getArgModules().map(module => new RegExp('node_modules/' + module + '/')),
        use: [
          {
            loader: 'babel-loader',
          }
        ],
      }
    ]
  },
  plugins
};
