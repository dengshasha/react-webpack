const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const publicPath = '/';

module.exports = {
	entry: [
		'react-hot-loader/patch',
		path.resolve(__dirname, './src/index.js')
	],
	output: {
		path: path.resolve(__dirname, 'build'), //打包文件的输出路径
		filename: 'bundle.js', //打包文件名
		publicPath: publicPath,
	},
	devServer: {
		publicPath: publicPath,
		contentBase: path.resolve(__dirname, 'build'),
		inline: true,
		hot: true,	
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
                test: /\.(css|less)$/,
    			use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                        	plugins: () => [
                        		require('autoprefixer'),
                        		//require('precss'), //如果要使用less就不用这个插件了
                        		require('postcss-flexbugs-fixes')
                        	]
                        }
                        
                    },
                    {
                    	loader: 'less-loader',
                    }
                ]
            },
			{
				test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: 'url-loader',
				options: {
				  limit: 10000,
				},
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html'
		}),
		new ExtractTextWebpackPlugin("bundle.css")
	],
	
}







