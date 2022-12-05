---
title: 贡献代码给Github开源项目
date: 2022-10-11 13:53:00
tags: github
banner_img: /images/贡献代码给Github开源项目/background.png
index_img: /images/贡献代码给Github开源项目/background.png
categories: 
  - github    
---

# 贡献代码给Github开源项目   

## 介绍  

之前就一直想给开源项目贡献自己的一份力，奈何都没有找到合适的机会，前几天尝试给开源项目[ahooks](https://github.com/alibaba/hooks)贡献一下代码，虽然没有被采纳，但是也在这里做一下记录吧📝。  
全文的贡献流程均参考文章《[如何贡献代码到Github开源项目](https://juejin.cn/post/6844903944418787341)》。  

## 正文  

1. 找到目标项目。  

首先是找一个适合的开源目标项目，并且有自己发现的`bug`或者优化等地方。  
本人找到的是`ahooks`，因为相对来说，各个`hook`相对独立，并且代码精简，阅读方便。  
本人希望在其中新增一个`hook`，用于监听浏览器的`location hash`变化以及修改。  


2. fork项目  

接着将目标项目`fork`到自己的账号下面。  

<img src="/images/贡献代码给Github开源项目/fork.jpg" />
<img src="/images/贡献代码给Github开源项目/fork-self.jpg" />

3. clone项目  

将自己仓库下的项目`clone`到本地。  
`git clone git@github.com:food-billboard/自己仓库的项目.git`  

4. 建立链接  

如果要提交本地代码到开源项目，需要建立其链接。  
`git remote add upstream git@github.com:xxxx/开源仓库.git`  
验证以下命令会出现两个`upstream`地址。  
`git remote -v`  

5. 新建分支&修改代码&提交    

接着就是按照平常的简单的新分支编写代码并提交。    
  - 顺带一提  
  为了保证质量与安全，一般都应该在提交前，完成对应修改或新增模块的功能测试以及文档修改。  

6. compare&pull request  

提交代码后，会在自己仓库主页上方出现`compare&pull request`按钮。  
点击进入到提交界面。  

<img src="/images/贡献代码给Github开源项目/pull-request.jpg" />

一般优秀的开源项目都会有对象的`pr`模板，我们应该按照他们的模板来进行对应的信息填写，方便作者核实相关信息。  
完成填写后，点击提交，即完成了一次代码贡献👍。  

下面给一个`antd`的模板。  
```markdown
  <!--
首先，感谢你的贡献！😄

新特性请提交至 feature 分支，其余可提交至 master 分支。
在维护者审核通过后会合并。
请确保填写以下 pull request 的信息，谢谢！~
-->

[[English Template / 英文模板](https://github.com/ant-design/ant-design/blob/master/.github/PULL_REQUEST_TEMPLATE.md)]

### 🤔 这个变动的性质是？

- [ ] 新特性提交
- [ ] 日常 bug 修复
- [ ] 站点、文档改进
- [ ] 演示代码改进
- [ ] 组件样式/交互改进
- [ ] TypeScript 定义更新
- [ ] 包体积优化
- [ ] 性能优化
- [ ] 功能增强
- [ ] 国际化改进
- [ ] 重构
- [ ] 代码风格优化
- [ ] 测试用例
- [ ] 分支合并
- [ ] 其他改动（是关于什么的改动？）

### 🔗 相关 Issue

<!--
1. 描述相关需求的来源，如相关的 issue 讨论链接。
-->

### 💡 需求背景和解决方案

<!--
1. 要解决的具体问题。
2. 列出最终的 API 实现和用法。
3. 涉及UI/交互变动需要有截图或 GIF。
-->

### 📝 更新日志

<!--
从用户角度描述具体变化，以及可能的 breaking change 和其他风险。
-->

| 语言    | 更新描述 |
| ------- | -------- |
| 🇺🇸 英文 |          |
| 🇨🇳 中文 |          |

### ☑️ 请求合并前的自查清单

⚠️ 请自检并全部**勾选全部选项**。⚠️

- [ ] 文档已补充或无须补充
- [ ] 代码演示已提供或无须提供
- [ ] TypeScript 定义已补充或无须补充
- [ ] Changelog 已提供或无须提供

```

### 注意  

需要注意的是，每次在提交代码前，都应该先将本地的代码与远程仓库进行同步，以免出现不必要的麻烦。  
这里补充下同步代码的命令。  
如果是刚刚执行过上述命令的情况下，可跳过以下步骤。  
1. 建立链接
`git remote add upstream git@github.com:xxxx/开源仓库.git`  
2. 拉取代码  
`git fetch upstream`  

## 结束 

大致的流程就是这个样子，希望在之后还能找到合适的机会，主要还是想锻炼一下自己的代码技术。  