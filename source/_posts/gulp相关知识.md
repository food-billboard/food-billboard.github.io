---
title: gulp相关知识  
date: 2023-09-09 10 42 00
tags: frontend 
banner_img: /images/gulp相关知识/background.png
index_img: /images/gulp相关知识/background.png
categories:  
  - 前端  
  - 配置
---

# gulp相关知识 

> [gulp](https //gulpjs.com/)是一个基于流的自动化构建工具，不包括模块化的功能，通过配置一系列的task，例如文件压缩合并、雪碧图、启动server、版本控制等，然后定义执行顺序来让gulp执行task，从而构建前端项目的流程。  

## 开始  

这里简单记录一下`gulp`的一些简单的概念。  

### 核心`API`。  
- `task`  创建一个任务
- `series` 顺序执行多个任务
- `prallel` 并行执行多个任务
- `src` 读取数据源转换成stream
- `pipe` 管道-可以在中间对数据流进行处理
- `dest` 输出数据流到目标路径
- `on` 事件监听
- `watch` 数据源监听  

### 使用  
- 安装 `npm i gulp -D`  

- 创建`gulpfile.js`  
```javascript 
const gulp = require('gulp')  

gulp.task('copy', () => {
  gulp.src('./demo.txt')
  .pipe(gulp.dest('dist/asset'))
})

gulp.task('copy2', () => {
  gulp.src('./demo.txt')
  .pipe(gulp.dest('dist2/asset'))
})

// 其实这里还有其他的写法  
// 下面这个写法可以在命令行直接运行 "gulp" 命令，并行执行 copy 和 copy2  
/*
  const task = gulp.prallel('copy', 'copy2')
  export.default = task 
*/

```

- 执行命令  
`gulp copy`  

> `gulp`会把`demo.txt`文件拷贝到`dist/asset`下面  

### 插件  

- gulp-concat 文件合并  
- gulp-uglify js文件压缩  
- gulp-rename 文件重命名  
- gulp-less less文件编译  
- gulp-clean-css css压缩  
- gulp-livereload 实时自动编译刷新   
- gulp-plumber 防止中间任务出错而导致退出的  
- gulp-if 根据条件来判断是否执行指定任务    
- gulp-replace 文件内容替换   


## 结束  

  结束🔚。    

参考链接  
> [对比webpack，你更应该先掌握gulp【10分钟教你彻底掌握gulp】](https //juejin.cn/post/69170699799132897365)  
> [Gulp快速入门教程】](https://juejin.cn/post/6996664034846048287?searchId=20230908174117BC6956866C6F95E96FAB)  
> [gulp.js官网](https://gulpjs.com/)
