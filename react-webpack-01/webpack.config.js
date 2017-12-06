const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const publicPath = '/';
const buildPath = 'build';

module.exports = {
	entry: [
		'react-hot-loader/patch',
		path.resolve(__dirname, './src/index.js')
	],
	output: {
		path: path.resolve(__dirname, buildPath), //打包文件的输出路径
		filename: 'bundle.js', //打包文件名
		publicPath: publicPath,
	},
	devtool: 'inline-source-map',
	devServer: {
		publicPath: publicPath,
		contentBase: path.resolve(__dirname, buildPath),
		compress: true,
		inline: true,
		hot: true,	
		hotOnly: true
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['env', 'react'],
					plugins: ["react-hot-loader/babel"]
				}
			},
			{
				test: /\.css/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html'
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
	],
	
}

