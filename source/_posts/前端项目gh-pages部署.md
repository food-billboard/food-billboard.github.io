---
title: 前端项目gh-pages部署
date: 2023-01-14 15:47:00
tags: deploy   
banner_img: /images/前端项目gh-pages部署/background.jpg
index_img: /images/前端项目gh-pages部署/background.jpg
categories: 
  - 前端  
  - 部署
---

## 前端项目gh-pages部署  

## 开始

最近的自己项目需要部署到`github-pages`，需要用到[gh-pages](https://github.com/tschaub/gh-pages)这个包。  

### 命令行  
- 安装依赖  
`yarn add gh-pages -D`  
- package添加命令  
`deploy: gh-pages -d dist`  
- 配置
因为项目使用的是`github actions`，故在`yml`配置文件中添加。  
```yml
- name: Deploy 🚀
  run: |
    yarn deploy
```
- 提交  
但是发现报错了。  
<img src="/images/前端项目gh-pages部署/auth-error.jpg" />  

看是报了`auth`错误。  

### github action

后面发现可以直接使用`github action`完成。  
- 获取`access token`  
个人`github`的`settings/Developer settings/Personal access tokens/Tokens(classic)`  
Grenerate new token  
<img src="/images/前端项目gh-pages部署/access-token.jpg" />  
<img src="/images/前端项目gh-pages部署/access-token-detail.jpg" />  

生成新`token`，并复制。  
- 设置项目环境变量  
在项目中`Settings/Secrets and variables/Actions`  
创建新的环境变量，例子中环境变量的名字为`DEPLOY_TOKEN`  
<img src="/images/前端项目gh-pages部署/secrets.jpg" />  
- 项目工作流设置  
```yml
- name: Deploy 🚀
  run: |
    git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/your-github-username/your-registry-name.git
    npx gh-pages -d dist -u "github-actions-bot <support+actions@github.com>"
  env:
    GITHUB_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

上面的`secrets.DEPLOY_TOKEN`即为刚刚设置的**环境变量**。  
`your-github-username`是你的github用户名。  
`your-registry-name`是你的仓库名。  
- 提交部署  
以上即可完成项目的`gh-pages`部署。  

## 结束  

关于部署完整的例子，可以参考我项目的[配置文件](https://github.com/food-billboard/create-chart/blob/main/.github/workflows/static-deploy.yml)。  

> 参考链接  
[如何部署create-react-app项目到Github pages步骤](https://juejin.cn/post/6844903977897705485)  
[GitHub Actions 实现提交代码自动打包部署到 gh-pages](https://juejin.cn/post/7054872300922863624)    
[How to use with GitHub Actions?](https://github.com/tschaub/gh-pages/issues/345)  


