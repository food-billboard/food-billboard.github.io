---
title: gsap动画的简单使用
date: 2022-06-23 09:43:00
banner_img: /images/gsap动画的简单使用/background.png
index_img: /images/gsap动画的简单使用/background.png
tags:
 - 前端
--- 

## 介绍 
最近突然需要写一些包含多种动画的首页，偶然找到了[gsap](https://greensock.com/)，发现是真的好用，这里对其一些`api`做下简单介绍。  

## 正文

`gsap`是一个`javascript`动画库，可以让开发者通过简单的`api`完成非常复杂的动画，包含非常多种类型的动画的实现，比如`css3`动画，`svg`动画以及`canvas`、`webgl`等。  

官网给出了大量的示例代码，可以[前往查看](https://codepen.io/collection/AQPByE)  

> 但是它的缺点就是有些功能是付费的🤷🏻‍♀️，比如`SplitText`、`DrawSvg`等功能，他们能实现非常炫酷的动画效果，有兴趣的可以自行购买使用。（反正我不买😺）  

- 以下的介绍全部都是**gsap3**的内容。  


### 使用

本次使用大概用到了以下几个`api`：`to`、`from`、`timeline`。  
用到的插件为：`ScrollTrigger`、`TextPlugin`、`MotionPathPlugin`  

#### 插件  

使用的插件都需要提前注册。  
```javascript
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { TextPlugin } from 'gsap/TextPlugin'
  import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

  gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin)
```

##### ScrollTrigger  
  `ScrollTrigger`为滚动操作的关联动画，用户可以根据滚动实现相关的动画。  
```js
  gsap.to('div', {
    x: 100,
    scrollTrigger: {
      trigger: 'div', //触发滚动动画的元素
      start: 'start bottom', // 动画开始执行的时机（开始/结束）
      // 四个字符串代表四个时机：onEnter onLeave onEnterBack onLeaveBack
      // 每个时机所有的动画类型：play pause resume reset restart complete reverse none 
      toggleAction: 'play none none reverse', // 动画对应时间触发的动作  
      scrub: true, // 是否跟随鼠标滚动执行动画，边滚动边执行动画
    }
  })
```
  [官网例子](https://codepen.io/GreenSock/pens/tags/?selected_tag=scrolltrigger)  
##### TextPlugin  
  `TextPlugin`为一些文字动画的插件，我理解的是文字动画的基础版。  
  暂时没有用到啥特殊的配置。  
  [官网例子](https://codepen.io/collection/DmQpRq)    
##### MotionPathPlugin  
  `MotionPathPlugin`为路径动画，可以通过`svg`的`path`实现相关的动画。  

```js
  gsap.to('div', {
    motionPath: {
      path: "#path", // svg路径元素
      align: "#path", // 对齐到路径
      autoRotate: true, // 自动旋转，会跟随路径自动旋转动画元素
      alignOrigin: [0.5, 0.5] // 与路径的重合程度，当前设置表示居中  
    }
  })
```

  [官网例子](https://codepen.io/GreenSock/pens/tags/?selected_tag=motionpathplugin)  

#### to  
表示元素从当前状态转换为`to`指定的一些动画状态。  
比如，将元素移动到`(100, 100)`，并且`opacity`从1到0。  
```js
  gsap.to('div', {
    x: 100,
    y: 100,
    opacity: 0,
  })
```
下面介绍其中一些常用的属性，与下面`from`方法的参数基本相同。  
```js 
  const Option = {
    duration: 1, // 动画执行的时间
    repeat: 1, // 重复次数，-1无限制
    repeatDelay: 1, // 二次执行动画的延迟时间  
    yoyo: true, // 动画是否重复往返执行，比如：从1-2，然后从2-1  
    stagger: 0.5, // 多个动画错开执行的时间间隔  
    ease: 'power1.inOut', // 动画的速度曲线，详细可以查看文件 /node_modules/gsap/types/ease.d.ts  
    // css 属性
    scale: 1 // 缩放
    rotate: 1, // 旋转
    transformOrigin: 'center', // 变换中心点
    width: 100, // 宽度 100vh 100px 100% 都可以
    height: 100, // 高度同理
    visibility: 'visible', // 显示隐藏  
    backgroundColor: 'red', // 颜色
  }
```


#### from 
与`to`相反，表示元素从`from`状态转为`元素当前状态`。  

#### timeline  
`timeline`可以理解成上述`api`的一个集合。  
有时可能需要按照时间顺序，按顺序的执行一系列的动画任务，这将是很有帮助的。  

比如一个矩形元素，首先`x`移动到`100`，接着`y`移动到`100`，即以下代码：
```js
  gsap.timeline()
  .to('div', {
    x: 100
  })
  .to('div', {
    y: 100
  })
```

[官网示例](https://codepen.io/GreenSock/pens/tags/?selected_tag=timeline)

#### 其他  

`gsap`的动画能力非常的强，但是也有限制性，以下为本人观点，不一定正确：  
  其实现动画的`css`能力与`transition`有非常大的关系，只有能响应`transition`的属性才能形成动画，比如`width`、`height`、`backgroundColor`、`scale`等。  
  但是有些属性是无法响应的，比如`display`，当设置其从`block`变为`none`时，为瞬间变化，无动画效果。  

## 结束

`gsap`的功能非常的强大，以上使用的功能只是皮肤，各位可以自己去琢磨。  
顺便看下本人使用的效果：[gh-pages](https://food-billboard.github.io/create-chart-docs/)或[私人服务器](http://47.97.27.23/api/backend/create-chart-docs/index.html)。