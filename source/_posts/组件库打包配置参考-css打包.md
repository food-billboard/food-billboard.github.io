---
title: 组件库打包配置参考-css打包
date: 2023-09-19 17:18:00
tags: frontend
banner_img: /images/组件库打包配置参考/background.png
index_img: /images/组件库打包配置参考/background.png
categories:
  - 前端
  - 配置
---

# 组件库打包配置参考-css 打包

今天简单讲讲关于组件库打包的`css`打包，这里拿[arco-design](https://arco.design/)的打包工具[arco-cli]()的`1.0`版本来讲解。

### 开始前

`arco-cli`使用的是[gulp]()来组织任务执行的，他能极大的简化构建任务，生态也是及其的庞大，基本业务中的情况都能找到对应的插件。  
简单的一些知识可以看看[这里](https://food-billboard.github.io/2023/09/09/gulp相关知识/)。

> 在这里贴几个下面会用到的常量  
```js 
  // 静态资源的后缀
  const FILE_ASSET_EXT = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "svg",
    "ttf",
    "eot",
    "woff",
    "woff2",
  ];

  // 所有需要处理的资源后缀
  const FILE_WATCHED_EXT = FILE_ASSET_EXT.concat(["less", "css"]);

  // 静态资源的路径
  const ASSET_FILE_ENTRY = `components/**/*.${FILE_ASSET_EXT.join(",")}`

  // 静态资源的输出领
  const ASSET_FILE_OUTPUT = 'dist/asset'
```

## 开始

根据源代码，可以看到任务具体分为三个步骤。每个步骤有两个并行的子任务，下面按照任务的顺序一一做介绍。

```js
function build() {
  return new Promise((resolve) => {
    gulp.series(
      gulp.parallel(copyAsset, copyFileWatched),
      gulp.parallel(compileLess, handleStyleJSEntry),
      gulp.parallel(distLess, distCss),
      gulp.parallel(() => resolve())
    )();
  });
}
```

> 因为该`arco-scripts`是一个通用的打包`cli`，所以本文是基于`react`组件库打包进行解析。  
> 下面展示的代码可能是笔者更改过的，请勿代入源码思路。

### copyAsset & copyFileWatched

#### copyAsset

复制静态文件  
此方法比较简单，这里就直接贴代码，看下注释也就能明白。

```js
function copyAsset() {
  return gulp
    // 从目录 components/ 下面找到指定静态资源
    .src(ASSET_FILE_ENTRY, { allowEmpty: true })
    // 直接复制文件输出到 dist/asset目录下
    .pipe(gulp.dest(ASSET_FILE_OUTPUT));
}
```

#### copyFileWatched
和`copyAsset`类似的方法。  

复制静态资源和**样式文件**到`es`和`lib`目录下。  

代码也很简单，直接贴了  

```js 
function copyFileWatched() {
  const patternArray = [`components/**/*.{${FILE_WATCHED_EXT.join(",")}}`];

  const destDirs = ["es", "lib"];

  return Promise.all(
    destDirs.map(dir => {
      return new Promise((resolve, reject) => {
        gulp.src(patternArray, {
          allowEmpty: true,
          // base: cssConfig.watchBase[pattern],
        })
        .pipe(gulp.dest(dir))
        .on('end', resolve)
        .on('error', reject)
      })
    })
  )
}
```

### compileLess & handleStyleJSEntry

#### compileLess

#### handleStyleJSEntry

### distLess & distCss

#### distLess

#### distCss

## 结束

结束 🔚。

参考链接

> [【目录】组件库打包 cli 教程](https://github.com/lio-mengxiang/mx-design-cli/issues/16)  
> [react 组件库打包指南](https://github.com/lio-mengxiang/mx-design-cli/issues/13)
