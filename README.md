# react-webpack
搭建react+webpack+es6环境
# 运行项目
`npm install`
`npm start`
# 查看项目
`http://localhost:8080/`



# 配置过程
我一直想试着动手开发一个react项目，但是总有一种万事开头难的感觉，配置webpack真是很头大，没办法，必须要先把环境整好才能安心开发啊。
初始化：新建文件夹react-webpack，在该路径下输入命令：`npm init`全部敲回车，或者你可以根据自己的情况填写一些字段，生成一个package.json文件

###安装react
`npm install react react-dom --save`
`react-dom`是用于一些DOM操作的。

###项目结构
我的项目结构暂时是React的代码都放在app文件夹里面，入口文件是app/index.js，webpack输出文件目录是build，index.html也放在这下面。新建app/index.js和build/index.html。先不急着往里加代码，因为React使用的是ES6的语法，还需要安装插件才能编译通过，我们先一步步来。

###安装webpack
`npm install webpack --save`
全局安装：
 `npm install -g webpack`
配置webpack.config.js文件：
```
var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'app/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devtool: 'source-map' //打包时同时创建一个新的sourcemap文件，浏览器调试需要定位文件就是依赖于sourcemap
}
```
以上就是最简单的配置了，entry定义入口文件，output定义webpack打包后输出文件的目录。
现在来启动一下试试，命令行运行：`webpack`
![2017-06-10_153916.jpg](http://upload-images.jianshu.io/upload_images/5807862-a7a99e41642f680e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
到这里就完成了webpack最最基本简单的配置，这个时候我们还无法运行React项目，需要安装babel才行。

###安装和配置babel
首先需要安装babel的两个核心插件：
`npm install babel-core babel-cli --save`
React使用的ES6语法和JSX语法都要依赖于babel的转码器转码。webpack需要一个babel-loader加载器，babel-preset-es2015和babel-preset-react是分别用来转码ES6和JSX语法的。
安装：`npm install babel-loader babel-preset-es2015 babel-preset-react --save`
webpack.config.js：
```
entry: [
          path.resolve(__dirname, 'app/index.js')
        ],
 output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js',
        },
module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
```
> 注意：我用的webpack版本是2.2.0，在这个版本下`loader: 'babel'`是会报错的，我在看别人的博客发现他们都省略了，如果代码在报错就在后面加上`-loader`吧。

新建.babelrc文件（注：如果在windows下，命令行`echo 文件内容>.babelrc(文件名)`，一定要加文件内容，随便写点才能新建成功）
还有一个小的技巧，由于Linux命令很多不能在windows上面用，比如vi这种命令都没有，只要你安装了git，鼠标右键都会有`Git Bash Here`和`Git GUI Here`，`Git Bash Here`就是命令行操作，在这个命令窗口下是可以使用Linux命令的！！在这个窗口下你可以直接新建文件：`vi xxx`或者`touch xxx`。
.babelrc文件：
```
{
    "presets" : ["es2015", "react"]
}
```
运行一下： `webpack`没问题的话这个时候再写JSX和ES6语法代码就不会报错了。现在我们可以写一个正经的React例子了：
app/index.js:
```
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    render() {
        return(
            <h1 className = "title">Hello, Welcome to React !</h1>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
注：这里的 document.getElementById('app')就是index.html里面的<div id="app"></div>
```
build/index.html:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
</body>
<script src = "bundle.js"></script>
</html>
注：bundle.js就是webpack打包生成的文件，index.html跟bundle.js在同一路径下，所以这里的路径就是bundle.js。后面我会添加一个插件，不用再手动引入打包的文件。
```
再来运行一次：`webpack`（我知道这样很累，但是我们需要慢慢来），如果没有报错的话，找到index.html文件，手动打开，就能看到Hello, Welcome to React !

###安装webpack-dev-server
webpack-dev-server主要是启动了一个类似于Express的http服务器。也就是我们无需像上面一样一直在输入`webpack`启动项目了，这个插件会自动监听文件变化更新的。
安装：`npm install webpack-dev-server --save`
启动项目的默认命令是`npm start`，所有我们将使用webpack-dev-server启动项目的命令放在start中。
package.json：
```
"scripts": {
    "start": "webpack-dev-server --devtool eval-source-map --progress --colors --hot --inline --content-base build"
  },
注：最后一个参数build是生成打包文件的文件夹名字
```
另外，你也可以使用其他的参数比如dev, prod，启动命令像这样：`npm run dev`（项目一般会有生产环境和开发环境，使用不同的参数启动不同的命令开发就可以在这里配置）
webpack.config.js:
```
entry: [
        'webpack-dev-server/client?http://localhost:8080',
        path.resolve(__dirname, 'app/index.js')
    ],
```
运行：`npm start`
![2017-06-08_101549.jpg](http://upload-images.jianshu.io/upload_images/5807862-376f2eb52778276e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这样当我们修改了代码也无需再重启服务器了。
另外，再加一个防止报错的插件：
webpack.config.js：
```
var webpack = require('webpack');
module: {
       //...
    },
plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ]
注：一开始我使用的是NoErrorsPlugin，运行的时候提示已经换成NoEmitOnErrorsPlugin这个插件了。不要忘记在文件顶部引入`var webpack = require('webpack');`
```
###加载和解析CSS样式
安装：`npm install style-loader css-loader less-loader --save`
根据提示 ` less-loader@4.0.4 requires a peer of less@^2.3.1 but none was installed.`
还需要安装less： `npm install less --save`
webpack.config.js：
```
loaders: [
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
//注：一般来说需要引入css-loader和style-loader，其中css-loader用于解析，而style-loader则将解析后的样式嵌入js代码。如果不用less写css可以不安装这个。
```
写个简单的小例子测试一下我们配置的样式文件能不能生效：
app/index.js：
```
import styles from './less/index.less';//引入样式文件

class App extends Component {
    render() {
        return(
            <h1 className = "title">Hello, Melody!</h1>
        )
    }
}
```
这里引入了一个less文件，`index.less`文件的路径是：`app/less`
app/less/index.less:
```
.title {
    text-align: center;
}
注：样式设置的很简单，主要是测试样式有没有生效
```
运行一下：`npm start`，打开[localhost:8080](localhost:8080)，文字居中显示表示我们配置成功了。

###单独编译CSS文件
一般来说CSS文件会很大，可以将其单独编译到别的文件中。使用`extract-text-webpack-plugin`插件
`npm install extract-text-webpack-plugin --save`
配置webpack.config.js文件：
```
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    //...
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader:  'babel-loader',
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
        new ExtractTextPlugin("bundle.css")
    ]
};
注意：旧的写法是 loader: ExtractTextPlugin.extract( 'style-loader', 'css-loader')，我在编译的时候报错，按照提示，改成上面的写法了。
```
由于把CSS文件单独打包了，在index.html里面需要手动引入bundle.css文件。
build/index.html:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="bundle.css">
</head>
<body>
    <div id="app"></div>
</body>
<script src = "bundle.js"></script>
</html>
//注：后面我会添加一个插件无需再手动引入打包后的文件
```
我有点没整明白为什么这个文件生成成功了但是在文件夹里却找不到，[localhost:8080/bundle.css](localhost:8080/bundle.css)却可以访问到。或者打开google调试器，可以看到我们的样式就是来自于bundle.css文件。

###html自动编译
前面我们在`index.html`文件中手动引入了打包后的`bundle.js`和`bundle.css`文件，这个插件就是来解决这个问题的。
安装：`npm install html-webpack-plugin --save`
在html里面不需要手动引入bundle.js这些webpack打包生成的文件，这个插件会自动帮我们引入。
修改build/index.html文件：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```
配置webpack.config.js文件：
```
var HtmlPlugin = require('html-webpack-plugin');
//省略其他配置代码
plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin("bundle.css"),
        new HtmlPlugin({
            title: 'react-webpack',
            template: path.resolve(__dirname, './build/index.html')
        })
    ]
注：'./build/index.html'这个路径就是我们用于打包的index.html文件的所在路径。
```
运行一下，打开调试器：看到html文件里面已经引入了打包文件，表示我们的配置成功了。
![2017-06-09_134635.jpg](http://upload-images.jianshu.io/upload_images/5807862-d8af1ba15972b4a0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

----------------------------------------------2017.8.18更-------------------------------------------------
我把有关eslint的配置去掉了，然后在另一篇文章详细总结了eslint的配置。
---------------------------------------------------END------------------------------------------------------
###总结
我的项目还没有开始，暂时就配置了这些东西，后面如果我用到了新的好用的插件，会回来继续更新的.
我把这个项目结构放在我的github上了。