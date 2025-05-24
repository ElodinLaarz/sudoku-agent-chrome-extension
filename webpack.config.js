// webpack.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map', // For better debugging
  entry: {
    background: './src/background/index.ts',
    content_script: './src/content_script/index.ts',
    side_panel: './src/side_panel/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'static/manifest.json', to: 'manifest.json' },
        { from: 'src/assets', to: 'assets' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/side_panel/sidepanel.html',
      filename: 'sidepanel.html',
      chunks: ['side_panel'],
    }),
  ],
};
