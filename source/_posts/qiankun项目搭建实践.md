---
title: qiankun项目搭建实践
date: 2023-04-27 17:10:08
tags: front 
banner_img: /images/qiankun项目搭建实践/background.jpg
index_img: /images/qiankun项目搭建实践/background.jpg
categories:
  - 前端 
---


## 介绍

### 什么是微前端？

> **微前端**是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以**独立开发**、**独立部署**。同时，它们也可以在**共享组件**的同时进行并行开发——这些组件可以通过`NPM`或者`Git Tag`、`Git Submodule`来管理。

### 为什么要使用微前端？  

- 各个子项目的技术栈是独立的，可以使用任何技术研发。  
- 独立子项也可以单独运行。  
- 各个子项的状态都是隔离的。  

### 本文将介绍[qiankun](https://qiankun.umijs.org/zh)项目的简单搭建。  
> qiankun 是一个基于 single-spa 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。  
qiankun 孵化自蚂蚁金融科技基于微前端架构的云产品统一接入平台，在经过一批线上应用的充分检验及打磨后，我们将其微前端内核抽取出来并开源，希望能同时帮助社区有类似需求的系统更方便的构建自己的微前端系统，同时也希望通过社区的帮助将`qiankun`打磨的更加成熟完善。  
目前`qiankun`已在蚂蚁内部服务了超过`2000+`线上应用，在易用性及完备性上，绝对是值得信赖的。  


## 开始

本次的`demo`项目的代码都在[github](https://github.com/food-billboard/qiankun-practice)，可自行查看运行。  

> 本次项目使用[umi](https://umijs.org/ )作为基座，分别配置`react`、`vue`、`angular`、`jquery`子应用。  
主项目及子项目都只是简单完成了最基础的一些配置，后续可能会继续完善。  

### umi主应用  
> version: 4.+  

`umi`社区有相关接入`qiankun`的插件，可以使用插件([@umijs/plugin-qiankun](https://github.com/umijs/plugins/tree/master/packages/plugin-qiankun))，也可以直接使用`qiankun`。  
这里是选择使用**插件**。  

- 安装插件  
`yarn add @umijs/plugin-qiankun -D`  
- 修改配置文件`.umirc.ts`  
```ts
  import { defineConfig } from '@umijs/max';
  import { apps } from './config/qiankun'
  import routes from './config/routes'

  export default defineConfig({
    // 路由配置
    routes,
    // qiankun配置
    qiankun: {
      master: {
        apps 
      }
    },
  });
```
- 修改路由配置(`./config/routes`)  
```ts

export default [
  {
    // 侧边栏的名称
    name: 'react子应用',
    // 路由
    path: '/sub-react-project',
    // 子应用的名称
    // 和下面apps的配置的name对应
    microApp: 'sub-react-project'
  },
  {
    name: 'vue子应用',
    path: '/sub-vue-project',
    microApp: 'sub-vue-project'
  },
  {
    name: 'angular子应用',
    path: '/sub-angular-project',
    microApp: 'sub-angular-project'
  },
  {
    name: 'jquery子应用',
    path: '/sub-jquery-project',
    microApp: 'sub-jquery-project'
  },

]
```
- 设置子应用路由配置(`./config/qiankun`)  
```ts 
export const apps = [
  {
    // 子应用名称
    // 和上面路由的name对应
    name: 'sub-react-project',
    // 访问地址 
    entry: '//localhost:5000',
    // 子应用的容器id
    container: '#sub-react-project',
    // 匹配子应用的路由规则
    activeRule: '/sub-react-project',
  },
  {
    name: 'sub-vue-project', 
    entry: '//localhost:5001',
    container: '#sub-vue-project',
    activeRule: '/sub-vue-project',
  },
  {
    name: 'sub-angular-project', 
    entry: '//localhost:5002',
    container: '#sub-angular-project',
    activeRule: '/sub-angular-project',
  },
  {
    name: 'sub-jquery-project', 
    entry: '//localhost:5003',
    container: '#sub-jquery-project',
    activeRule: '/sub-jquery-project',
  },
]
```

完成上面的步骤，主应用的搭建就算是完成了。  
启动项目就能看到，如下图。  

<img src="/images/qiankun项目搭建实践/主应用.jpg" />

### React子应用  
> version: 18.+   
cli: create-react-app 5.+  

- 在`/src/packages`下新建`react`子应用  
`yarn create react-app sub-react-project --template typescript`  
- 安装[customize-cra](https://github.com/arackaf/customize-cra)和[react-app-rewired](https://github.com/timarney/react-app-rewired)扩展配置    
`yarn add customize-cra react-app-rewired -D`  
- 修改`package.json`  
```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
  },
}
```
- 新增`config-overrides.js`文件  
```js
  const { 
  override, 
  overrideDevServer, 
  watchAll,
} = require('customize-cra');
const packageName = require('./package.json').name

module.exports = {
  webpack: override(
    (config) => {
      config.output = {
        ...config.output,
        library: `${packageName}-[name]`,
        libraryTarget: 'umd',
        // webpack5 以前用jsonFunction
        chunkLoadingGlobal: `webpackJsonp_${packageName}`,
      }
      return config 
    },
  ),
  devServer: overrideDevServer(config => {
    config.headers = config.headers || {} 
    config.headers['Access-Control-Allow-Origin'] = '*'
    return config 
  }, watchAll())
}
```
- 增加publicPath.js文件(`./src/publicPath.js`)  
```js
// micro-app-vue/src/public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```
- 入口文件修改(`./src/index.tsx`)  
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom"
// 引入publicPath全局赋值
import './publicPath'
import routes from './routes'

let root: ReactDOM.Root;

// 如果没有这个变量就说明是独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

// 渲染函数
function render(props?: any) {
  root?.unmount()

  root = ReactDOM.createRoot(
    document.getElementById('sub-react-project') as HTMLElement
  );
  const router = createHashRouter(routes);
  root.render(<RouterProvider router={router} fallbackElement={<div>数据加载中...</div>} />);
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  render(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props: any) {
  root?.unmount()
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props: any) {}
```

完成上面的步骤，子应用的搭建就算是完成了。  
启动项目就能看到，如下图。  
<img src="/images/qiankun项目搭建实践/react子应用.jpg" />

### Vue子应用  
> version: 3.+  
cli: 5.+  

- 在`/src/packages`下新建`vue`子应用  
`vue create sub-vue-project`  
跟着步骤初始化  
- 同样按照上面`react`子应用的配置修改`vue.config.js`  
```js
  const path = require('path')
  const { name: packageName } = require('./package.json')

  module.exports = {
    configureWebpack: {
      output: {
        library: `${packageName}-[name]`,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${packageName}`,
      },
    },
    devServer: {
      // 监听端口
      port: 5001,
      // 配置跨域请求头，解决开发环境的跨域问题
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  }
```
- 同样创建`publicPath.js`  
- 同样在入口文件新增配置(`./src/main.js`)  
```js
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './config/routes'
import './publicPath'
import App from './App.vue'

let root;
let router 

function render() {
  router = createRouter({
    history: createWebHashHistory(),
    routes
  })

  root = createApp(App)
  root.use(router)
  root.mount('#sub-vue-project')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {}

export async function mount(props) {
  render(props)
}

export async function unmount() {
  root.$destroy()
  root = null 
  router = null 
}

export async function update(props) {}
```

完成上面的步骤，子应用的搭建就算是完成了。  
启动项目就能看到，如下图。  
<img src="/images/qiankun项目搭建实践/vue子应用.jpg" />

### Angular子应用  
> version: 15.+    

### Jquery子应用  
> version: 3.+  

### 一些问题
#### 子应用静态资源404

## 结束

> 参考链接
  [微前端实战 - 基于 qiankun 的最佳实践](https://github.com/a1029563229/blogs/tree/master/BestPractices/qiankun)  
  [项目实践](https://qiankun.umijs.org/zh/guide/tutorial)   
  [微前端系列讲解--应用集成方案（qiankun+umi+vue）](https://blog.csdn.net/w544924116/article/details/120105320)  
  [基于qiankun的微前端最佳实践 -（同时加载多个微应用）](https://juejin.cn/post/6986258669172490271#heading-24)  
  [Create React App无eject配置（react-app-rewired 和 customize-cra）](https://juejin.cn/post/6844904016581754888#heading-8)  