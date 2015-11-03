var path = require('path');

module.exports = {
    entry: [
      path.resolve(__dirname, 'app/main.js'),
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:8080',
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query:  {presets:['es2015','react']}
        }
      ]
    }
};
