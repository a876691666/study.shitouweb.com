const
  webpack = require('webpack'),
  path = require('path'),
  glob = require('glob'),
  opn = require('opn');//打开浏览器

var
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  HtmlWebpackPlugin = require('html-webpack-plugin');

/***********************设置module.exports中的plugins***************************/
/*
    定义一个数组，module.exports中的plugins项可以直接使用这个数组
 */
var plugins = [
  new webpack.HotModuleReplacementPlugin(),
];
/*
    调用ExtractTextPlugin，把单独的css打到dist/css/下面，该路径也是从distPath开始
    [name]为引用这个css文件的js文件的入口文件打包后的名字，即入口文件output后的名字
 */
plugins.push(new ExtractTextPlugin("css/[name].css"));
plugins.push(new HtmlWebpackPlugin({
  filename: '../index.html',
  template: 'src/index.html'
}))

module.exports = {
  optimization: {
    splitChunks: {
      name: 'common'
    },
    minimize: true
  },
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'), // 输出的路径
    publicPath: '/react/dist/',
    filename: 'bundle.js' // 打包后文件
  },
  mode: 'development',
  resolve: {
    //require文件的时候不需要写后缀了，可以自动补全
    extensions: ['*', '.js', '.jsx', '.css']
  },
  plugins: plugins,
  module: {
    rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader"
        }]
      },
      {
        test: /\.css$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'file-loader'
        }, ]
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: 8888,
    hot: true,
    open:true
  }
}
