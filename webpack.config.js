const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.js',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: isProduction,
      splitChunks: false,
    },
    resolve: {
      fallback: {
        "fs": false,
        "path": false,
        "os": false
      }
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
      clean: true,
    },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { 
                targets: '> 0.25%, not dead',
                useBuiltIns: false
              }], 
              ['@babel/preset-react', {
                runtime: 'automatic'
              }]
            ],
            cacheDirectory: false
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    ...(isProduction ? [new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })] : [])
  ],
    devServer: {
      historyApiFallback: true,
      port: 3001
    }
  };
};