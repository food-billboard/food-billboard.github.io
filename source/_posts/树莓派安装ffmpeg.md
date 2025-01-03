---
title: 树莓派安装ffmpeg
date: 2024-12-10 16:58:00
tags: backend node docker raspberry
banner_img: /images/树莓派安装ffmpeg/background.webp
index_img: /images/树莓派安装ffmpeg/background.webp
categories: 
  - 后端 
---

## 树莓派安装ffmpeg  

尝试使用`docker-compose`来安装`ffmpeg`，但是因为安装的是`arm64`，翻了下官网好像还没有支持，所以先选择放弃吧，到时候再说，简单记录一下安装的几个命令。  

`sudo apt-get update`   
`sudo apt-get install ffmpeg`
`ffmpeg --version`  

然后为了区分是否为树莓派的环境，简单采用文件目录地址的方式，如果存在`raspberry`的话就说明是树莓派环境。  

