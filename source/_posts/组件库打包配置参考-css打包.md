---
title: 组件库打包配置参考-css打包
date: 2023-09-20 15:18:00
tags: frontend
banner_img: /images/组件库打包配置参考/background.png
index_img: /images/组件库打包配置参考/background.png
categories:
  - 前端
  - 配置
---

# 组件库打包配置参考-css打包

今天简单讲讲关于组件库打包的`css`打包，这里拿[arco-design](https://arco.design/)的打包工具[arco-cli](https://github.com/arco-design/arco-cli/tree/1.x/packages/arco-scripts)的`1.0`版本来讲解。

### 开始前

`arco-cli`使用的是[gulp](https://github.com/gulpjs/gulp)来组织任务执行的，他能极大的简化构建任务，生态也是及其的庞大，基本业务中的情况都能找到对应的插件。  
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

编译`less`文件。  

- [gulp-less](https://github.com/gulp-community/gulp-less)，其实就是一个对`less`封装的`gulp`插件。  
- [gulp-clean-css](https://github.com/scniro/gulp-clean-css)，同样是[clean-css](https://github.com/clean-css/clean-css)的封装，用于清理没有使用的`css`样式。  
- [less-plugin-npm-import](https://github.com/less/less-plugin-npm-import)，`less`插件，可以在`less`文件中引入`npm`包样式文件。  
- [less-plugin-autoprefix](https://github.com/less/less-plugin-autoprefix)，`less`插件，顾名思义，自动补全各个浏览器的**前缀**。  

```js
  const cleanCSS = require('gulp-clean-css')
  const gulpLess = require("gulp-less");
  const NpmImportPlugin = require('less-plugin-npm-import')
  const LessAutoprefix = require('less-plugin-autoprefix')

  const LESS_COMPILE_OPTIONS = {
    paths: ['node_modules'],
    plugins: [npmImport, autoprefix],
    relativeUrls: true,
    javascriptEnabled: true 
  }

  function compileLess() {
    const destDirs = ['es', 'lib']

    let stream = gulp
      .src('components/**/index.less', { allowEmpty: true })
      // less 转 css 
      .pipe(gulpLess(LESS_COMPILE_OPTIONS))
      // 清除无用css
      .pipe(cleanCSS())

    // 将编译好的样式文件复制到 commonjs & usm 目录下面
    destDirs.forEach((dir) => {
      stream = stream.pipe(gulp.dest(dir));
    });

    return stream.on('error', (error) => {
      console.error(error);
    });
  }
```

#### handleStyleJSEntry  

<!-- vinyl-fs -->

看名字的意思，处理样式的`js`入口文件，即`index.js`引入样式的文件。  
```js
  // index.js 

```

### distLess & distCss

#### distLess

把所有组件的入口`less`文件自动集中到一个`less`文件中，并放到`dist`目录下。  

大概就是如下这样的结构。  
```less
@import "../../es/style/mixins/index.less";
@import "../../es/style/index.less";
@import "../../es/_class/Draggable/style/index.less";
@import "../../es/_class/picker/style/index.less";
@import "../../es/Affix/style/index.less";
@import "../../es/Alert/style/index.less";
```
简单流程就是找到`components/xx/index.less`文件（所以目录结构有规范，默认认为`index.less`为组件等的入口样式文件），**路径**修改后，字符串拼接出需要的语法，合并到一个字符串中，并写入对应的文件中。  

```js
function distLess(cb) {
  // 输出的目录
  const distPath = 'dist/css'
  // 输出文件名称
  const rawFileName = 'index.less'
  // 找到所有的样式文件目录
  const entries = glob.sync('components/**/index.less')

  if (entries.length) {
    const texts = [];

    entries.forEach((entry) => {
      // components/**/index.less -> es/**/index.less
      const esEntry = 'es' + entry.slice(entry.indexOf('/'));
      // 相对于distPath 的相对路径
      // relative 的意思是 esEntry相对于distPath的相对路径
      const relativePath = path.relative(distPath, esEntry);
      const text = `@import "${relativePath}";`;

      // 下面的代码控制的写入顺序，也就是引入顺序
      // 个人的理解应该是 es/style 开头表示为组件的样式，其余的样式写在后面，即其余样式能覆盖组件的样式
      if (esEntry.startsWith(`es/style`)) {
        texts.unshift(text);
      } else {
        texts.push(text);
      }
    });

    // 输出文件
    fs.outputFileSync(`${distPath}/${rawFileName}`, texts.join('\n'));
  }

  cb();
}

```

#### distCss

将上一步(`distLess`)生成的`less`文件转换成单个`css`文件，其目的就是能在`umd`模式下能全量引入所有组件的样式。  
比如：`import 'package-components/dist/css/index.min.css'`  

```js
  function distCss() {
    // 输出的文件目录
    const distPath = 'dist/css'
    // 指定的 less 文件
    const rawFileName = 'index.less'
    // 指定输出的 css 文件
    const cssFileName = 'index.css'

    let stream = gulp.src(`${distPath}/${rawFileName}`, { allowEmpty: true });

    // 将less文件编译成css
    // 这里的步骤和 上面 compileLess 任务中的编译其实是同一个逻辑    
    stream = stream.pipe(gulpLess(LESS_COMPILE_OPTIONS));

    return stream
      .pipe(
        // 把样式文件当中一些引入的静态资源文件 更换路径到 dist下面的路径
        replace(
          new RegExp('(\.{2}\/)+es', 'g'),
          path.relative(distPath, ASSET_FILE_OUTPUT)
        )
      )
      // 清理无用样式
      .pipe(cleanCSS())
      // 改名为 index.css
      .pipe(rename(cssFileName))
      .pipe(gulp.dest(distPath))
      .on('error', (error) => {
        console.error(error);
      });
  }
```

## 结束

关于上面的代码，可以参考下[简化的代码](https://github.com/food-billboard/food-billboard.github.io/tree/hexo/source/demo-package/组件库打包配置参考)，其实就是`cv`了`arco-scripts`的代码🌶。  

结束 🔚。

参考链接

> [【目录】组件库打包 cli 教程](https://github.com/lio-mengxiang/mx-design-cli/issues/16)  
> [react 组件库打包指南](https://github.com/lio-mengxiang/mx-design-cli/issues/13)  
> [每天一个npm包：through2](https://zhuanlan.zhihu.com/p/365329097)  
