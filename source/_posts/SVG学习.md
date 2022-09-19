---
title: SVG学习
date: 2022-09-19 17:16:00
tags: css svg 
banner_img: /images/SVG学习/background.jpeg
index_img: /images/SVG学习/background.jpeg
categories: 
  - svg
  - css
  - 前端   
---

# SVG学习  

## 介绍

> SVG 指可伸缩矢量图形 (Scalable Vector Graphics)
SVG 用来定义用于网络的基于矢量的图形
SVG 使用 XML 格式定义图形
SVG 图像在放大或改变尺寸的情况下其图形质量不会有所损失
SVG 是万维网联盟的标准
SVG 与诸如 DOM 和 XSL 之类的 W3C 标准是一个整体

学习`svg`的目的，是为了能在前端页面实现更多有意思的效果。  
以下就是本人的学习笔记。  

## 正文  

### svg

`svg`标签的属性  
- width & height  
- version 版本  
- xmlns 命名空间  
- viewbox 可视区域  
此属性表示裁剪一个矩形区域作为最终的可视区域（left top width height）  
比如`20 20 100 100`表示能看到左上角(20, 20)为起点的宽高均为100的矩形区域。   

### 一些常用的属性  

基本上这些属性都和`css`通用。  

#### width & height & x & y  

元素的宽高位置。  

#### fill 

颜色填充  

<svg width="100" height="100">
  <rect fill="red" width="50" height="50"></rect>
</svg>

```svg 
<svg width="100" height="100">
  <rect fill="red" width="50" height="50"></rect>
</svg>
```

#### stroke 

描边  

<svg width="100" height="100">
  <rect x="10" y="10" fill="none" stroke="#f00" width="50" height="50"></rect>
</svg>

```svg 
<svg width="100" height="100">
  <rect x="10" y="10" fill="none" stroke="#f00" width="50" height="50"></rect>
</svg>
```

#### stroke-width 

描边的线条尺寸  

<svg width="100" height="100">
  <rect x="10" y="10" fill="none" stroke="#f00" stroke-width="10" width="50" height="50"></rect>
</svg>

```svg 
<svg width="100" height="100">
  <rect x="10" y="10" fill="none" stroke="#f00" stroke-width="10" width="50" height="50"></rect>
</svg>
```

#### stroke-opacity  

描边线条的透明度  

#### rx & ry

**矩形**的圆角   
**椭圆**的水平和垂直尺寸  

#### cx & cy  

**圆形**的圆心  

#### r  

**圆形**的半径   

### shapes 形状和文字  

#### rect（矩形）  

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <rect width="50" height="50" fill="red" stroke-width="1" stroke="rgb(0,0,0)"/>
</svg>

```svg 
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100" >
  <rect width="50" height="50" fill="red" stroke-width="1" stroke="rgb(0,0,0)"/>
</svg>
```

#### circle（圆形）  

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <circle cx="30" cy="30" r="10" fill="red" stroke-width="1" stroke="rgb(0,0,0)"/>
</svg>

```svg 
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <circle cx="30" cy="30" r="10" fill="red" stroke-width="1" stroke="rgb(0,0,0)"/>
</svg>
```

#### ellipse（椭圆）  

类似于**圆形**，只是把`r`变成了`rx`和`ry`。  

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <ellipse cx="30" cy="30" rx="10" ry="5" fill="red" stroke-width="1" stroke="rgb(0,0,0)"/>
</svg>

```svg 
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <ellipse cx="30" cy="30" rx="10" ry="5" fill="red" stroke-width="1" stroke="rgb(0,0,0)"/>
</svg>
```

#### line（直线）

#### polygon（多边形）

#### polyline（多线段）  

#### path（路径）

#### text（文本）  

### 其他  

#### 滤镜 

#### stroke 

#### 模糊 

#### 阴影  

#### 渐变  


## 结束  