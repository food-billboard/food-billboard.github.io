---
title: React日历组件
date: 2020-07-26 19:19:12
tags:
 - React
 - Component
 - Calendar
banner_img: /images/React日历组件/15938957-5F8F-4A7A-9F91-544D239677EC.png
index_img: /images/React日历组件/15938957-5F8F-4A7A-9F91-544D239677EC.png
categories:
  - React 
  - 前端  
  - CSS  
  - 组件  
---
这是本人写的第一篇文章，欢迎各位观看的朋友👭。
<img src="/images/React日历组件/2de9716fa4db0bdb643f6a0e87ad6819.JPG" width=100 height=100 />
先介绍一下自己，本人是一个刚刚进入社会的前端菜鸟，目前服务于一家小公司🏭。
## 1 故事背景
事情是这样的，最近在公司的h5项目中碰到一个需求，页面中需要有一个用于显示最近订单的日历样式，你没有看错，一个日历，这给我难到了，本来想着不就是是一个日历吗，这有什么难的，后来我发现好像似乎是高估了自己。 

先介绍下关于这个日历的样式，大家可以自行脑补一下苹果中自带的日历或看下图，基本和它差不多。多了一点需求是，在点击某一个日期或者是手指滑动过程中，日历下方的订单列表会根据日期的变动自动跳转到当前日期的订单。
<img src="/images/React日历组件/IMG_0144.PNG" width=188 height=334 /> 
<img src="/images/React日历组件/IMG_0145.PNG" width=188 height=334 /> 

因为项目用的技术栈是React，似乎理所应当该用 Ant Design 来完成，就pc端而言，Ant Design 的[日历组件](https://ant.design/components/calendar-cn/)相对于来说算是非常不错且还算契合的，奈何h5使用的是Ant Design Mobile，相对于来说的话，以个人之见，确实还有许多可以改进的地方，mobile中的[日历组件](https://mobile.ant.design/components/calendar-cn/)很多地方表现的还是不够灵活，有些地方还是过于定制化，还可以进一步完善。

所以，经过自己再三的对mobile的Calendar组件的修改（瞎78乱搞）以及思想斗争（不想搞了）之后。终于，选择自己做封装，在封装的过程中，也让本人学习到了一些之前还没有注意的东西。今天也一并作介绍，这也是对新知识的再一次复习。
## 2 正片开始
这里先不介绍具体业务上关于列表跳转方面的内容。只对日历相关作介绍🙂。
### Date
首先是与日历有重要关系的API Date。可能很多人会说，不会吧，不会吧，不会还有人会去用原生Date吧。现在确实在momentjs和dayjs面前，原生Date的操作确实显得有些复杂，但是总归来说还是要好好学习原生js的知识，这样才能有更好的提升。总的来说，多学总不会错（虽然还是很懒）。
1. 日期创建  
`new Date()`  
- 默认不传参数时，返回的当前的时间 `new Date()`
- 传递时间戳 `new Date(19999009090)`
- 或者再放一个Date实例 `new Date(new Date())`
- 一般情况下是按顺序 年、月、日... `new Date(2020, 6, 1)`
 - 需要注意的是，关于月份的参数，范围是0-11。  
 
有些情况下在需要做相关计算时，传递参数会给我们省下很多功夫  
比如：  
 **获取当前月份的天数**  
 比如现在是7月份，你想计算上一月份的天数，你可以这样
`new Date(2020, 6, 0).getDate() //30`  
当参数day为0时，month会自动-1，相当于`new Date(2020, 6, 30)`  
 **获取当前月第一天或者最后一天的信息**  
原理同上，可以这样`new Date(2020, 6).getDay()`，表示7月第一天星期几 
2. 日期设置  
`setDate()` 设置几号  
`setMonth()` 设置几月，注意和之前说的一样，范围是0-11  
`setFullYear()` 设置年份，setYear的替代版  
3. 日期获取  
`getTime()` 返回自1970年1月1日到现在的毫秒数  
`getDay()` 星期几（范围是0-6，一个星期从星期天开始）  
`getDate()` 几号  
`getMonth()` 几月  
`getFullYear()` 哪一年  

有了这几个API的支持，在做一些日期计算时会显得非常的方便。
### Grid
第二个介绍的与js无关，与css相关，是关于日历的布局问题。Grid栅格布局，听说这玩意儿老早就出了，奈何本人眼界窄居然现在才知道，用了之后发现这个东西真的好香，本人认为是非常适合做像日历这样的组件工具的布局。

相关用到API有如下（后面的图基本都来自己[阮一峰老师](http://www.ruanyifeng.com/home.html)的博客）

**容器样式**
1. display  
可以是块级栅格 ![grid](https://www.wangbase.com/blogimg/asset/201903/bg2019032504.png)
也可以是行内栅格 ![inline-grid](https://www.wangbase.com/blogimg/asset/201903/bg2019032505.png)
和普通的行内块级意思一样，行内能有多个栅格布局并排
另一个需要注意的地方是在gird布局下，有一些样式的设置无法产生效果，比如:  
> float、display: inline-block、display: table-cell、vertical-align和column-*  

2. grid-template-columns & grid-template-rows  
用于定义grid布局下行和列的数量，它的值有很多种  
- 长度单位  
`grid-template-columns: 100px 100px 100px;`  
`grid-template-rows: 100px 100px 100px;`  
这样就形成了一个 3行三列的布局  
![](https://www.wangbase.com/blogimg/asset/201903/bg2019032506.png)
- fr  
意思大概就是一个片段，比如
`grid-template-columns: 1fr 1fr;`   
意思是将整体布局分割成相等的两列
![](https://www.wangbase.com/blogimg/asset/201903/1_bg2019032509.png)
`grid-template-columns: 150px 1fr 2fr;`   
意思是第二个片段是第一个的两倍![](https://www.wangbase.com/blogimg/asset/201903/bg2019032510.png)  
- repeat函数
有时候你会觉得一个个设置块的宽度很麻烦，repeat函数可以将你设定的块数据进行指定的重复
`grid-template-columns: repeat(3, 100px);`  
等同于   
`grid-template-columns: 100px 100px 100px;`  
还可以使用关键字 `auto-fill`  
`grid-template-columns: repeat(auto-fill, 100px);`  
它会持续平铺100px宽的块直到当前行宽度不足时，换行  
- minmax函数  
`grid-template-columns: 100px minmax(100px, 200px) 100px;`  
表示中间列的宽度范围在100px 和 200px之间
参数也支持 fr 关键字  
- auto  
当你指定了3列，并设置了两列的宽度，且希望另一列宽度自适应时，可以使用此关键字。如
`grid-template-columns: 100px auto 100px;`中间列会自动自适应

3. grid-row-gap & grid-columns-gap & grid-gap  
  设置各个单元格之间的间距  
  `grid-row-gap: 20px;`  
  `grid-column-gap: 20px;`  
  ![](https://www.wangbase.com/blogimg/asset/201903/bg2019032511.png)
  grid-gap则是前两个的混合写法  
4. justify-items & align-items & place-items  
   值：`start | end | center | stretch`  
  设置单元格的水平垂直对齐方式，参数和flex差不多就不说了（懒）  

5. justify-content & align-content & place-content  
   值：`start | end | center | stretch | space-around | space-between | space-evenly`  
   容易的水平垂直对齐方式，参数和flex差不多就不说了（懒）  

**项目样式**
1. grid-column-start & grid-column-end & grid-row-start & grid-row-end  
就和名字差不多的意思，他可以让单元格的放置位置发生偏移，有了这个属性，可以让本项目中日历的月开头发生偏移而不必做其他的js操作。  
按照阮老师上面说的可能更容易理解，容器分成了指定的行和列，也会随即生成类似表格的边框线，但是不会显示。所以偏移的按照网格线的索引进行偏移。
![](https://www.wangbase.com/blogimg/asset/201903/1_bg2019032503.png)
比如  
`grid-column-start: 2;` 表示某一单元格的起始位置是容器的列网格线的第二根。  
`grid-column-end: 4;` 表示某一但云哥的结束位置是容器的列网格线的第四根。  
![](https://www.wangbase.com/blogimg/asset/201903/bg2019032526.png)

**其他属性**

`grid-column-end` 单元格的列结束位置  
`grid-row-start` 单元格的行起始位置  
`grid-row-end` 单元格的行结束位置  

2. justify-self & align-self & place-self  
设置单元格的水平垂直对齐方式，和上面容器的`justify-items`等效果相同，只是此属性是针对单个单元格的。  
【具体细节相关的API可以参考[阮一峰老师的博客](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)或者自行查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid)进行了解】
### Calendar
具体样式查看下图  

1. 单日着重  
<img src="/images/React日历组件/1595859653524_95CA67F7-E00E-4AA0-A51C-85895C099433.png" width="200" height="100" />

2. 周着重  
<img src="/images/React日历组件/1595859783955_DE771404-5E95-4876-BA63-44D01118D2EF.png" width="200" height="100" />

3. 色调更改  
<img src="/images/React日历组件/1595859830441_DBC34DF0-2308-4DBB-90F7-A70B70795B82.png" width="200" height="100" />

4. 显示单周  
<img src="/images/React日历组件/1595860081764_790B7081-F485-487D-9B74-5E88C13FD5FF.png" width="200" height="100" />

5. 设置额外内容  
<img src="/images/React日历组件/15938957-5F8F-4A7A-9F91-544D239677EC.png" width="200" height="100" />

因为每一个单元格外层设置了相对定位`relative`，所以如果不希望额外内容导致个别单元格位置不统一，可以将内容设置为`position: absolute;`  

具体的其他功能可查看下方API  

**API**

| props | 说明 | 类型 | 默认值 |
| :-------: | :--------------: | :------: | :------: |
| collapse | <div style="width:300pt">是否折叠，折叠时只显示一周的日期</div> | boolean | false |
| lunerVisible | 是否显示农历时间 | boolean | false  |
| showToday | 是否着重显示当天，对当天时间着重表示 | boolean | true |
| showWeek | 是否着重显示当前周，对本周时间着重表示，当showToday和showWeek同时存在时，showWeek生效 | boolean | false |
| activeStyle | 着重显示的样式，可以自定义着重显示的样式 | Object | {} |
| value | 当前时间，可配合rc-form进行使用，不传递此参数时由内部控制状态变化 | Date | false |
| onChange | 监听日期时间变化 | (date: Date) => any | 无 |
| hot | 日期下着重点 | 是否显示农历时间 | Array<Date> | false |
| renderHeader | 日历的header | (date: Date) => ReactNode | false |
| renderFooter | 日历的footer | (date: Date) => ReactNode | false |
| renderDateFooter | 每日的footer | (date: Date) => ReactNode &#124; ReactNode | false |
| colorStyle | 日历的整体颜色风格 | 颜色（目前只支持十六进制颜色）| #00CC73 |
| showLastNext | 是否显示上下月份的时间以填充月前和月后的空缺 | boolean | false |

还有一些方法供调用，可利用`ref`来获取相关方法  

| name | 说明 | 使用 |
| :--: | :--: | :---: |
| getMonthStart | 当月第一天 | getMonthStart(month?, year?) => Date |
| getMonthEnd | 当月最后一天 | getMonthEnd(month?, year?) => Date |
| getMonthDays | 获取当月天数 | getMonthDays(month?, year?) => number |
| getThisWeek | 本周开始和结束 | getThisWeek(date) => [start:Date, end:Date] |
| lastYear | 去年 | lastYear(date?) => Date |
| lastMonth | 上个月 | lastMonth(date?) => Date |
| lastWeek | 上周 | lastWeek(date?) => Date |
| lastDay | 昨天 | lastDay(date?) => Date |
| nextYear | 明年 | nextYear(date) => Date |
| nextMonth | 下个月 | nextMonth(date?) => Date |
| nextWeek | 下周 | nextWeek(date?) => Date |
| nextDay | 明天 | nextDay(date?) => Date |

从`lastYear`开始的后面几个方法，在传入Date参数时只会返回结果，若未传参数则组件状态由外部控制或由内部控制会触发`onChange`回调。



## 3 结束
这就是此次所要说的所有，如有任何问题可直接联系我。如果觉得东西很烂可以直接指出。如果对此组件感兴趣可以去[github](https://github.com/food-billboard/React-Component-Calendar)上给一个star✨，如果觉得文章内容对你有用，可以给一个赞👍或一个评论📚。
