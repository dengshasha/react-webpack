### 前言
搭一个脚手架真不是一件容易的事，之前为了学习webpack是怎么配置的选择自己搭建开发环境，折腾了好几天总算对入口文件、打包输出、JSX, es6编译成es5、css加载、压缩代码等这些基础的东西有了一个大体的了解。后来有一次组内分享技术，我作死的选择了webpack，为了看起来高大上又去折腾它的按需加载、怎样处理第三方插件、拆分CSS文件、利用Happypack实现多进程打包等等。彻底把自己搞晕了。再后来接手了一个紧急的项目，实在来不及去折腾webpack了，就选择使用react官方推荐的脚手架[create-react-app](https://github.com/facebookincubator/create-react-app)，这个脚手架确实搭的非常完善，几乎不需要我们修改配置，我也研究了一下它的配置，准备从零开始搭建一个react+webpack的开发环境，配置从简单到复杂，希望可以给对webpack一窍不通的小伙伴一点指引。

由于内容较多，我将有关webpack配置分为了几节，这篇是第一节，主要总结webpack-dev-server实现热更新的坑，目前为止我没有搜到一篇深入讲解这个的，如果你觉得它很简单，那么或许等你看完这篇文章你会有不一样的看法。

另外，这篇文章也是我搭建webpack环境的第一篇，所以一开始插入了一些简单的配置内容，只想看`webpack-dev-server`有关的内容可以直接跳到后面。
### 初始化
新建一个项目，使用`npm init`初始化生成一个package.json文件。可以全部回车，后面反正是可以修改的。

安装webpack: `npm install webpack --save-dev`

全局安装： ```npm install webpack -g```(全局安装以后才可以直接在命令行使用webpack)

一个最简单的webpack.config.js文件可以只有entry(入口文件)和output(打包输出路径)
新建`webpack.config.js`
```
const path = require('path');

module.exports = {
    entry: './src/index.js', //相对路径
    output: {
        path: path.resolve(__dirname, 'build'), //打包文件的输出路径
        filename: 'bundle.js' //打包文件名
    }
}
```
新建入口文件 `src/index.js`
```
function hello() {
    console.log('hello world');
}
```
好了这就够了，我们已经可以运行这个项目了，打开命令窗口试一下：`webpack`

编译成功了，项目根目录下已经生成好build/bundle.js文件了，bundle.js文件前面的几十行代码其实就是webpack对怎么加载文件，怎么处理文件依赖做的一个声明。
我们可以将启动wepback的命令写到package.json中并添加一些有用的参数：

`package.json`
```
"scripts": {
    "start": "webpack --progress --watch --hot"
  },
```
`progress`是显示打包进程，`watch`是监听文件变化，`hot`是启动热加载，更多命令行参数详见：[webpack cli](https://webpack.js.org/api/cli/)
以后只需要执行`npm start`就可以了。
### 添加模板文件index.html
配置react项目最重要的两个文件是入口文件（这里是src/index.js）和html模板文件(这里是public/index.html)，入口文件是整个项目开始运行的地方，模板文件是构建DOM树的地方，相信有一部分小伙伴在网上看到的教程是直接在打包路径build里面建一个index.html，然后手动或者使用`html-webpack-plugin`将打包后的js引入，这样存在一个问题是build本身是打包路径，而这个路径的所有文件都不应该是我们手动去添加的，甚至包括这个文件夹也不是我们事先建好的。所以最好是按照`create-react-app`的方式，将这类不需要被webpack编译的文件放到public路径下。

```public/index.html```
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```
现在要让webpack知道这就是我们的html入口文件，并且我们不需要手动引入打包后的js文件，需要安装`html-webpack-plugin`:

`npm install html-webpack-plugin --save-dev`

`webpack.config.js`
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', //指定模板路径
        })
    ]
}
```
重新运行一下：`npm start`
现在可以看到build路径下已经生成好了一个index.html文件，并且这个文件已经引入了bundle.js文件了。

### 使用webpack-dev-server
我当时配这个东西弄了好久，觉得它实在太复杂了，主要是在网上搜的文章太误导人了，把源文档翻译直接翻译过来，还翻译错了。最近有时间了正好再研究研究，发现通彻了很多，希望我能把这个东西讲的稍微清楚一点，让大家对它有一个简单的认识，至少看完以后知道配置一个最基础的`webpack-dev-server`是怎样的。好了，我们开始吧。

webpack-dev-server主要是启动了一个类似于node.js的express 服务器，并且可以实现监听文件变化自动打包编译，虽然使用webpack的 --hot参数也可以做到，但当项目变大了，打包进程就变得非常慢，而webpack-dev-server是直接将打包文件放到内存中的，大大加速了打包进程。

全局安装：`npm install webpack-dev-server --g` (全局安装以后才可以直接在命令行使用webpack-dev-server)

本地安装：`npm install webpack-dev-server --save-dev`

一个简单的启动`webpack-dev-server`的命令：`webpack-dev-server --content-base build/` 

` --content-base`是指定保存打包文件的路径，它和webpack.config.js的`output.path`设置路径最好保持一致，不过这个参数设置不是必需的，因为devServer是将打包文件放到内存中的，你在你的项目中是看不到这个文件的。
`webpack-dev-server`会默认启动8080端口，此时打开[localhost:8080](localhost:8080)就能看到项目启动起来了。不过此时`webpack-dev-server`可还没开始发挥它的作用，它还不能实现自动刷新。

### webpack-dev-server实现自动刷新
`webpack-dev-server`支持两种自动刷新方式，这两种方式都支持热更新。
> 1.  Iframe mode 
> 2.  Inline mode

使用iframe模式不需要配置任何东西，只需要在你启动的项目的端口号后面加上`/webpack-dev-server/`即可，比如：
[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)
![image.png](http://upload-images.jianshu.io/upload_images/5807862-6c27c825f4e706f2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

打开调试器可以看到`webpack-dev-server`在页面中嵌入了一个<iframe>标签来实现热更新，具体原理我还没去研究，有兴趣的小伙伴可以自行搜索。此时试着更改`src/index.js`发现页面已经可以自动刷新了。

inline模式实在是个磨人的小妖精，[官方文档](http://webpack.github.io/docs/webpack-dev-server.html)有关Inline mode的使用说明比较少，而且还极容易误导人，再加上网上很多自己都没搞清楚`webpack-dev-server`的博主的文章，就更容易让人懵逼了。

**误导一：inline模式的HTML方式和Node.js方式都需要配置参数`inline`才能生效。**

文档把HTML方式和Node.js方式都称为inline模式，以至于很多人都误解了这两种用法，但是文档里有这么一句话：
> Inline mode with Node.js API
There is no inline: true flag in the webpack-dev-server configuration, because the webpack-dev-server module has no access to the webpack configuration. 

意思是使用Node.js方式是没有inline这个参数的，这里的inline模式其实就是三种配置方式，三选一就行。
- 在webpack.config.js里面配置
```
module.exports = {
  ...
  devServer: {
    inline: true,
  },
}
```
- 在HTML里面添加`<script src="http://localhost:8080/webpack-dev-server.js"></script>`
- 在node.js的配置文件里面配置(以下摘自官网，后面我会详解这个配置)
```
var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {...});
server.listen(8080);
```
**误导二：需要在entry属性里添加`webpack-dev-server/client?http://«path»:«port»/`**

这个误解应该来自于别的博客，我搜了很多文章都在entry里加了这句话，如果是开启热更新还会加`webpack/hot/dev-server`。这一点[官网](http://webpack.github.io/docs/webpack-dev-server.html)解释的非常清楚，由于采用Node.js配置，webpack-dev-server模块无法读取webpack的配置，所以用户必须手动去webpack.config.js的entry指定webpack-dev-server客户端入口。意思是只有采用Node.js方式才会需要添加这句话，而且，我们并不需要去污染webpack.config.js文件，而是将这句代码写在Node.js 的配置文件里：
```
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
```
`config.entry`就是`webpack.config.js`的entry, entry是一个数组，这里要注意一下你自己的entry配置，如果是
```
entry: [
    path.resolve(__dirname, './src/index.js')
],
```
那你应该写成：
`config.entry.unshift("webpack-dev-server/client?http://localhost:8080/");`

**还懵逼吗？那我再多说两句**

以上这些乱七八糟的配置估计把你都看晕了吧，我再梳理一下有关inline模式的东西，HTML方式最简单，在`index.html`页面里添加一个<script>标签就行了，如果不想用Node.js配置，直接用`webpack-dev-server`，那么配置参数可以写在`webpack.config.js`的`devServer`里面，或者直接写在命令行里面，具体写法参考[https://webpack.js.org/configuration/dev-server/](https://webpack.js.org/configuration/dev-server/)，它会注明哪些参数是只能用于CLI（命令行）的。此时启动项目：
```
"scripts": {
    "start": "webpack-dev-server 你的启动参数可以写在这里也可以写在devServer里"
  },
```
如果使用Node.js方式，那么即使你配置了`devServer`也会被忽略，真正起作用的应该是Node.js的`server.js`文件，这个文件作为配置文件放在根目录下。
此时启动项目：
```
"scripts": {
    "start": "node server.js"
  },
```
### webpack-dev-server实现热更新(HMR)
> 注：以下配置都是针对inline模式，官方也只提了inline模式的配置方式。

热更新可以做到在不刷新浏览器的前提下刷新页面，热更新的好处是：
- 保持刷新前的应用状态(这一点在react里是做不到的，具体原因看下面)
- 不浪费时间在等待不必要更新的组件被更新上面
- 调整CSS样式的速度更快

采用非Node模式，添加`hot: true`，并且一定要指定`output.publicPath`，建议`devServer.publicPath`和`output.publicPath`一样。

`webpack.config.js`
```
const publicPath = '/';
const buildPath = 'build';

output: {
        path: path.resolve(__dirname, buildPath), //打包文件的输出路径
        filename: 'bundle.js', //打包文件名
        publicPath: publicPath, //重要！
    },
    devtool: 'inline-source-map',
    devServer: {
        publicPath: publicPath,
        contentBase: path.resolve(__dirname, buildPath),
        compress: true,
        inline: true,
        hot: true,  
    },
```
以上是官网的配置，但是当你启动项目的时候却发现报错了：
![image.png](http://upload-images.jianshu.io/upload_images/5807862-c38978aa4e9c323b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
那么你需要添加`new webpack.HotModuleReplacementPlugin(),`到plugins里面，不要问我为啥刚刚不说，因为官网自己说的它会自动帮我们添加这个plugin的，谁知道它只是说说而已呢（微笑脸）。

采用Node模式分三步走：
- webpack的entry添加：`webpack/hot/dev-server`
- webpack的plugins添加`new webpack.HotModuleReplacementPlugin()`
- webpack-dev-server添加`hot: true`

`server.js`
```
config.entry.unshift("webpack-dev-server/client?http://localhost:8080/", 'webpack/hot/dev-server');
let server = new WebpackDevServer(compiler, {
    contentBase: config.output.path,  
    publicPath: config.output.publicPath,
    hot: true
    ...
});
注：我不太清楚这里是否必须要配置publicPath，经测试不配置也是可以的。
```
`webpack.config.js`
```
plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
],
```
好的，选择一个你喜欢的方式启动起来吧，如果能在控制台看到以下的信息，代表热更新启动起来了：
```
[HMR] Waiting for update signal from WDS...
[WDS] Hot Module Replacement enabled.
```

最后根据[Hot Module Replacement](https://webpack.js.org/guides/hot-module-replacement/)的指示再添加一个`NamedModulesPlugin `，它的作用大概是更容易分析依赖：
```
plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
```
### HMR真的开始发挥作用了吗？
你大概要生气了，我做了这么多事情就配置了hot和inline两个参数，现在你告诉我我的热更新还不可用？我不要面子的吗？
其实我也很烦，尽管官网看起来很简单，但我却花了很长时间来弄这个。我也以为我弄好了，直到我看到了这个：
![滚屏.gif](http://upload-images.jianshu.io/upload_images/5807862-ca56e84a31a01767.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我修改了`src/index.js`文件并保存，注意看右边调试器的变化，它打印了`[WDS] App updated.Recompiling`等信息，然后浏览器刷新，左边界面更新。
这，不是HMR的功劳。我们不配置HMR，只配置自动刷新就是这种效果。
再看一个真正的热更新：

![热更新.gif](http://upload-images.jianshu.io/upload_images/5807862-4e1b1319a728d2eb.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

注意看当我代码修改的时候，页面并没有刷新，并且左边日志能看到HMR开始工作打印的日志。
而出现这两种情况的原因是：前一个是修改的js，后一个是修改的css。

来自于devServer官方的解释是（找了半天也没找到）借助于`style-loader`CSS很容易实现HMR(到这里我还没有配置加载CSS的loader)，而对于js，devServer会尝试做HMR，如果不行就触发整个页面刷新。你问我什么时候js更改才会只触发HMR，那你可以试着再加一个参数`hotOnly: true`试一试，这时候相当于禁用了自动刷新功能，然而devServer会告诉你这个文件不能被热更新哦。
![image.png](http://upload-images.jianshu.io/upload_images/5807862-442fd5ff8282c142.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果你觉得可以接受每次修改js都重刷页面，那么到这里就可以了。如果你还想继续追究下去，那么继续吧。
> 如果已经通过 [`HotModuleReplacementPlugin`](https://doc.webpack-china.org/plugins/hot-module-replacement-plugin) 启用了[模块热替换(Hot Module Replacement)](https://doc.webpack-china.org/concepts/hot-module-replacement)，则它的接口将被暴露在[`module.hot`属性](https://doc.webpack-china.org/api/module-variables#module-hot-webpack-specific-)下面。通常，用户先要检查这个接口是否可访问，然后再开始使用它。
——引自webpack官网

其实很简单，我们把整个项目的要被webpack编译的文件都设置为接受热更新，而最简单的方式就是在入口文件的地方添加：
`src/index.js`
```
if (module.hot) {
  module.hot.accept(() => {
    ReactDom.render(
        <App />,
        document.getElementById('root')
    )
  })
}

ReactDom.render(
    <App />,
    document.getElementById('root')
)
```
尝试修改js文件，可以看到控制台：
![image.png](http://upload-images.jianshu.io/upload_images/5807862-11fef8f780c0eabc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
很棒，它终于起作用了。

你以为的结局其实并不是结局。
OK，到这里我是不是该写点总结然后愉快的结束这篇文章了？嗯。。我只能说不能高兴的太早。
还有什么问题没有解决？让我们再看个经典的计时器栗子
```
constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
}
add() {
        this.setState((preState) => {
            return{
                count: preState.count + 1
            }
        })
    }

    sub() {
        this.setState((preState) => {
            return{
                count: preState.count - 1
            }
        })
    }

    render() {
        return(
            <div className="container">
                <h1>{this.state.count}</h1>
                <button onClick={() => this.add()}>count+1</button>
                <br/>
                <button onClick={() => this.sub()}>count-1</button>
                <h1>Hello, React</h1>
            </div>  
        ) 
    }
```
现在让我到页面里面执行几次加减，只要让`count`不停在初始值就好，然后修改js，看看热更新的效果：

![react热更新.gif](http://upload-images.jianshu.io/upload_images/5807862-674974c25801a384.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
它没有保存上一次的状态，而是回到了初始状态0。如果希望热更新还可以保留上一次的状态，我们需要另一个插件：[react-hot-loader](https://github.com/gaearon/react-hot-loader)
### 可以保存状态的热更新插件——react-hot-loader
`webpack-dev-server`的热更新对于保存react状态是无法做到的，所以才有了`react-hot-loader`这个东西，这个不是必须配置的插件，至少我没在`create-react-app`里面看到它。不过如果你想要更新时可以保存state，这是必须的。
让我们接着配置它吧，照着[github上的教程](https://github.com/gaearon/react-hot-loader)走就行。
1. 下载：`npm install --save react-hot-loader`
2.  接着，添加babel配置：
```
{
    test: /\.js$/,
    loader: 'babel-loader',
    query: {
        presets: ['env', 'react'],
        plugins: ["react-hot-loader/babel"] //增加
    }
}
```
3.  entry参数：
```
entry: [
    'react-hot-loader/patch', //添加
    path.resolve(__dirname, './src/index.js')
],
```
4. 修改index.js
```
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Home from './pages/Home';

if (module.hot) {
  module.hot.accept(() => {
    ReactDom.render(
        <AppContainer>
            <Home />
        </AppContainer>,
        document.getElementById('root')
    )
  })
}

ReactDom.render(
    <AppContainer>
        <Home />
    </AppContainer>,
    document.getElementById('root')
)
```
这里要注意一下，index.js里面不能直接render一个组件然后让它包裹在<AppContainer>里面，只能单独抽离组件，否则会报错。
现在可以见证奇迹啦：
![react热更新1.gif](http://upload-images.jianshu.io/upload_images/5807862-5ec0faf40df557f0.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 小结
这篇文章花了我一周多的时间，最后总算弄清楚了热更新到底是怎么回事，百度一搜全都是你只要配置一个`hot: true`就好啦，然后都没弄明白这到底是热更新还是自动刷新，可供参考的文档只有官网，官网又讲的太简单，所以折腾了特别久。看不懂的小伙伴可以给我留言，或者我哪里讲的不对的都可以提出来。
本来准备一篇文章搞定devServer的配置，由于这部分内容太多所以分成两篇了，接下来我会继续优化devServer的配置，包括使用Node.js配置的方法。