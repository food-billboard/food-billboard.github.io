---
title: todo-list-问题汇总
date: 2023-04-19 09:15:17
tags: frontend 
banner_img: /images/todo-list-问题汇总/background.jpg
index_img: /images/todo-list-问题汇总/background.jpg
categories: 
  - 前端  
---

## todo-list-问题汇总  

## 介绍  

前段时间刚刚完成了手绘风格的ToDoList的Demo，当中遇到了不少的问题，简单在这里做一下记录。  

## 开始  

### 几个关键的包：
  - [roughjs](https://github.com/rough-stuff/rough)    
    用于绘制手绘风格的图形，此项目为下面`wired-elements`的基础，并且也是万`star`⭐️项目[excalidraw](https://github.com/excalidraw/excalidraw)的基础。  
    只要简单的几行代码就能实现相关图形的绘制。  
    ```js
    // canvas 
    const rc = rough.canvas(document.getElementById('canvas'));
    rc.rectangle(10, 10, 200, 200);

    // svg
    const rc = rough.svg(svg);
    let node = rc.rectangle(10, 10, 200, 200); 
    svg.appendChild(node);
    ```
  - [wired-elements](https://github.com/rough-stuff/wired-elements)  
    基于`roughjs`实现的`web-component`组件库。  
    不同于`react`组件库或者`vue`组件库，`web-component`是不受框架影响的，能够接入任何框架或者说直接原生使用（当然他也实现了相关热门框架的组件库封装）。    
    因为他本是就是被浏览器所兼容的`api`。  
    有关`web-component`的内容，可以参看[ruanyifeng的blog](https://www.ruanyifeng.com/blog/2019/08/web_components.html)  
    此项目则是使用了[lit](https://github.com/lit/lit)(一个用于快速构建`web-component`组件库的框架)  

### 相关问题  
  因为上面的两个包都已经很久没有进行维护，虽然是一个团队的项目，但是版本相关的控制没有做的很好。  
#### 问题一  
  正常下载上面两个包时，在使用相关组件会触发保存。  
  比如使用里面的下拉组件(WiredCombo)  
  ```js
  import { WiredCombo } from 'wired-elements-react/lib/WiredCombo'
  import { WiredItem } from 'wired-elements-react/lib/wiredItem'

  const RoughTest = () => {
    return (
      <WiredCombo>
        <WiredItem>全部</WiredItem>
        <WiredItem>小于</WiredItem>
        <WiredItem>大于</WiredItem>
        <WiredItem>等于</WiredItem>
      </WiredCombo>
    )
  }
  ```
  <img src="/images/todo-list-问题汇总/combo.jpg" />
  显示没有问题，但是当点击显示下拉时就会报错。 
  <img src="/images/todo-list-问题汇总/combo-error.png" />  

#### 解决办法
  查看仓库`issue`发现了[解决办法](https://github.com/rough-stuff/wired-elements/issues/179#issuecomment-986052290)。  
  因为没有做版本兼容，`hf.fillPolygon`这个`api`发生了变化，导致报错。  
  解决办法就是下载指定版本的`roughjs`（比如上面提到的版本**4.4**）  
  
  但是直接使用命令控制版本下载还不够`yarn add roughjs@4.4`  
  虽然确实将版本下载成了`4.4`  
  但是查看`node_modules`的`wired-elements`包中，仍然引用的是`4.5.2`（测试用的是`node=16.14.2`，`yarn=1.22.10`）  
  <img src="/images/todo-list-问题汇总/rough-version-error.png" />
  
  需要在项目`package.json`中添加属性  
  ```json
    {
      "resolutions": {
        "roughjs": "4.4"
      }
    }
  ```
  顾名思义可以通过外部控制下载相应包的指定版本，防止冲突。  

#### 问题二
  在项目即将完工之时，本地运行无问题，但是当把项目放到[码上掘金](https://code.juejin.cn/)上时，却发生了错误。  
  <img src="/images/todo-list-问题汇总/import-error.png" />  

  看报错应该是`lit`中重复定义了同一个节点名称导致了报错。  
  接着查看组件库源代码发现了问题。 
  <img src="/images/todo-list-问题汇总/github-import.png" />   
  `WiredCombo`组件依赖了`WiredCard`和`WiredItem`，目前来看问题就是引入了两次造成了**多次初始化**。  
  但是本地`umi`项目并未发现异样。  

##### 解决办法  

  暂时还未找到有效的解决办法处理该问题，最后只得采用最朴素的办法--打包上传(`へ´*)ノ。  

  如果各位有了解这方面的**欢迎指正**。    

## 结束  

  结束🔚。  

  顺便看看[效果](https://code.juejin.cn/pen/7222841199583821885)吧。  
  
