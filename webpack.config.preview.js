const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: [/node_modules/],
        options: {
          emitErrors: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [/node_modules/],
        options: {
          configFile: 'tsconfig.dev.json',
        },
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'static/js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  serve: {
    content: path.resolve(__dirname, 'dist'),
    port: 3000,
  },
  externals: {
    jquery: '$',
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
}
