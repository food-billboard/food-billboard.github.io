---
title: tango使用
date: 2024-12-12 11:11:00
tags: frontend low-code 
banner_img: /images/tango使用/background.png
index_img: /images/tango使用/background.png
categories:
  - 前端 低代码
---

## tango使用

这里尝试使用网易云音乐的低代码工具`tango`来搭建一个自己的低代码平台。  

### 准备工作 
1. 首先是搭建一个环境  
  下载一下代码 `git clone https://github.com/NetEase/tango.git`   
2. 设置`hosts`  
  `127.0.0.1 local.netease.com`  
3. 安装启动  

#### 沙箱环境搭建  
1. 下载代码  
  `git clone git@github.com:NetEase/codesandbox-client.git`  
3. 安装启动  
  `yarn`  
  `yarn build:deps`  
  `yarn build:sandpack`      


### 一些问题

#### https问题
  暂时先去掉`playground`里`umirc`里的`https`配置  


### 相关链接 

[issue-185](https://github.com/NetEase/tango/issues/185)
