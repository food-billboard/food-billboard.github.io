---
title: 使用puppeteer爬取漫画
date: 2023-09-12 11:23:00
tags: backend node puppeteer
banner_img: /images/使用puppeteer爬取漫画/background.jpg
index_img: /images/使用puppeteer爬取漫画/background.jpg
categories: 
  - 后端  
---

## 使用puppeteer爬取漫画

## 介绍
前几天看到龙珠超-次元乱战的漫画，感觉还不错，奈何一下子没有找到资源。  
但是看到了在线版本的，这里就想到直接将资源下载下来看，那不是更方便吗😊。  

## 正文  

### 工具   
本次使用的工具有 
- [axios](https://www.axios-http.cn/)  
  这个应该不用多介绍了，在这里的使用目的是进行文件的下载。  
- [puppeteer](https://pptr.dev/)  
  `puppeteer`是一个模拟浏览器的运行工具，可以自动化的做一些用户操作。  

### 流程  
这里简单讲一下具体的流程。  

1. 进入漫画的目录首页，获取漫画的章节数量及具体路由    
2. 循环进入相关章节的路由  
3. 获取当前章节的分页数量   
4. 下载指定章节中的漫画资源（也就是一张图片）  
5. 点击下一页进入当前章节的也一张图片  
6. 完成所有下载后，将图片合并为`pdf`   

### 优化  

- 上面的文件下载难免会出现失败的情况，可以适当进行重试的设置  
- 多次执行脚本不应该重复下载已下载的资源，可以在下载前对本地文件进行检索  

### 具体实现  

[点击这里查看具体代码实现](https://github.com/food-billboard/food-billboard.github.io/tree/hexo/source/images/使用puppeteer爬取漫画/project)

### 碰到的问题   

#### npm i puppeteer 失败  

下载puppeteer会自动下载`chromium`浏览器，这个浏览器有`100-200MB`，经常会出现失败的情况。  
我们可以先执行`export PUPPETEER_SKIP_DOWNLOAD='true'`来跳过下载。  
接着在项目目录下面执行`node node_modules/puppeteer/install.js`来下载。  

#### Failed to launch the browser process!  

(Chrome is downloaded but fails to launch on Node.js 14)[https://pptr.dev/troubleshooting#chrome-is-downloaded-but-fails-to-launch-on-nodejs-14]  

## 结束  
做个简单记录😊   
> 参考  
> [云函数（nodejs）中Buffer、ArrayBuffer、DataView互相转化](https://codeleading.com/article/44573498917/)  