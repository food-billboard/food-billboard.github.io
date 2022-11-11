---
title: docx库Table踩坑
date: 2022-11-11 11:20:00
tags: docx word 
banner_img: /images/docx库Table踩坑/background.svg
index_img: /images/docx库Table踩坑/background.svg
categories: 
  - 导出
  - 前端  
---

## docx库Table踩坑   

## 介绍 

最近工作中遇到了需要导出`word`文档的需求，只是简单的将列表详情的数据导出成`word`中的表格。  
类似于下面的效果：

|   标题  | 内容  |
|  ----  | ----  |
| 标题  | 内容 |
| 标题  | 内容 |

之后找到了相关的工具库[docx](https://github.com/dolanmiu/docx)。  
功能强大，他封装了`word`中的相关模块的构造方法，只需要简单的创建一个对象就可以生成`word`文档。  
其中的一些构造方法有`Document`、`Table`、`Paragraph`、`TextRun`等。  

## 正文 

接着就正式开始嘎嘎一顿操作。  

### 简单实现  
```js 
import {
  Document,
	Table,
	TableCell,
	TableRow,
	Paragraph,
	VerticalAlign,
	WidthType,
	TableLayoutType,
} from 'docx'

export default function exportDocx(filename, value) {
  const table = new Table({
    rows: value.reduce((acc, item) => {
			const { key, value } = item
			if (Array.isArray(value)) {
				acc.push(
					...value.map((item, index) => {
						return new TableRow({
							children: [
								...(index == 0
									? [
											new TableCell({
												rowSpan: value.length,
												children: [
													new Paragraph({
														text: key,
													}),
												],
												verticalAlign: VerticalAlign.CENTER,
											}),
									  ]
									: []),
								new TableCell({
									children: [
										new Paragraph({
											text: item,
										}),
									],
									verticalAlign: VerticalAlign.CENTER,
								}),
							],
						})
					})
				)
			} else {
				acc.push(
					new TableRow({
						children: [
							new TableCell({
								children: [
									new Paragraph({
										text: key,
									}),
								],
								verticalAlign: VerticalAlign.CENTER,
							}),
							new TableCell({
								children: [
									new Paragraph({
										text: value,
									}),
								],
								verticalAlign: VerticalAlign.CENTER,
							}),
						],
					})
				)
			}
			return acc
		}, [])
  })
}

```

简单试试：  
```js
exportDocx('example.docx', [
  {
    key: "title1",
    value: "value1"
  },
  {
    key: "title2",
    value: [
      "value2-1",
      "value2-2",
      "value2-3"
    ]
  }
])
```
<img src="/images/docx库Table踩坑/docx-1.jpg" />  

看着没啥问题，但是他没有撑满整个文档。  
给`Table`加个宽度。  

- 因为存在一个标题存在多条数据的情况，所以需要使用到`rowSpan`，和html`table`同理。  
- `verticalAlign`，内容垂直对齐方式。  
- `Paragraph`段落内容，可以当成文字使用。  
- `TableRow`，等同于html的`tr`  
- `TableCell`，等同于html的`td`  

### 添加宽度  

```js
new Table({
  width: {
    type: WidthType.PERCENTAGE,
    size: 100 
  }
})
```
<img src="/images/docx库Table踩坑/docx-2.jpg" />  

- WidthType 是一些宽度类型的枚举值`AUTO(default) | PERCENTAGE(百分比) | NIL(空) | DXA(二十分之一点)`  
- 关于这个`DXA`单位，大致看下[这里](https://blog.csdn.net/weixin_36053926/article/details/112532485)。  

看着没问题。 再试试多加点内容的情况👍。  

```js
exportDocx('example.docx', [
  {
    key: "title1",
    value: "value1".repeat(50)
  },
  {
    key: "title2",
    value: [
      "value2-1",
      "value2-2",
      "value2-3"
    ]
  }
])
```

<img src="/images/docx库Table踩坑/docx-3.jpg" />   

有点问题，文字多的那一栏，宽度超出了太多。  
并且在钉钉里看到的预览效果是这样的。  

<img src="/images/docx库Table踩坑/docx-4.jpg" />

<div align="center">
<img src="/images/docx库Table踩坑/emoji-1.jpg" />   
</div>

在仓库里逛了会儿`issue`找到了对应的问题。  
[解决办法-1](https://github.com/dolanmiu/docx/issues/349)。  
[解决办法-2](https://github.com/dolanmiu/docx/issues/1139)。    

- 不再使用百分比宽度，而是使用`DXA`宽度。  
- 将`Table`的宽度设置成0，并且规定其列数和列宽。  
- 设置`Table`的`layout`为`FIXED`。  

```js
new Table({
  layout: TableLayoutType.FIXED,
	columns: 3,
	width: 0, 
	columnWidths: [3213, 3213, 3212] // total page width is 9638 DXA for A4 portrait
})
```
关于上面宽度设置成**0**的问题，打开`word`文档查看：  
<img src="/images/docx库Table踩坑/表格大小.jpg" />   
虽然指定宽度的按钮未被选中，但是在钉钉中依旧生效了。  
将其指定为`0`保证完全不受影响。  
设置`Table`的`layout`为`FIXED`，表示固定尺寸，防止单元格被压缩变形。  
关于`DXA`的问题，个人猜测是可能百分比不被识别。  

最后附上完整的例子。  

```js
	export default (filename, value) => {
	const table = new Table({
		layout: TableLayoutType.FIXED,
		columns: 2,
		width: 0,
		columnWidths: [3213, 6425],
		rows: value.reduce((acc, item) => {
			const { key, value } = item
			if (Array.isArray(value)) {
				acc.push(
					...value.map((item, index) => {
						return new TableRow({
							children: [
								...(index == 0
									? [
											new TableCell({
												rowSpan: value.length,
												children: [
													new Paragraph({
														text: key,
													}),
												],
												verticalAlign: VerticalAlign.CENTER,
											}),
									  ]
									: []),
								new TableCell({
									children: [
										new Paragraph({
											text: item,
										}),
									],
									verticalAlign: VerticalAlign.CENTER,
								}),
							],
						})
					})
				)
			} else {
				acc.push(
					new TableRow({
						children: [
							new TableCell({
								children: [
									new Paragraph({
										text: key,
									}),
								],
								verticalAlign: VerticalAlign.CENTER,
							}),
							new TableCell({
								children: [
									new Paragraph({
										text: value,
									}),
								],
								verticalAlign: VerticalAlign.CENTER,
							}),
						],
					})
				)
			}
			return acc
		}, []),
	})

	const doc = new Document({
		sections: [
			{
				children: [table],
			},
		],
	})

	return docx.Packer.toBlob(doc).then((blob) => {
		saveAs(blob, `${filename || "example"}.docx`)
	})
}
```

<img src="/images/docx库Table踩坑/docx-5.jpg" />


## 结束 

简单记录下此次使用[docx](https://github.com/dolanmiu/docx)的踩坑。  