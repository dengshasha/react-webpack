var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'webpack/hot/dev-server',path.resolve(__dirname, 'app/index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js',
    },
    devtool: 'source-map', //打包时同时创建一个新的sourcemap文件，浏览器调试需要定位文件就是依赖于sourcemap
    module: {
        loaders: [
             {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: path.resolve(__dirname, 'node_module')
            },
            {
                test: /\.js$/,
                loader:'babel-loader',
                exclude: path.resolve(__dirname, 'node_module')
            },
            {
                test: /\.css/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
    ]
}