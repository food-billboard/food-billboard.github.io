---
title: 服务端puppeteer的使用
date: 2022-04-21 16:41:00
tags: backend node puppeteer
banner_img: /images/服务端puppeteer的使用/background.png
index_img: /images/服务端puppeteer的使用/background.png
categories: 
  - 服务器
  - 前端  
  - 后端  
---

## 服务端puppeteer的使用

## 介绍
最近突然使用到了[puppeteer](https://github.com/puppeteer/puppeteer)，原本在本地都是好好的，但是当部署到服务器上之后就不行了。  

## 正文  
虽然具体原因不确定，但是根据百度的做法最后不再报错。  

### 安装chrome  
1. 创建文件
`touch /etc/yum.repos.d/google.repo`  
2. 配置内容  

`vi /etc/yum.repos.d/google.repo`

```shell
  [google]
  name=Google-x86_64
  baseurl=http://dl.google.com/linux/rpm/stable/x86_64
  enabled=1
  gpgcheck=0
  gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub
```
3. `yum update`  
4. `yum install google-chrome-stable`  

#### 插个题外话  
在弄这个东西的时候突然碰到了阿里云服务器的`centos 8`服务器源发生变化，`yum`无法下载新东西了  
所以这里也随便记录一下，[来源](https://blog.51cto.com/gagarin/5011005)

### 修改`puppeteer`调用方式  
`puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'], headless: true })`

## 结束  
做个简单记录😊   
[参考](https://blog.csdn.net/Zeng__Yi/article/details/105661354)