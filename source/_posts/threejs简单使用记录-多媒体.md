---
title: threejs简单使用记录-多媒体
date: 2023-10-26 16:29:00
tags: frontend
banner_img: /images/threejs简单使用记录/background.jpg
index_img: /images/threejs简单使用记录/background.jpg
categories: 
  - 前端   
  - CSS
---

# threejs简单使用记录-多媒体  

## 立方体全景贴图顺序  
`[pos-x, neg-x, pos-y, neg-y, pos-z, neg-z]`  

## 音频
```js
    const audioListener = new Three.AudioListener()
    // 关联listener
    const posSound = new Three.PositionalAudio(audioListener)
    audioLoader.load(audioUrl, buffer => {
      posSound.setBuffer(buffer)
      // 指定声音从距离声源多远的位置开始衰减其音量
      posSound.setRefDistance(30)
      posSound.play()
      // 指定声源音量随着距离衰减的速度
      posSound.setRolloffFactor(10)
      posSound.setLoop(true)
      resolve()
    })
```

## 加载压缩模型  
```js
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

  const dracoLoader = new DRACOLoader();
  // 脚本文件路径
  // demo-project/threejs简单使用记录/demo相关/src/assets/draco里有  
  dracoLoader.setDecoderPath('/static/draco/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  const gltfLoader = new GLTFLoader()
  gltfLoader.setDRACOLoader(dracoLoader);
```

## 结束

  结束🔚。  

  参考资料  
> [Three.js 进阶之旅](https://juejin.cn/column/7140122697622618119)  