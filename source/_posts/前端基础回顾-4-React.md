---
title: 前端基础回顾-4-React
date: 2023-02-17 14:22:00
tags: basic   
banner_img: /images/前端基础回顾/background.jpeg
index_img: /images/前端基础回顾/background.jpeg
categories: 
  - 面试
---

这是前端基础回顾的第四篇，记录一下React的相关问题。  

## 开始

### 事件机制  
  `react`内部定义了一套事件机制，帮助  
    - 抹平各个浏览器的差异  
    - 方便管理  
  `react16`存在事件池的概念，帮助缓存事件对象，减少性能消耗。  
  通过内部的**事务**实现各种扩展。  
  统一将事件绑定在`document`上，先捕获后冒泡。  
  因为存在事件池的概念，如果回调中存在异步，则可能无法获取到`event`对象。  

### class生命周期  
  - ~~componentWillMount~~  
  - render  
  - componentDidMount  
  - 更新state或props   
  - ~~componentWillReceiveProps~~(更新props)      
  - getDerivedStateFromProps  
  - shouldComponentUpdate  
  - ~~componentWillUpdate~~  
  - getSnapshotBeforeUpdate(替代上面的WillUpdate)    
  - render  
  - componentDidUpdate  
  - componentWillUnmout  

### diff  
[以前自己写的diff](https://food-billboard.github.io/2022/11/21/dom-diff%E5%AD%A6%E4%B9%A0/)    

### 性能优化  
  - memo/pureComponent  
  - useMemo  
  - lazy、suspense  
  - 尽量通过css控制逻辑  
  - key   

## 结束  

  结束🔚。  

  > 参考资料
  [做了一份前端面试复习计划，保熟～](https://juejin.cn/post/7061588533214969892#heading-27)    
  [Build your own React](https://pomb.us/build-your-own-react/)  
  [这可能是最通俗的 React Fiber(时间分片) 打开方式](https://juejin.cn/post/6844903975112671239)  
  
