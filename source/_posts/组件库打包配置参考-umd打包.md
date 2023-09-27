---
title: 组件库打包配置参考-umd打包
date: 2023-09-25 10:55:00
tags: frontend 
banner_img: /images/组件库打包配置参考/background.png
index_img: /images/组件库打包配置参考/background.png
categories: 
  - 前端  
  - 配置
---

# 组件库打包配置参考-umd打包 

今天讲讲关于组件库打包的`umd`打包，这里拿[arco-design](https://arco.design/)的打包工具[arco-cli](https://github.com/arco-design/arco-cli/tree/1.x/packages/arco-scripts)的`1.0`版本来讲解。

### 开始前

> 下面展示的代码可能是笔者更改过的，请勿过分较真(`へ´*)ノ。  

## 开始  

### 代码 

相对于其他几个模块的打包来说，`umd`只是单纯使用`webpack`来输出一个单文件，所以就直接贴代码了。  

```js 
const webpack = require('webpack')
const babelConfig = require('../utils/config/babelConfig')
const packageName = require('../../package.json').name

webpack({
  // 生产模式，会压缩代码
  mode: 'production',
  // 打包入口文件
  entry: `${process.cwd()}/components/index.tsx`,
  output: {
    // 输出的文件路径
    path: `${process.cwd()}/dist`,
    // cdn路径
    publicPath: `https://unpkg.com/${packageName}@latest/dist/`,
    // 文件名称
    filename: '[name].min.js',
    // 外部使用的名称
    library: '[name]',
    libraryTarget: 'umd',
  },
  resolve: {
    // 需要处理的文件
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  // 模块不会被打包
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
  ],
  module: {
    rules: [
      {
        // 解析ts模块
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            // 还是之前esm和cjs用的babel配置
            options: babelConfig,
          },
          {
            loader: 'ts-loader',
            options: {}
          },
        ],
      },
      {
        // 处理less
        test: /\.less$/,
        // 不处理.module.less文件，即不处理模块化样式文件
        exclude: /\.module\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ]
      },
      {
        // 普通css文件处理
        test: /\.css$/,
        sideEffects: true,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
        ],
      },
      {
        // 静态资源处理
        test: /\.(png|jpg|gif|ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      },
      {
        // svg 处理
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        // 模块样式文件处理
        test: /\.module\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:10]',
              },
            }
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ]
      },
    ]
  }
}, (err, stats) => {

  if (err) {
    console.error(err.stack || err);
    return;
  }

  console.log(stats.toString({
    assets: true,
    colors: true,
    warnings: true,
    errors: true,
    errorDetails: true,
    entrypoints: true,
    version: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    children: false,
  }))

  // if (stats.hasErrors()) {
  //   // reject();
  // } else {
  //   // resolve(null);
  // }
})
```
  
### 其他

#### sideEffects  
  tree-shaking 去除无用代码  

```js
// 所有文件都没有副作用，全都可以删除
var sideEffects = false 

// 指定目录或文件没有副作用
var sideEffects = [
  "dist/*",
  "esm/**/style/*",
  "lib/**/style/*",
  "*.less"
]

```

## 结束  

  结束🔚。    

参考链接  
> [Babel7 中 @babel/preset-env 的使用](https://zhuanlan.zhihu.com/p/84799735)  
> [【目录】组件库打包cli教程](https://github.com/lio-mengxiang/mx-design-cli/issues/16)   
> [react 组件库打包指南](https://github.com/lio-mengxiang/mx-design-cli/issues/13)   
> [css-loader中importLoaders的理解](https://zhuanlan.zhihu.com/p/94706976)    
