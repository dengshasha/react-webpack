var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'app/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devtool: 'source-map' //打包时同时创建一个新的sourcemap文件，浏览器调试需要定位文件就是依赖于sourcemap
}