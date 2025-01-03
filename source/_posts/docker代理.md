---
title: docker代理
date: 2024-12-10 16:58:00
tags: backend node docker 
banner_img: /images/docker代理/background.webp
index_img: /images/docker代理/background.webp
categories:
  - 后端
---

## docker 代理

因为安装了`docker-desktop`之后拉镜像很慢或者一直失败，所以加了几个代理，效果还行，简单记录一下配置。

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://docker.registry.cyou",
    "https://docker-cf.registry.cyou",
    "https://dockercf.jsdelivr.fyi",
    "https://docker.jsdelivr.fyi",
    "https://dockertest.jsdelivr.fyi",
    "https://mirror.aliyuncs.com",
    "https://dockerproxy.com",
    "https://mirror.baidubce.com",
    "https://docker.m.daocloud.io",
    "https://docker.nju.edu.cn",
    "https://docker.mirrors.sjtug.sjtu.edu.cn",
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.iscas.ac.cn",
    "https://6kx4zyno.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com",
    "https://registry.docker-cn.com",
    "https://docker.hpcloud.cloud",
    "https://docker.unsee.tech",
    "https://docker.1panel.live",
    "http://mirrors.ustc.edu.cn",
    "https://docker.chenby.cn",
    "http://mirror.azure.cn",
    "https://dockerpull.org",
    "https://dockerhub.icu",
    "https://hub.rat.dev"
  ]
}
```
