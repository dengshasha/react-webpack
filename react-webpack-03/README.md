### 前言
搭一个脚手架真不是一件容易的事，之前为了学习webpack是怎么配置的选择自己搭建开发环境，折腾了好几天总算对入口文件、打包输出、JSX, es6编译成es5、css加载、压缩代码等这些基础的东西有了一个大体的了解。后来有一次组内分享技术，我作死的选择了webpack，为了看起来高大上又去折腾它的按需加载、怎样处理第三方插件、拆分CSS文件、利用Happypack实现多进程打包等等。彻底把自己搞晕了。再后来接手了一个紧急的项目，实在来不及去折腾webpack了，就选择使用react官方推荐的脚手架[create-react-app](https://github.com/facebookincubator/create-react-app)，这个脚手架确实搭的非常完善，几乎不需要我们修改配置，我也研究了一下它的配置，准备从零开始搭建一个react+webpack的开发环境，配置从简单到复杂，由于内容较多，我将分为几篇文章讲述，这是第一篇。
另外，热更新我单独写成一篇文章了，当你修改一次代码就需要手动启动服务器，然后你烦了的时候，你可以先去把热更新配置好再回来继续：[开始一个React项目(二) 彻底弄懂webpack-dev-server的热更新](http://www.jianshu.com/p/bcad129a1c69)
### 初始化
先贴出项目结构
```
my-app/
  |
  ---  README.md
  --- package.json
  --- webpack.config.js
  --- public/
       |
       --- index.html（模板文件）
       --- favicon.ico（网站图标）
   --- src/（项目文件都在这里）
      |
       --- index.js（入口文件）
       --- pages/ （页面）
       --- components/（抽离的公用组件）
       --- css/
       --- js/
       --- images/
```
一开始最重要的需要你建好的文件是`public/index.html`和`src/index.js`。

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
            filename: 'index.html', //指定文件名
        })
    ]
}
```
这里提示一下生成的HTML路径就是`output.path`指定的路径，不仅如此，像`extract-text-webpack-plugin`分离CSS文件打包的文件路径也是这个路径。
重新运行一下：`npm start`
现在可以看到build路径下已经生成好了一个index.html文件，并且这个文件已经引入了bundle.js文件了。
### 开始React项目
安装: `npm install react react-dom --save-dev`，现在来修改我们的入口文件
`src/index.js`
```
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class App extends Component {
    render() {
        return <h1> Hello, world! </h1>
    }
}

ReactDom.render(
    <App />,
    document.getElementById('root')
)
```
别着急运行，react里面的JSX语法普通浏览器可解析不了，需要安装babel来解析：
`npm install babel babel-cli babel-loader --save-dev`
再安装两个分别用于解析es6和jsx语法的插件：
`npm install babel-preset-env babel-preset-react --save-dev `

`webpack.config.js`
```
module.exports = {
...
  module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'react']
                }
            }
        ]
    }
}
```
现在试着运行一下，没有报错的话，直接双击打开`build/index.html`就可以看到`hello world!`了。

###加载和解析CSS样式
在JSX里面是可以写CSS样式的，只是所有的属性都看做是对象，写过RN的小伙伴应该对这种写法比较熟悉，比如：
```
const styles = {
    container: {
        textAlign: 'center',
        marginTop: '50px'
    },
    containerBtn: {
        margin: '0 20px',
        backgroundColor: '#dde18e'
    }
}
//使用：
<div style={styles.container}>
        <button style={styles.containerBtn}>count+1</button>
</div>  
```
而如果想在JSX文件里面像我们以前的用法一样去引入CSS文件，就只能使用import语句，但是import引入的都会被当做js处理，所以，我们需要对css文件做一个转换。这就需要`css-loader`和`style-loader`，其中`css-loader`用于将css转换成对象，而`style-loader`则将解析后的样式嵌入js代码。
安装：`npm install style-loader css-loader --save`

`webpack.config.js：`
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
        ]
```
使用CSS：`import '../css/index.css';` 只需要注意用`className`而不是`class`就好了。


### 单独编译CSS文件（只在生产环境配置）
一般发布到线上以后，为了加载速度更快会把CSS和JS打包到不同的文件中，使用`extract-text-webpack-plugin`插件可以分离CSS。而其实，开发的时候是不需要单独编译CSS文件的。如果你在开发环境加了这个，又配置了热更新，那么你会发现CSS发生变化时热更新用不了了，所以建议开发环境就不要配置这个了。
`npm install extract-text-webpack-plugin --save`

`webpack.config.js`文件：
```
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
    //...
    module: {
        loaders: [
            {
                test: /\.css/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
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
};
```
###使用PostCSS或者Less, Sass等CSS工具
Less或Sass想必大家都非常熟悉了，[PostCSS](https://github.com/postcss/postcss/blob/HEAD/README.cn.md)可能有的小伙伴没有用过，我也是在`create-react-app`的配置里第一次见到，然后就去搜了一下，发现它挺强大的。它不是什么预处理后处理语言，而是一个平台，这就像Node一直宣称的那样：我是平台！我是平台！我是平台！既然是个平台，那我们就可以在平台上做很多事情，比如说：检查CSS（像eslint检查js那样）、添加浏览器前缀（该平台目前最火的插件）、使用未来的CSS语法（大概就像现在的花呗？？）、函数式语法（类似Sass语法）等等。目前像阿里爸爸，维基百科等都在使用它。我觉得虽然官方介绍了很多插件，但我们用其中的几个就可以了。

之前写过Sass或Less的童鞋估计会问：既然它是个平台那我可以在它上面写Sass(Less)吗？答案是可以的，另外，它也有一个类似于Sass语法的插件，在它上面配置起来非常容易，所以，怎么选择看你咯。

安装：`npm install postcss-loader --save`
安装一些你需要的工具：`npm install autoprefixer precss postcss-flexbugs-fixes --save
`
> 注：[autoprefixer](https://github.com/postcss/autoprefixer)是自动添加浏览器前缀的插件，[precss](https://github.com/jonathantneal/precss)是类似Sass语法的css插件，[postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)是修复了flex布局bug的插件，具体会有哪些bug你可以自行[查看](https://github.com/luisrudge/postcss-flexbugs-fixes)。

`webpack.config.js`文件：
```
{
    test: /\.css$/,
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
                    require('precss'),
                    require('postcss-flexbugs-fixes')
                ]
            }
            
        }
    ]
},
```
测一下配置生效了没有
`src/css/style.css`:
```
$mainColor: #8ce7b4;
$fontSize: 1rem;

@keyframes rotate {
    0%      {transform: rotate(0deg);left:0px;}
    100%    {transform: rotate(360deg);left:0px;}

}
button {
    background: $mainColor;
    font-size: calc(1.5 * $fontSize);
}
.container .logo {
    animation: rotate 10s linear 0s infinite;
}
```
![image.png](http://upload-images.jianshu.io/upload_images/5807862-0c89dbb69cc98d92.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到已经自动帮我们添加了前缀以及可以使用sass语法了,而且这是在css文件里直接写，不需要建其他后缀的文件。
如果你非要用less或者sass，也可以，但我还是会建议你保留postcss，毕竟它有很多有用的插件，只是去掉precss即可。安装：`npm less less-loader --save`
```
{
    test: /\.(css|less)$/, 
    use: [
           //...
        {
            loader: 'postcss-loader',
            options: {
                plugins: () => [
                    require('autoprefixer'),
                    require('postcss-flexbugs-fixes')
                ]
            }
        },
        {
            loader: 'less-loader',
        }
    ]
},
```
好了，现在你可以写less了。
###加载图片资源
我们知道webpack打包会将所有模块打包成一个文件，而我们在开发项目时引入图片资源的时候是相对于当前文件的路径，打包以后这个路径是错误的路径，会导致引入图片失败，所以我们需要一个处理静态资源的加载器，url-loader和file-loader。我看到网上说url-loader是包含了file-loader的功能的，所以我们只需要下载url-loader就可以了，但是我下载完以后它却提示我url-loader依赖file-loader，并且运行项目会报错，所以我又下载了file-loader。url-loader有一个功能是对于指定大小以下的图片会转成base64，这样可以有效减少http请求。
安装：`npm install file-loader url-loader --save`

`webpack.config.js`
```
{
    test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: 'url-loader',
    options: {
      limit: 10000, //1w字节以下大小的图片会自动转成base64
    },
}
```
使用图片有两种情况，一在CSS里面设置背景，二在JSX里面设置背景或`<src>`，
CSS里面和以前的使用方式一样，假如你的目录结构长这样：
```
src
  |
  ---pages/
  --- css/
  --- images/
```
那么在CSS文件里引入背景图的路径就为：
```
.container {
    background: url('../images/typescript.jpeg') no-repeat center / contain;
}
```
在JSX里面引入图片有几种方式：(该页面在pages/下)
```
//方式一：
import tsIcon from '../images/typescript.jpeg';

//方式二：
const tsIcon = require('../images/typescript.jpeg');

//使用方式一：
<img src={tsIcon} alt="" />

//使用方式二：
<div style={{background: `url(${tsIcon}) no-repeat`}}></div>

//使用方式三：
const styles = {
    test: {
        background: `url(${tsIcon}) no-repeat center`
    }
}

render() {
  return (
    <div style={styles.test}></div>
  )
}
```
另外，你也可以测试一些小的icon，看看是不是转换成了很长的一串字符串。
### 配置ESLint
ESLint是用于校验代码规范的。先全局安装ESLint:`npm install eslint -g `
而要校验React项目代码，还需要安装一个eslint-plugin-react插件，  
安装：`npm install eslint eslint-plugin-react --save` 
webpack打包的时候执行eslint检查还需要`eslint-loader`  
安装: `npm install eslint-loader --save`   
配置信息在这里查看：[eslint-loader](https://github.com/MoOx/eslint-loader)  
webpack.config.js:
```
loaders: [
             {
                test: /\.js$/,
                loader: ['react-hot-loader', 'babel-loader'],
                exclude: path.resolve(__dirname, 'node_module')
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: path.resolve(__dirname, 'node_module')
            },
        ],
```
接下来需要配置eslint规则。  
这里我采用命令行来初始化`.eslintrc`文件：`eslint --init`
关于如何配置你的ESLint文件，这里有三个选项：
![2017-06-13_102258.jpg](http://upload-images.jianshu.io/upload_images/5807862-ab76e490d4e3c166.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
1. 根据你喜欢的方式来制定规则，你需要回答一些问题。
2. 使用当下流行的代码规则。
3. 根据你的js文件生成一些规则。

第三种就不需再说了，eslint会去审查你项目中js的代码格式生成相应的规则。先看第二种。键盘上下键选择，回车键确定：
![image.png](http://upload-images.jianshu.io/upload_images/5807862-78c7681c8b418d3e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到有三种流行的代码风格，据说目前最常用的是Airbnb，选择这个回车，接着回答问题：是否使用React，希望生成的eslint文件格式是什么，我选择的是javascript，Airbnb需要安装一些插件，耐心等待就好。
可以看到，在我们项目的根目录下已经生成好了`.eslintrc.js`文件，该文件中只有一句代码：
```
module.exports = {
    "extends": "airbnb"
};
```
![image.png](http://upload-images.jianshu.io/upload_images/5807862-2f734f06c6b047a1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
至于该插件有哪些规则，大家可以自行查阅，反正我用这个插件就是一片红，代码规则太严厉。所以我放弃了。
现在选择第一种方式，自定义代码规则，根据自己的使用情况选择。  
![2017-06-13_102509.jpg](http://upload-images.jianshu.io/upload_images/5807862-0fb61880c1b33003.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
现在给我生成的.eslintrc.js文件是这样的：
```
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
```
我在选择的时候选择了要支持ES6，JSX语法，可以看到在配置文件中已经有了配置信息：` "es6": true`,` "jsx": true`等等。
现在来运行一下`npm start`
给我报了一堆错：
![2017-06-13_144448.jpg](http://upload-images.jianshu.io/upload_images/5807862-acd1ccee2eeab27e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
最后三个错误是因为我设置的缩进和我代码的缩进不一致，我用的编辑器是Sublime Text3，我发现这里检查到的错误是我使用了空格缩进而不是tab缩进，所以我需要修改Sublime的配置，打开Preferences--> Settings会出现两个文件，我们修改Preferences.sublime-settings--User：
```
{
    "tab_size": 4,
    "translate_tabs_to_spaces": false
}
```
修改了以后之前写的代码格式不会改变，这个规则只会在之后生效，所以还需要针对项目中的每个文件（记住要选中代码）选择菜单栏 View--> Indentation --> Convert Indentation to tabs。
或者可以直接改变.eslintrc.js文件：
```
"rules": {
        "indent": [
            "error",
            4
        ],
}
//使用空格缩进，我习惯四格
```

semi的错误我查了一下，[semi](http://eslint.cn/docs/rules/semi),两个参数`never`和`always`,`never`是句末始终没有分号，`always`与它相反，我设置的是`never`，文档里的说法是"never" 禁止在语句末尾使用分号 (除了消除以 [、(、/、+ 或 - 开始的语句的歧义)，所以我删除了代码中的分号。
```
"semi": [
            "error",
            "never"
        ],
```
` 'React' is defined but never used`这个错误的解决方式：
.eslintrc.js:
```
 "rules": {
        //...
        "react/jsx-uses-react": 1,
    }
```
剩下的两个错误` 'styles' is defined but never used`和` 'App' is defined but never used`解决办法：
```
 "rules": {
        "no-unused-vars": 1,
    }
```
重新编译一下，这两个会报警告，没关系，终于编译过了一次了。
### 总结
我的项目还没有开始，暂时就配置了这些东西，后面如果我用到了新的好用的插件，会回来继续更新的.
我把这个项目结构放在我的[github](https://github.com/dengshasha/react-webpack)上了。