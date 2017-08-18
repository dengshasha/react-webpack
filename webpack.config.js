var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        path.resolve(__dirname, 'app/index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devtool: 'source-map', //打包时同时创建一个新的sourcemap文件，浏览器调试需要定位文件就是依赖于sourcemap
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader:'babel-loader',
                exclude: path.resolve(__dirname, 'node_module')
            },
            {
                test: /\.css/,
               loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
            },
            {
                test: /\.less/,
               loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!less-loader'})
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin("bundle.css"),
        new HtmlPlugin({
            title: 'react-webpack',
            template: path.resolve(__dirname, './build/index.html')
        })
    ]
}