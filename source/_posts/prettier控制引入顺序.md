---
title: prettier控制引入顺序
date: 2023-07-28 11:32:08
tags: 
  - prettier   
banner_img: /images/prettier控制引入顺序/background.jpg
index_img: /images/prettier控制引入顺序/background.jpg
categories:
  - 前端 
---

# prettier控制引入顺序

作为一个有"素质"的前端选手，对于代码的格式有着极强的要求，今天就讲一下关于**引入顺序**的问题的处理。  

## 开始

一般情况下，我们都会对引入的模块的顺序进行控制。  
比如在我看来，应该是这么一个顺序：  
```js
// 第三方模块
import React from 'react'
// 绝对路径模块
import Component from '@/components/Component'
// 相对路径模块
import Children from './components/Children'
```

这时候就可以使用到这个模块[@trivago/prettier-plugin-sort-imports
](https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports)  

它可以帮助自动调整引入的顺序。  

```json
{
  "importOrder": [
    "<THIRD_PARTY_MODULES>",
    "^@(.*)",
    "^[./]"
  ]
}
```

如上即简单控制了上面三个模块的顺序，当然你也可以更加细粒度的控制同一类型模块的顺序。  
比如**绝对路径**模块的`components`应该在`utils`前面、**相对路径**的`js`模块应该在`css`模块前面。  

完成上面的配置，就可以看到如下的效果。  

<img src="/images/prettier控制引入顺序/result.gif" />

## 结束

  结束🔚。  

  参考链接  
> [eslint prettier import sort 排序](https://blog.csdn.net/qiphon3650/article/details/129705342)  