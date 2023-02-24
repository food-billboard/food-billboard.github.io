---
title: parallax使用
date: 2022-07-08 17:10:08
tags: 
  - CSS   
  - animation  
  - 动画  
banner_img: /images/parallax使用/background.jpg
index_img: /images/parallax使用/background.jpg
categories:
  - 前端 
  - CSS 
---

## 介绍  
最近想给自己的项目设计一个比较炫酷的首页，发现了这个工具--[parallax](http://matthew.wagerfield.com/parallax/)，故在这里做一个简单的介绍👍 。

## 正文  
`parallax`顾名思义，视差。  
百度这样解释：
> 视差就是从有一定距离的两个点上观察同一个目标所产生的方向差异。从目标看两个点之间的夹角，叫做这两个点的视差，两点之间的距离称作基线。只要知道视差角度和基线长度，就可以计算出目标和观测者之间的距离。  

`parallax`帮助你完成了相关工作，你只需要写好相关的`html`结构，再通过简单的配置即可完成非常炫酷的视差动画。  

### API  
下面是对其配置做的一个简单的介绍。  

#### relativeInput  

对场景进行全方位的控制。  
开启时，容器内的元素的视差效果表现为整个页面。  

#### hoverOnly  

是否只在鼠标在场景内触发效果。  
当关闭该功能时，只有鼠标在容器元素内时，才会有视差的动画效果。  

#### clipRelativeInput  

控制视差效果的边界。  
开启时，当效果触碰到容器的边缘时，便会停止动画。  

#### inputElement  

控制触发视差效果的范围，一般是一个元素节点。  
和`relativeInput`和`hoverOnly`配合使用。  

#### selector  

控制需要触发视差动画的元素，当默认为`null`时，容器内的所有元素均会触发。  

#### limitX & limitY 

元素在轴上运动的最大距离。  
设置`false`表示不限制。  

#### invertX & invertY  

反转元素的运动方向，设置`true`则运动方向与鼠标移动方向相反。  

#### calibrateX & calibrateY  

保存元素初始的位置，并根据该值进行运动。（🤔，没太懂，好像没啥效果）  

#### scalarX & scalarY  

设置运动距离的乘数，控制元素运动的大小。  

#### frictionX & frictionY  

设置元素运动的缓冲，低于`1`时，会减缓运动的速度，默认`1.5`  

### 方法  
上面的一些`API`同样可以通过实例进行控制，比如`limit`、`invert`、`calibrate`、`scalar`、`friction`  
还有以下常用方法  
`enable`、`disable`、`destroy`、`version`  

