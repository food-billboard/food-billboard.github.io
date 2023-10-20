---
title: charles文件映射
date: 2023-05-26 20:32:08
tags: 
 - frontend
banner_img: /images/charles文件映射/background.jpg
index_img: /images/charles文件映射/background.jpg
categories:
  - 前端 
---

## 介绍  

  最近工作上碰到一个业务，需要调试以前的老代码，是有单页面单文件形式的`vue`项目，并不是像`webpack`类似，起本地服务的项目。  
  之前的方法是通过启动本地主工程的代码，调试该业务的代码，但是相对来说比较繁琐。  
  并且主工程运行速度也并不快。  

  此时想到了使用[charles](https://www.charlesproxy.com/)，使用`charles`工具将**远程文件**映射到**本地**。    

## 开始

### 配置
  - 首先是下载`charles`，官网地址在[这里](https://www.charlesproxy.com/)，选择自己电脑系统的包。  

  - 安装完成后，就会看到相关页面的网络请求信息。  
  <img src="/images/charles文件映射/charles.jpg" />

  - 找到对应需要调试的**地址**，找到需要映射的文件，右击找到`Map Local`选项(没有找到对应文件也没事，随便找一个填写上对应网络地址和映射路径即可)。  
   <img src="/images/charles文件映射/map-local.jpg" />

  - 填写对应的信息  
  <img src="/images/charles文件映射/link.jpg" />

  之后刷新页面，就会发现，该文件已经映射到了本地。  

### 破解版
  因为本身`charles`是付费的，只有30天的免费试用，并且连续使用不能超过30分钟。  
  可以根据此[步骤](https://www.cnblogs.com/tiechui2015/p/17125847.html)将其进行破解。  

## 结束

  结束🔚。  

  参考链接  
> [charles将远程文件映射到本地文件](https://juejin.cn/post/7114960937840279565)  
[Charles永久免费破解方法](https://www.cnblogs.com/tiechui2015/p/17125847.html)   