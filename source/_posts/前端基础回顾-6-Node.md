---
title: 前端基础回顾-6-Node
date: 2023-05-17 09:54:00
tags: basic   
banner_img: /images/前端基础回顾/background.jpeg
index_img: /images/前端基础回顾/background.jpeg
categories: 
  - 面试
---

这是前端基础回顾的第六篇，记录一下`Node`的相关问题。  


## 开始

### __dirname 和 process.cwd() 区别  
  假设当前在`/Users/daniel/development/project/output.js`文件中输出上述两个值  
  接着定位到`/Users/daniel/development`下执行`output.js`  
  输出如下结果  
  - __dirname 
  `/Users/daniel/development/project`  
  文件所在的位置  
  - process.cwd()  
  `/Users/daniel/development`  
  文件执行的所在位置    

### process.env.npm_config_user_agent  
  获取用户当前使用的包管理工具信息  
  类似`npm/6.14.15 node/v12.16.1 darwin x64`结构  

### npm create 
  `npm create xxx` -> `npm exec create-xxx`  
  `npm create @xxx/yyy` -> `npm exec @xxx/create-yyy`  
  如果本地没有安装该依赖包则先**安装**  
  接着会按照包内`package.json`的`bin`属性找到对应的**执行文件**（以`#!/usr/bin/env node`开头）  

  > 上面的执行和`yarn create`和`npx create`没有区别，但是`npx create`不需要安装对应包。     

### npm version patch  
  更新版本  

### postversion  
  更新版本后触发  

### npm root -g  
  `npm`全局的下载路径  

## 结束  

  结束🔚。  

  > 参考资料
  [node中__dirname、__filename、process.cwd()、process.chdir()表示的路径](https://juejin.cn/post/6844903913435430919)    