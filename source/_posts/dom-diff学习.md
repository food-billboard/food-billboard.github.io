---
title: dom-diff学习
date: 2022-11-21 22:27:00
tags: front 
banner_img: /images/dom-diff学习/diff-1.jpg
index_img: /images/dom-diff学习/diff-1.jpg
categories: 
  - 前端   
---

# dom-diff学习

## 介绍

本次介绍的是`dom-diff`的逻辑，他对于我们在使用相关框架时，能更好的书写逻辑，避免出现一些问题的出现。  

## 开始

### snabbdom

一个精简化、模块化、功能强大、性能卓越的虚拟 DOM 库。  
 几乎包含了虚拟 Dom 相关模块的所有功能，并且也提供了跨端的支持。  
 通过查看他的源码可以更好的理解`diff`原理。

#### 主要特点

- 200 行 - 你可以通过简单地阅读所有核心代码来充分理解其工作原理
- 通过模块化实现可拓展
- 对于 vnode 和全局模块都提供了 hook，你可以在 patch 过程或者其他地方调用 hook
- 性能卓越：Snabbdom 是目前最高效的虚拟 DOM 库之一
- Patch 函数有一个相当于 reduce/scan 函数的函数声明，这将更容易集成其他函数式库

#### 使用

```typescript
import {
	init,
	classModule,
	propsModule,
	styleModule,
	eventListenersModule,
	h as createElement,
} from "snabbdom"

// 初始化
const patch = init([
	// 通过传入模块初始化 patch 函数
	classModule, // 开启 classes 功能
	propsModule, // 支持传入 props
	styleModule, // 支持内联样式同时支持动画
	eventListenersModule, // 添加事件监听
])

// 外层容器，相当于就是react最外部的 #app
const container = document.getElementById("container")

/*
  <div id="container" class="two classes" onclick="someFn">
    <span style="font-weight: bold">
      This is bold
    </span>
     and this is just normal text
    <a href="/foo">I'll take you places!</a>
  </div>
*/

// 创建虚拟Dom
const vnode = createElement(
	// sel
	"div#container.two.classes",
	// data 包含一些props attrs class等等
	{
		on: {
			click: someFn,
		},
	},
	// children
	[
		createElement(
			// sel
			"span",
			// data
			{
				style: {
					fontWeight: "bold",
				},
			},
			// children
			"This is bold"
		),
		// children
		" and this is just normal text",
		createElement(
			"a",
			{
				props: {
					href: "/foo",
				},
			},
			"I'll take you places!"
		),
	]
)

// 传入一个空的元素节点 - 将产生副作用（修改该节点）
patch(container, vnode)

/*
  <div id="container" class="two classes" onclick="anotherEventHandler">
    <span style="font-weight: bold;font-style: italic;">
      This is now italic type
    </span>
     and this is still just normal text
    <a href="/bar">I'll take you places!</a>
  </div>
*/

// 再次创建虚拟Dom
const newVnode = createElement(
	"div#container.two.classes",
	{
		on: {
			click: anotherEventHandler,
		},
	},
	[
		createElement(
			"span",
			{
				style: {
					fontWeight: "normal",
					fontStyle: "italic",
				},
			},
			"This is now italic type"
		),
		" and this is still just normal text",
		createElement(
			"a",
			{
				props: {
					href: "/bar",
				},
			},
			"I'll take you places!"
		),
	]
)
// 再次调用 `patch`
patch(vnode, newVnode) // 将旧节点更新为新节点
```

### 虚拟 Dom

虚拟 Dom 是一个 javascript 对象结构。  
 大致为以下形式。

```typescript
export interface VNodeData {
  props?: Props
  attrs?: Attrs
  class?: Classes
  style?: VNodeStyle
  dataset?: Dataset
  on?: On
  hero?: Hero
  attachData?: AttachData
  hook?: Hooks
  key?: Key
  ns?: string // for SVGs
  fn?: () => VNode // for thunks
  args?: any[] // for thunks
  [key: string]: any // for any other 3rd party module
}

export type Key = string | number

const interface VNode = {
    sel: string | undefined, // 选择器
    data: VNodeData | undefined, // VNodeData上面定义的VNodeData
    children: Array<VNode | string> | undefined, //子节点,与text互斥
    text: string | undefined, // 标签中间的文本内容
    elm: Node | undefined, // 转换而成的真实DOM
    key: Key | undefined // 字符串或者数字
}
```

#### 作用

- 模板引擎可以简化视图操作,没办法跟踪状态，虚拟 Dom 可以
- 通过比较前后两次状态差异更新真实 DOM，减少 Dom 操作
- 可以跨平台使用
- 创建内存开销小，性能更好（复杂视图情况）

### Diff

#### 简单描述

1. `init`初始化，返回`patch`函数。
2. `h`函数创建虚拟 Dom 对象。
3. `patch`比较新旧虚拟 Dom。
4. 将发生变化的 Dom 更新反映到真实 Dom 树当中。

#### 细节

- init

采用闭包的形式，内部创建变量

```typescript
function init(
	// 注册模块，就像是上面例子里的 class style模块等
	modules: Array<Partial<Module>>,
	// 跨端使用，默认浏览器api
	domApi?: DOMAPI,
	// 额外options
	options?: Options
) {
	// cbs 一些钩子函数🐶

	// 一些工具方法
	// createElm addVnodes removeVnodes updateChildren patchVnode

	return function (oldVnode, vnode) {
		// 比较新旧vnode并处理
	}
}
```

- h

```typescript
function h(
	// 元素选择器
	sel: any,
	// data
	b?: any,
	// children
	c?: any
) {
	// ... 一系列的参数组织逻辑
	return vnode(sel, data, children, text, undefined)
}
```

- vnode

```typescript
function vnode(
	// 元素选择器
	sel: string | undefined,
	// 一些相关props属性集合
	data: any | undefined,
	// 子节点
	children: Array<VNode | string> | undefined,
	// 字符串内容
	text: string | undefined,
	// 真实Dom
	elm: Element | DocumentFragment | Text | undefined
): VNode {
	const key = data === undefined ? undefined : data.key
	return { sel, data, children, text, elm, key }
}
```

##### patch

```typescript
// 判断是否为相同vnode
function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
	const isSameKey = vnode1.key === vnode2.key
	const isSameIs = vnode1.data?.is === vnode2.data?.is
	const isSameSel = vnode1.sel === vnode2.sel
	const isSameTextOrFragment =
		!vnode1.sel && vnode1.sel === vnode2.sel
			? typeof vnode1.text === typeof vnode2.text
			: true

	return isSameSel && isSameKey && isSameIs && isSameTextOrFragment
}

function patch(
	oldVnode: VNode | Element | DocumentFragment,
	vnode: VNode
): VNode {
	let i: number, elm: Node, parent: Node
	const insertedVnodeQueue: VNodeQueue = []
	// pre钩子执行
	for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]()

	// 判断是否为element(nodetype === 1)，不是就把他转成vnode
	if (isElement(api, oldVnode)) {
		oldVnode = emptyNodeAt(oldVnode)
	}
	// 判断是否为空节点(nodetype === 11)
	// 是的话转成vnode 空节点
	else if (isDocumentFragment(api, oldVnode)) {
		oldVnode = emptyDocumentFragmentAt(oldVnode)
	}

	// 如果是相同节点则进行比较
	// 具体细节看后面
	if (sameVnode(oldVnode, vnode)) {
		patchVnode(oldVnode, vnode, insertedVnodeQueue)
	}
	// 不相同则直接插入
	else {
		elm = oldVnode.elm!
		parent = api.parentNode(elm) as Node

		// 就是一个递归调用初始化创建dom节点的方法
		createElm(vnode, insertedVnodeQueue)

		if (parent !== null) {
			api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
			removeVnodes(parent, [oldVnode], 0, 0)
		}
	}

	for (i = 0; i < insertedVnodeQueue.length; ++i) {
		insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i])
	}
	for (i = 0; i < cbs.post.length; ++i) cbs.post[i]()
	return vnode
}
```

##### patchVnode

```typescript
function patchVnode(
	oldVnode: VNode,
	vnode: VNode,
	insertedVnodeQueue: VNodeQueue
) {
	const hook = vnode.data?.hook
  // 钩子执行 
	hook?.prepatch?.(oldVnode, vnode)
	const elm = (vnode.elm = oldVnode.elm)!
	if (oldVnode === vnode) return
  // 一些数据的格式处理 
	if (
		vnode.data !== undefined ||
		(isDef(vnode.text) && vnode.text !== oldVnode.text)
	) {
		vnode.data ??= {}
		oldVnode.data ??= {}
		for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
		vnode.data?.hook?.update?.(oldVnode, vnode)
	}

	const oldCh = oldVnode.children as VNode[]
	const ch = vnode.children as VNode[]
  // 新vnode没有text
	if (isUndef(vnode.text)) {
    // 新旧都有子vnode
		if (isDef(oldCh) && isDef(ch)) {
      // 更新子vnode，详情的看下面
			if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
		} 
    // 只有新的有子vnode
    else if (isDef(ch)) {
      // 将text属性置为空字符串
			if (isDef(oldVnode.text)) api.setTextContent(elm, "")
      // 将新vnode下面的子vnode全部添加到dom树中
			addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
		} 
    // 只有旧的有子vnode
    else if (isDef(oldCh)) {
      // 删除旧vnode中的所有子vnode
			removeVnodes(elm, oldCh, 0, oldCh.length - 1)
		} 
    // 新旧都没有子vnode且旧vnode有text
    else if (isDef(oldVnode.text)) {
      // 简单置空dom的text
			api.setTextContent(elm, "")
		}
	} 
  // 新旧vnode的text不同  
  else if (oldVnode.text !== vnode.text) {
    // 同上删除所有的子vnode 
		if (isDef(oldCh)) {
			removeVnodes(elm, oldCh, 0, oldCh.length - 1)
		}
    // 设置新vnode的text
		api.setTextContent(elm, vnode.text!)
	}
  // 钩子执行
	hook?.postpatch?.(oldVnode, vnode)
}
```

##### updateChildren 

- 五种情况的处理  
	1. 新开始节点 vs 旧开始节点（new_start_index++, old_start_index++）  
	2. 新结束节点 vs 旧结束节点（new_end_index--, old_end_index--）  
	3. 新结束节点 vs 旧开始节点（new_end_index--, old_start_index++）  
	4. 新开始节点 vs 旧结束节点（new_start_index++, old_end_index--）  
	5. 在 旧节点 中寻找 新开始节点，找到则位移到 旧开始节点 的位置，否则创建到 旧开始节点 的位置。  

	每次循环只需执行通过上述一个条件即可。  
	当新或者旧节点遍历完成则退出循环。  


```typescript
function updateChildren(
	parentElm: Node,
	oldCh: VNode[],
	newCh: VNode[],
	insertedVnodeQueue: VNodeQueue
) {
	let oldStartIdx = 0
	let newStartIdx = 0
	let oldEndIdx = oldCh.length - 1
	let oldStartVnode = oldCh[0]
	let oldEndVnode = oldCh[oldEndIdx]
	let newEndIdx = newCh.length - 1
	let newStartVnode = newCh[0]
	let newEndVnode = newCh[newEndIdx]
	let oldKeyToIdx: KeyToIndexMap | undefined
	let idxInOld: number
	let elmToMove: VNode
	let before: any

	while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
		if (oldStartVnode == null) {
			oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
		} else if (oldEndVnode == null) {
			oldEndVnode = oldCh[--oldEndIdx]
		} else if (newStartVnode == null) {
			newStartVnode = newCh[++newStartIdx]
		} else if (newEndVnode == null) {
			newEndVnode = newCh[--newEndIdx]
		} 
    // 情况一
    // 新旧开始节点相同
    else if (sameVnode(oldStartVnode, newStartVnode)) {
			patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
			oldStartVnode = oldCh[++oldStartIdx]
			newStartVnode = newCh[++newStartIdx]
		} 
    // 情况二
    // 新旧结束节点相同
    else if (sameVnode(oldEndVnode, newEndVnode)) {
			patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
			oldEndVnode = oldCh[--oldEndIdx]
			newEndVnode = newCh[--newEndIdx]
		} 
    // 情况三
    // 新结束和旧开始节点相同
    // 将旧开始节点移动到旧结束节点后面
    else if (sameVnode(oldStartVnode, newEndVnode)) {
			// Vnode moved right
			patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
			api.insertBefore(
				parentElm,
				oldStartVnode.elm!,
				api.nextSibling(oldEndVnode.elm!)
			)
			oldStartVnode = oldCh[++oldStartIdx]
			newEndVnode = newCh[--newEndIdx]
		} 
    // 情况四
    // 新开始节点和旧结束节点相同
    // 将旧结束节点移动到旧开始节点前面
    else if (sameVnode(oldEndVnode, newStartVnode)) {
			// Vnode moved left
			patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
			api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!)
			oldEndVnode = oldCh[--oldEndIdx]
			newStartVnode = newCh[++newStartIdx]
		} 
    // 情况五
		// 将旧节点列表的指定区间内的节点信息转成对象map格式
		// {
		//		key: index, 组件的key，组件的index索引
		// }
		// 从newStartIndex开始从map中查找是否存在该节点
    else {
			// 一开始初始化
			if (oldKeyToIdx === undefined) {
				oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
			}
			idxInOld = oldKeyToIdx[newStartVnode.key as string]
			// 如果新节点在旧节点中不存在
			// 创建新节点插入到旧开始节点前面
			if (isUndef(idxInOld)) {
				// New element
				api.insertBefore(
					parentElm,
					createElm(newStartVnode, insertedVnodeQueue),
					oldStartVnode.elm!
				)
			} 
			// 新节点在旧节点中存在
			else {
				elmToMove = oldCh[idxInOld]
				// sel 不同则重新创建
				// 将新节点插入到旧开始节点的前面
				if (elmToMove.sel !== newStartVnode.sel) {
					api.insertBefore(
						parentElm,
						createElm(newStartVnode, insertedVnodeQueue),
						oldStartVnode.elm!
					)
				} 
				// 如果是相同节点则进行下一层级的比较  
				// 并将该节点插入到旧节点的前面
				else {
					patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
					oldCh[idxInOld] = undefined as any
					api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!)
				}
			}
			newStartVnode = newCh[++newStartIdx]
		}
	}

	// 最后的收尾工作

	// 新开始节点小于等于新结束节点
	// 旧节点已经遍历完成
	// before用于addVnodes中的insertBefore的参照dom
	// 将新节点中未处理的节点全部添加到before的前面  
	if (newStartIdx <= newEndIdx) {
		before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
		addVnodes(
			parentElm,
			before,
			newCh,
			newStartIdx,
			newEndIdx,
			insertedVnodeQueue
		)
	}
	// 旧节点小于等于旧结束节点
	// 新节点已经遍历完成
	// 说明存在需要删除的节点
	// 将索引区间内的所有节点全部删除
	if (oldStartIdx <= oldEndIdx) {
		removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
	}
}
```

- 下面是一个包含前四种情况的一个例子  

<img src="/images/dom-diff学习/diff-1.jpg" />

| step | new_start | new_end | old_start | old_end |
| :--: | :-------: | :-----: | :-------: | :-----: |
| 1    |     0     |    4    |    0      |    3    |

<img src="/images/dom-diff学习/diff-2.jpg" />

| step | new_start | new_end | old_start | old_end |
| :--: | :-------: | :-----: | :-------: | :-----: |
| 1    |     0     |    4    |    0      |    3    |
| 2    |     1     |    4    |    1      |    3    |

<img src="/images/dom-diff学习/diff-3.jpg" />

| step | new_start | new_end | old_start | old_end |
| :--: | :-------: | :-----: | :-------: | :-----: |
| 1    |     0     |    4    |    0      |    3    |
| 2    |     1     |    4    |    1      |    3    |
| 3    |     1     |    3    |    1      |    2    |

<img src="/images/dom-diff学习/diff-4.jpg" />

| step | new_start | new_end | old_start | old_end |
| :--: | :-------: | :-----: | :-------: | :-----: |
| 1    |     0     |    4    |    0      |    3    |
| 2    |     1     |    4    |    1      |    3    |
| 3    |     1     |    3    |    1      |    2    |
| 4    |     2     |    3    |    1      |    1    |

<img src="/images/dom-diff学习/diff-5.jpg" />

| step | new_start | new_end | old_start | old_end |
| :--: | :-------: | :-----: | :-------: | :-----: |
| 1    |     0     |    4    |    0      |    3    |
| 2    |     1     |    4    |    1      |    3    |
| 3    |     1     |    3    |    1      |    2    |
| 4    |     2     |    3    |    1      |    1    |
| 5    |     3     |    3    |    2      |    1    |  

<img src="/images/dom-diff学习/diff-6.jpg" />

`while`循环至此全部结束。  
接着就是下面的收尾工作。  
将剩下的节点插入到`newEndIndex`节点前。  

- 接着是一个第五种情况的例子  

<img src="/images/dom-diff学习/diff-7.jpg" />

上面的例子，只说新节点的第一个子节点。  
前面四种情况都无法满足。  
```typescript 
if(false) {
	// ...
}else {
	if (oldKeyToIdx === undefined) {
		oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	}
	idxInOld = oldKeyToIdx[newStartVnode.key as string];
	if (isUndef(idxInOld)) {
		api.insertBefore(
			parentElm,
			createElm(newStartVnode, insertedVnodeQueue),
			oldStartVnode.elm!
		);
	} else {
		elmToMove = oldCh[idxInOld];
		if (elmToMove.sel !== newStartVnode.sel) {
			api.insertBefore(
				parentElm,
				createElm(newStartVnode, insertedVnodeQueue),
				oldStartVnode.elm!
			);
		} else {
			patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
			oldCh[idxInOld] = undefined as any;
			api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
		}
	}
	newStartVnode = newCh[++newStartIdx];
}
```
因为是第一次进入，所以`oldKeyIndex`为`undefined`。  
创建旧节点的`map`，结构如下：  
```javascript
	{
		a: 0,
		b: 1,
		c: 2,
		d: 3
	}
```
`newStartVnode`当前为新节点下的第一个子节点，`key`为`a`。  
所以`idxInOld`不为`undefined`。  
接着拿到相关旧节点`elmToMove`，且`sel`相同。  
最后比较两个节点的子节点。  
将元素插入到旧开始节点的前面。  
进入下一个循环。    

### React

> 以下为个人理解，如有问题请指出。  

react的`diff`和上面的库的逻辑基本大同小异，但是在**16**以后，就发生了一点变化。  

#### Fiber 

上面的`diff`存在一个问题，就是在递归比较vnode的同时，也进行了dom操作，当产生大量的更新时，页面还是会出现卡顿的情况。  
在**16**以后，引入了`fiber`的概念，其数据结构其实就是一个**链表**。   
`fiber`中包含了很多相关信息，包括`sibling`、`child`、`return`这些层级关系，以及`effectTag`、`nextEffect`、`lastEffect`等等。  
将整个更新过程分成了几个阶段：  
- render   
	将`vnode`转换为`fiber`结构。  
	将需要更新节点打上`effectTag`标记。  
	此过程可以被打断（存在一个scheduler进行调度），并且不同的更新时存在优先级的。  
- commit  
	真正的更新过程。  
	无法被中断。  

### 关于Key

通过上面的介绍，可以看出，`key`属性在`diff`过程中非常重要。  
- 他可以使过程变得更快  
- 也可以避免出错  
- 并且使用索引作为`key`也会发生未知的错误  

参考[深入理解 React Diff 算法](https://juejin.cn/post/6919302952486174733)中的例子。  

#### 不设置key的情况  

<img src="/images/dom-diff学习/diff-8.jpg" />

假设没有设置`key`，在第三次循环当中，因为被判断成了是相同节点，多了一次`patch`的过程。  

<img src="/images/dom-diff学习/diff-9.jpg" />  

当设置了`key`的情况，在第三次循环时，会走上面的情况三（new_end vs old_start）。  

#### 设置索引为key的情况  

<img src="/images/dom-diff学习/diff-10.jpg" />   

根据上图显示，因为使用了索引作为`key`，在新增了一个**节点d**到开始位置时。  
`diff`判断为情况一，所以**节点a**的颜色属性被赋值到了**节点d**上，引发了问题。  

### 其他  

	1. 推荐使用function-component  
	2. class-component 不使用`componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate`  
	3. 不需要使用三目判断元素是否渲染。  
	```js
		function Component() {
			return (
				<div>
					{/*没有必要*/}
					{
						a ? (<div></div>) : null 			
					}
					{/*直接这样*/}
					{
						!!a && (<div></div>)
					}
				</div>
			)
		}
	```


## 结束

> 参考  
 [深入理解 React Diff 算法](https://juejin.cn/post/6919302952486174733)  
 [DIff 算法看不懂就一起来砍我(带图)](https://juejin.cn/post/7000266544181674014)  
 [图解 React 的 diff 算法：核心就两个字 —— 复用](https://juejin.cn/post/7131741751152214030)  
 [react-source-code-debug](https://github.com/neroneroffy/react-source-code-debug)  
 [React Fiber 源码解析](https://juejin.cn/post/6859528127010471949)  
