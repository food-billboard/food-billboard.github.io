---
title: 我的项目
date: 2022-07-06 09:38:29
layout: project 
banner_img: /images/首页/background.jpg
index_img: /images/首页/background.jpg
---

<div class="markdown-body">

## 介绍  

下面给出了本人目前所做的所有的项目，欢迎体验👏🏻 。  

<a id="screen"></a>  

### 可视化数据大屏  

可视化数据大屏为实用的大屏设计器，当中包含了大屏需要用到的大部分功能，并且项目一直在持续迭代中。  

[<---代码传送门--->](https://github.com/food-billboard/create-chart)  
[<---官网传送门--->](http://47.97.27.23/api/backend/screen/index.html)  
[<---操作文档传送门--->](http://47.97.27.23/api/backend/create-chart-docs/index.html)  

### 工具箱

工具箱（tool-box）是一个使用相关类库完成的各类实用工具的网站。  
其中包括  
- 图片主题色获取    
- 视频转gif  
- 文件MD5获取  
等等  
[<---代码传送门--->](https://github.com/food-billboard/tool-box)  
[<---官网传送门--->](http://47.97.27.23/api/backend/tool-box/index.html)  

### 管理后台  

管理后台是对相关项目的数据的一个综合的管理。   
其中包括  
- [聊天Demo](#chat-demo)  
- [数据可视化大屏](#screen)  
- [电影推荐h5](#movie)  

[<---代码传送门--->](https://github.com/food-billboard/mini-app-management)  
[<---官网传送门--->](http://47.97.27.23/api/backend/index.html)  

<a id="node-server"></a> 

#### 后台服务  

后台服务供应了其他项目中需要用到数据的服务接口。  
项目使用`Node + Koa + MongoDB`。  
其中存在简单的**增删改查**，以及**文件上传**，**登录注册**等。  

[<---代码传送门--->](https://github.com/food-billboard/node-server)  

#### 文件分片上传类库  

文件分片上传的自实现，功能相对简单，实现了在各个存在`es6`相关模块`API`的兼容。（比如小程序）    

[<---代码传送门--->](https://github.com/food-billboard/chunk-file-load)  
[<---官网传送门--->](https://food-billboard.github.io/chunk-file-load)  

#### React分片上传组件  

基于上面的类库实现的`React`组件。  

[<---代码传送门--->](https://github.com/food-billboard/chunk-file-load-component)  
[<---官网传送门--->](https://food-billboard.github.io/chunk-file-load-component/#/)  

#### React状态控制类库  

控制`React`组件的工具，可以对组件的状态进行**前进**、**后退**等操作。  
支持`class`和`hook`组件。  
并且对`class`组件的状态可以选择**全量控制**或**部分控制**。  

[<---代码传送门--->](https://github.com/food-billboard/react-undo-component)  
[<---官网传送门--->](https://food-billboard.github.io/react-undo-component/#/)  

<a id="chat-demo"></a>    

#### 简易聊天室

基于[socket.io](https://github.com/socketio/socket.io)实现的简单聊天室，后台使用的是上面的后台服务。  
功能包含**群聊**和**单聊**。  
可以添加、删除好友。  

[<---代码传送门--->](https://github.com/food-billboard/chat-demo)  
[<---官网传送门--->](http://47.97.27.23/api/backend/communicate/index.html)  

#### three.js学习  

此项目是本人在学习[three.js](https://github.com/mrdoob/three.js)过程中，写得一些简单的`Demo`。  

[<---代码传送门--->](https://github.com/food-billboard/threejs-study-demo)  
[<---官网传送门--->](http://47.97.27.23/api/backend/threejs-study/index.html)  

</div>