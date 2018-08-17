const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const entryPath = path.join(__dirname, 'src');
const outPath = path.join(__dirname, 'dist');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    asynchrony: path.join(entryPath, 'asynchrony/index.js'),
    concepts: [
      path.join(entryPath, 'concepts/truthy-falsy.js'),
      path.join(entryPath, 'concepts/template-strings.js'),
      path.join(entryPath, 'concepts/event-delegation.js')
    ],
    objects: [
      'babel-polyfill',
      path.join(entryPath, 'objects/index.js')
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: outPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: entryPath
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: entryPath,
        to: outPath,
        ignore: [
          '*.js'
        ]
      }
    ])
  ],
  devServer: {
    contentBase: path.join(__dirname, outPath)
  }
}
