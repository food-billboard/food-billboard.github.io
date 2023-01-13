---
title: umi环境变量
date: 2023-01-13 16:39:00
tags: umi 
banner_img: /images/SVG学习/background.webp
index_img: /images/SVG学习/background.webp
categories: 
  - umi
  - 前端   
---

# umi环境变量  

## 开始
umi平常都有用，关于他的环境变量，这里做一个踩坑记录。  

自定义环境变量很容易。  

### .env文件  
在根目录新增`.env`文件，将需要的环境变量设置进去即可。  
```sh
PORT=8000
CUSTOM=123
```  
### cross-env  
根据不同的命令设置不同的环境变量  
可以通过`cross-env`来进行设置。  
`cross-env PORT=8000 CUSTOM=123 umi dev`  

### 坑 
但是需要注意的一点是，如果只是像上面这样设置了是没有办法在项目中通过`process.env.xxx`来访问的。  
你需要在配置文件中进行透传覆盖才能访问。  
```typescript 
const config = {
  define: {
    'process.env.PORT': process.env.PORT,
    'process.env.CUSTOM': process.env.CUSTOM,
  }
}
```
这样才可以在项目中访问到。  

## 结束

  结束🔚。 