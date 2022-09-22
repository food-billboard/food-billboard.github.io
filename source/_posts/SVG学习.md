---
title: SVG学习
date: 2022-09-19 17:16:00
tags: css svg 
banner_img: /images/SVG学习/background.webp
index_img: /images/SVG学习/background.webp
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

#### stroke-dashoffset  

设置虚线的偏移量

<svg width="200" height="100">
  <polyline points="20 20 150 20" stroke-dasharray="50 10" stroke="red" stroke-width="5"></polyline>
  <polyline points="20 50 150 50" stroke-dasharray="50 10" stroke="blue" stroke-width="5" stroke-dashoffset="20"></polyline>
</svg>

```svg 
<svg width="200" height="100">
  <polyline points="20 20 150 20" stroke-dasharray="50 10" stroke="red" stroke-width="5"></polyline>
  <polyline points="20 50 150 50" stroke-dasharray="50 10" stroke="blue" stroke-width="5" stroke-dashoffset="20"></polyline>
</svg>
```

#### stroke-linejoin 

转折点的样式

<svg width="200" height="200">
  <polyline stroke-linejoin="miter" points="0 0 0 50 50 50" stroke="red" stroke-width="20" fill="none"></polyline>
  <polyline stroke-linejoin="round" points="50 50 50 100 100 100" stroke="blue" stroke-width="20" fill="none"></polyline>
  <polyline stroke-linejoin="bevel" points="100 100 100 150 150 150" stroke="blue" stroke-width="20" fill="none"></polyline>
</svg>

```svg 
<svg width="200" height="100">
  <polyline stroke-linejoin="miter" points="20 20 40 50 60 70" stroke="red" stroke-width="5"></polyline>
  <polyline stroke-linejoin="round" points="20 20 40 50 60 70" stroke="blue" stroke-width="5"></polyline>
  <polyline stroke-linejoin="bevel" points="20 20 40 50 60 70" stroke="blue" stroke-width="5"></polyline>
</svg>
```
#### stroke-opacity  

描边线条的透明度  

#### stroke-linecap  

描边的末端形状

<svg width="100" height="100">
  <g fill="none" stroke="black" stroke-width="6">
    <path stroke-linecap="butt" d="M5 20 l65 0" />
    <path stroke-linecap="round" d="M5 40 l65 0" />
    <path stroke-linecap="square" d="M5 60 l65 0" />
  </g>
</svg>

```svg 
<svg width="100" height="100">
  <g fill="none" stroke="black" stroke-width="6">
    <path stroke-linecap="butt" d="M5 20 l65 0" />
    <path stroke-linecap="round" d="M5 40 l65 0" />
    <path stroke-linecap="square" d="M5 60 l65 0" />
  </g>
</svg>
```

#### stroke-dasharray  

绘制虚线  

格式为`length margin, length margin, ...`  
- length 虚线长度  
- margin 虚线间距  

<svg width="100" height="100">
  <g fill="none" stroke="black" stroke-width="4">
    <path stroke-dasharray="5,5" d="M5 20 l215 0" />
    <path stroke-dasharray="10,10" d="M5 40 l215 0" />
    <path stroke-dasharray="20,10,5,5,5,10" d="M5 60 l215 0" />
  </g>
</svg>

```svg 
<svg width="100" height="100">
  <g fill="none" stroke="black" stroke-width="4">
    <path stroke-dasharray="5,5" d="M5 20 l215 0" />
    <path stroke-dasharray="10,10" d="M5 40 l215 0" />
    <path stroke-dasharray="20,10,5,5,5,10" d="M5 60 l215 0" />
  </g>
</svg>
```

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

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <line x1='0' y1='0' x2='100' y2='100' stroke-width="1" stroke="rgb(0,0,0)"/>
</svg>

```svg 
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <line x1='0' y1='0' x2='100' y2='100' stroke-width="1" stroke="rgb(0,0,0)"/>
</svg>
```

#### polyline（多线段）  

`points`为点的集合，格式为`x1 y1, x2 y2, ...`  

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <polyline points="0 0, 100 0, 0 100, 0 0" stroke-width="1" stroke="rgb(0,0,0)" fill="none" />
</svg>

```svg 
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <polyline points="0 0, 100 0, 0 100, 0 0" stroke-width="1" stroke="rgb(0,0,0)" fill="none" />
</svg>
```
#### polygon（多边形）

和`polyline`相同，使用`points`设置点  

<svg height="210" width="500">
  <polygon points="100 10, 40 198, 190 78, 10 78, 160 198" fill="lime" stroke="purple" stroke-width="5" fill-rule="nonzero" />
</svg>

```svg 
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100">
  <polygon points="100 10, 40 198, 190 78, 10 78, 160 198" fill="lime" stroke="purple" stroke-width="5" fill-rule="nonzero" />
</svg>
```

#### path（路径）

重点来了，这个应该是平常用到的最多的一个东西。  

关键的属性在`d`上，描述了元素的整体路径的形状。  
以下是相关的语法。  
> M = moveto 移动到某个位置  
L = lineto 从当前点连线到指定点  
H = horizontal lineto 从当前点水平连接指定点  
V = vertical lineto 从当前点垂直连接指定点  
C = curveto 三次贝塞尔曲线  
S = smooth curveto 三次平滑贝塞尔曲线   
Q = quadratic Bézier curve 二次贝塞尔曲线  
T = smooth quadratic Bézier curveto 平滑二次贝塞尔曲线  
A = elliptical Arc 圆弧（x轴半径，y轴半径，旋转角度，是否选择弧长较长的一段0短边|1长边，顺时针绘制1|逆时针0，终点x轴坐标，终点y轴坐标）
Z = closepath  闭合路径  

以上的字母，大小表示绝对位置，小写表示相对位置。  

`d`以`M`开头，  

<svg width="200" height="200">
  <path d="M10 10 L120 50 H140 V100" fill="none" stroke="red" stroke-width="2"></path>
</svg>

```svg 
<svg width="200" height="200">
  <path d="M10 10 L120 50 H140 V100" fill="none" stroke="red" stroke-width="2"></path>
</svg>
```
  
##### A 

从点(10, 10)开始，绘制x轴半径为50，y轴半径是20，旋转100度，以小弧度，逆时针到点（100， 100）处。  

<svg width="200" height="200">
  <path d="M10 10 A50 20 100 0 0 100 100" fill="none" stroke="red" stroke-width="2"></path>
</svg>

```
<svg width="200" height="200">
  <path d="M10 10 A50 20 180 1 0 100 100" fill="none" stroke="red" stroke-width="2"></path>
</svg>
```


#### text（文本）  

<svg height="210" width="500">
  <text x="50" y="50" fill="lime">I am Daniel</text>
</svg>

```svg 
<svg height="210" width="500">
  <text x="50" y="50" fill="lime">I am Daniel</text>
</svg>
```

### 其他  

#### defs  

将一些特殊的配置放在`defs`标签中，比如**滤镜**、**渐变**、**阴影**等。  

<svg width="100" height="100">
  <defs>
    <filter id="f1">
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
    </filter>
  </defs>
  <rect width="90" height="90" stroke="green" stroke-width="3" fill="yellow" filter="url(#f1)" />
</svg>

```svg 
  <svg width="100" height="100">
    <defs>
      <filter id="f1">
        <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
      </filter>
    </defs>
    <rect width="90" height="90" stroke="green" stroke-width="3" fill="yellow" filter="url(#f1)" />
  </svg>
```

##### filter（滤镜）  

有如下滤镜：
> feBlend - 与图像相结合的滤镜
feColorMatrix - 用于彩色滤光片转换
feComponentTransfer
feComposite
feConvolveMatrix
feDiffuseLighting
feDisplacementMap
feFlood
feGaussianBlur
feImage
feMerge
feMorphology
feOffset - 过滤阴影
feSpecularLighting
feTile
feTurbulence
feDistantLight - 用于照明过滤
fePointLight - 用于照明过滤
feSpotLight - 用于照明过滤

等等。  

##### 渐变  

- 线性渐变  

<svg width="100" height="100">
  <defs>
    <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="red" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="yellow" stop-opacity="1"></stop>
    </linearGradient>
  </defs>
  <rect width="50" height="50" fill="url(#linear)"></rect>
</svg>

```svg 
<svg width="100" height="100">
  <defs>
    <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="red" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="yellow" stop-opacity="1"></stop>
    </linearGradient>
  </defs>
  <rect width="50" height="50" fill="url(#linear)"></rect>
</svg>
```

  - x1、y1、x2、y2表示线性渐变的方向  
  - id 表示渐变的名称  
  - stop 表示内部颜色的变化步骤  
    - offset 表示线性的位置  
    - stop-color 表示颜色  
    - stop-opacity 表示透明度  

- 径向渐变

<svg width="100" height="100">
  <defs>
    <radialGradient id="radial" r="100%" cx="100%" cy="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="red" stop-opacity="1"></stop>
      <stop offset="100%" stop-color="yellow" stop-opacity="1"></stop>
    </radialGradient>
  </defs>
  <circle r="50" cx="50" cy="50" fill="url(#radial)"></rect>
</svg>

  与线性渐变类似  
  - r 表示渐变的圆形大小  
  - fx、fy 表示渐变的焦点，也可以说是一个灯光效果，或者说渐变`圆心`在图形上的位置。    
  - fr 表示焦点的大小  
  - cx、cy 表示渐变结束的圆心位置  


## 结束  

以上就是本人相关的笔记。  
下面给到一些链接：  
[编辑器](https://c.runoob.com/more/svgeditor/)  
[API参考](https://www.runoob.com/svg/svg-reference.html)  

## 附增  

这里保存一些平常看到的有意思的`svg`效果👍。    