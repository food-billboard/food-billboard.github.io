---
title: Github Actions 部署node项目 
date: 2021-10-25 10:39:00
banner_img: /images/deploy/background.jpeg
index_img: /images/deploy/background.jpeg
tags:
 - node
 - github actions
categories:
  - 部署  
  - node 
  - 后端 
  - ssh
  - pm2 
--- 

## 开头  
作为一个前端，其实平常和服务器打交道的时间并不多，但作为一个程序猿，又怎么能不想搞一搞呢。  
讲一个最简单的例子🌰：  
你发现了你页面的一个bug，改好之后需要部署到服务器了，恰巧没有后台人员在，需要自己部署。你输入账号密码登录了服务器，进入到对应的目录，替换了对应的文件，完成了本次的修改。过了一会儿，你发现好像还有问题，然后你又重新来了一遍。。。  
这样重复做功绝对不是我们想要的，所以此时就需要`github actions`登场了。它帮助我们完成了中间这些复杂又重复的工作，让我们能有更多的时间摸🐟。😁

## 介绍  
关于`github actions`的介绍，这里不多说，大家可以参看[阮一峰老师的文章](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)  

## 正文  

### 流程  
首先是具体的流程  
- 本地完成代码修改，提交代码到`github`  
- `github`检测到代码提交，自动执行项目目录下的`.github/workflows`的yml文件。
- 虚拟机内:  
1. 切换对应的分支，比如`master`  
2. 生成`ssh`秘钥文件  
3. 设置对应的`node`版本  
4. 安装`yarn`、`pm2`  
5. `pm2`部署代码至服务器  
6. `ssh`登录服务器，`pm2`更新并启动`node`服务，更新`docker`服务  

### 具体流程  
以下文件路径基本源自`mac`  
1. 在本机的`.ssh`文件夹下生成秘钥、公钥，如果有的话请忽略  
- 使用命令生成`ssh-keygen -t rsa -C 你的github邮箱@.com`  
- 将公钥文件`id_rsa.pub`内容添加到`github`配置中(github网站上的 -> `settings` -> `SSH and GPG keys`)  

2. 在对应的服务器中的`.ssh`文件夹下生成私钥、公钥，有的话请忽略  
- 使用命令`ssh-keygen -o`  

3. 添加本机的公钥至服务器  
- 服务器`.ssh`文件夹下有一个`authorized_keys`文件，如果没有的话请创建`touch authorized_keys`  
- 添加本机的公钥内容至`authorized_keys`中  

4. 添加服务器公钥至`github`  
- 将服务器公钥内容添加到`github` (github网站 -> `settings` -> `SSH and GPG keys`) 或者 (github项目中 -> `settings` -> `deploy keys`)

5. 添加流程中所需要的一些环境变量  
其中有些变量并不是必须得，可自行选择添加  
所有的自定义的环境变量都放在项目的`secrets`中(github项目中 -> `settings` -> `secrets`)  
`name`字段自定义  
- 将本机私钥文件`id_rsa`内容添加至环境变量，`name`设置为`LOCAL_SSH_PRIVATE_KEY`，`value`为`id_rsa`内容  
- 添加服务器的`host`，`name`设置为`SSH_IP`  
- 添加服务器`ssh`用户名，`name`设置为`SSH_USERNAME`
- 添加服务器`ssh`密码，`name`设置为`SSH_PASSWORD`  
- 添加服务器项目文件目录地址，`name`设置为`REMOTE_PATH`  

6. 添加`github`至服务器的`known_hosts`文件中  
- 执行以下命令`ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts`  
若不执行此操作，`github`访问服务器可能会出错  

完成以上步骤后，即可开始项目的部署文件配置  

完整的代码在下方，当中的一些细节用注释标出  
```yml
name: Deploy server to aliyun 
on: 
  push:
    branches:
      - master 
jobs:
  deploy-and-start:
    runs-on: ubuntu-latest # 运行环境
    steps:
      # 切换分支
      - name: Checkout  
        uses: actions/checkout@master

      # 设置ssh文件
      - name: Setup ssh
        env:
          # 这里用到了刚刚的环境变量，本机的 ssh 私钥  
          LOCAL_SSH_PRIVATE_KEY: ${{ secrets.LOCAL_SSH_PRIVATE_KEY }}
        # 在虚拟机中生成对应的 ssh 文件
        # 否则的话在下面的 pm2 操作中 将无法验证通过  
        run: |  
          mkdir -p ~/.ssh/
          echo "$LOCAL_SSH_PRIVATE_KEY" > ~/.ssh/id_rsa 
          chmod 600 ~/.ssh/id_rsa

      # 设置node 
      - name: setup node 
        uses: actions/setup-node@v1
        with:
          node-version: 12.16.1
      # 安装对应的模块  
      - run: |
          npm install yarn pm2 -g
      # 代码更新至服务器  
      # 如果是第一次的话则执行 pm2 deploy pm2.config.js production setup
      - run: |
          pm2 deploy pm2.config.js production update

      # 登录服务器并启动docker服务   
      - name: start the remote server 
        uses: appleboy/ssh-action@master
        with:
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          host: ${{ secrets.SSH_IP }}
          # 进入到服务器的项目路径下  
          # 安装全局依赖  
          # 安装项目依赖  
          # 启动/重启 docker服务  
          # 启动项目  
          script: |
            cd ${{ secrets.REMOTE_PATH }}
            npm install pm2 yarn -g 
            yarn 
            docker-compose -f docker-compose.yml pull
            docker-compose -f docker-compose.yml up -d
            pm2 startOrRestart pm2.config.js
```

### 当中的问题  
1. 为什么使用`pm2`  
`node`作为一个后台服务应用，不像前端应用一样存在周期短，它被要求需要长期保持稳定的启动状态，当中的许多细节如果单靠开发者来控制的话，会显得相当的麻烦，此时依靠与`pm2`来进行管理会变得非常的容易。  
`pm2`内置了负载均衡，出错重启，后台运行等的特点，帮助开发者在运维当中给到了相当大的便利，并且它还能帮你自动部署项目到远程服务器。具体的细节可自行前往[github](https://github.com/Unitech/pm2)查看  
2. 为什么使用`docker`  
> Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows操作系统的机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。  

想象一下当你辛苦的在服务器上部署完成了`nginx`、`mongodb`、`redis`等服务之后，某一天突然要求你更换另一台服务器部署，你是否需要重新将刚刚的服务重新安装启用部署，这样就显得非常麻烦了。  
而`docker`这种封闭的，可移植的特性，可以极大的简化我们的部署流程，我们只需配置一次，即可，后续的所有操作全部都在`docker`容器当中进行。具体的细节不在本次讨论范围。  

## 结束  
这是本人在自己的摸索中踩坑的一些内容，当中可能还不乏一些错误，欢迎指正🙏🏻  
最后，这是本人的[后台服务项目](https://github.com/food-billboard/node-server)，其中有上面的配置文件等，欢迎大家参考点评😁。