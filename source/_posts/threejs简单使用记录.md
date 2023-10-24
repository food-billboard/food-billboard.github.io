---
title: threejs简单使用记录
date: 2023-10-20 16:36:00
tags: frontend
banner_img: /images/threejs简单使用记录/background.jpg
index_img: /images/threejs简单使用记录/background.jpg
categories: 
  - 前端   
  - CSS
---

# threejs简单使用记录  

## 渲染初始化
```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const size = {
  width: window.innerWidth,
  height: window.innerHeight 
}

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 120
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera);

// 镜头控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 页面缩放事件监听
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  // 更新渲染
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 更新相机
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
});

// 页面重绘动画
const tick = () => {
  controls && controls.update();
  // 更新渲染器
  renderer.render(scene, camera);
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick);
}
tick();

```

## 粒子  

### Sprite 

```js
  let material = new THREE.SpriteMaterial({
    color: Math.random() * 0xffffff
  });
  let sprite = new THREE.Sprite(material);
  sprite.position.set(x * 4, y * 4, 0)
```