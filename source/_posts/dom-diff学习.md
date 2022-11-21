---
title: dom-diff学习
date: 2022-11-21 22:27:00
tags: front 
banner_img: /images/dom-diff学习/background.jpeg
index_img: /images/dom-diff学习/background.jpeg
categories: 
  - 前端   
---

# dom-diff学习

## 介绍

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

- 下面给出了这几个例子  

|  旧开始节点索引   | 旧结束节点索引  | 新开始节点索引  | 新结束节点索引  |
|  -------------  | -----------  | ------------  | ------------  |
| 0               |      2       |       0       |       2       |
| 1               |      2       |       1       |       2       |


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
    else {
			if (oldKeyToIdx === undefined) {
				oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
			}
			idxInOld = oldKeyToIdx[newStartVnode.key as string]
			if (isUndef(idxInOld)) {
				// New element
				api.insertBefore(
					parentElm,
					createElm(newStartVnode, insertedVnodeQueue),
					oldStartVnode.elm!
				)
			} else {
				elmToMove = oldCh[idxInOld]
				if (elmToMove.sel !== newStartVnode.sel) {
					api.insertBefore(
						parentElm,
						createElm(newStartVnode, insertedVnodeQueue),
						oldStartVnode.elm!
					)
				} else {
					patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
					oldCh[idxInOld] = undefined as any
					api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!)
				}
			}
			newStartVnode = newCh[++newStartIdx]
		}
	}

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
	if (oldStartIdx <= oldEndIdx) {
		removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
	}
}
```

### React

#### Fiber

在 16 之前，React 是直接递归渲染 vdom 的，setState 会触发重新渲染，对比渲染出的新旧 vdom，对差异部分进行 dom 操作。
从 vdom 转成 fiber 的过程叫做 reconcile（调和），这个过程是可以打断的，由 scheduler 调度执行。
链表

diff 算法应对三种场景：**节点更新**、**节点增删**、**节点移动**。

节点更新  
 只有在 key 和 sel 相同的情况下才算更新。

## 结束

> 参考  
> [深入理解 React Diff 算法](https://segmentfault.com/a/1190000039021724)  
> [DIff 算法看不懂就一起来砍我(带图)](https://juejin.cn/post/7000266544181674014)  
> [图解 React 的 diff 算法：核心就两个字 —— 复用](https://juejin.cn/post/7131741751152214030)  
> [react-source-code-debug](https://githu