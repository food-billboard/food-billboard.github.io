---
title: Chai
date: 2020-08-28 22:16:08
tags: 
 - Chai
 - BDD
 - expect
 - test
---
## Chai介绍
Chai 是一个针对 Node.js 和浏览器的行为驱动测试和测试驱动测试的诊断库，可与任何 JavaScript 测试框架集成。
本文介绍的Chai下的expect/should风格属于BDD(行为驱动开发)
因为本身语法相对简单，所以本文是类似于api的中文文档，其中有许多不足，见谅。

## 正片开始

- `to`
- `be`
- `been`
- `is`
- `that`
- `which`
- `and`
- `has`
- `have`
- `with`
- `at`
- `of`
- `same`
以上仅做语义化用，无实际作用

### 具体api介绍

<span id="top"></span>

- [not](#not)
对之后的断言取反
- [deep](#deep)
针对对象、数组等进行深层次的键值对判断
- [any](#any)
与`keys`一同使用时表示至少满足一项
- [all](#all)
与keys一同使用时表示至少全部满足
- [a | an](#a)
既可做链式调用也可做断言
- [include | contains](#include)
是否包含指定的值 既可做链式调用也可做断言
- [nested](#nested)
用于在`property`、`include`等用`.`语法获取深层次属性
- [ok](#ok)
真值
- [true](#true) 
true
- [false](#false) 
false
- [null](#null)
null
- [undefined](#undefined) 
undefined
- [NaN](#NaN) 
NaN
- [exist](#exist) 
非null 非undefined
- [finite](#finite) 
非`NaN` 非`Infinity`
- [empty](#empty)
判断值长度为`0 [] '' {}`
- [arguments](#arguments)
是否为arguments对象
- [equal](#equal)
`===`
- [eql](#eql)
相当于`deep`和`equal`的简写
- [above](#above) 
大于
- [least](#least)
大于等于
- [below](#below)
小于
- [most](#most)
小于等于
- [within](#within)
区间内(数字)
- [instanceof](#instanceof)
是否为该实例
- [property](#property)
是否拥有指定属性
- [ownProperty](#ownProperty)
是否拥有自身的属性
- [ownPropertyDescriptor](#ownPropertyDescriptor)
属性描述对象
- [length](#lengthOf)
length属性
- [lengthOf](#lengthOf)
是否为指定长度值
- [match](#match)
是否匹配指定正则
- [string](#string)
是否包含指定字符串
- [keys](#keys)
配合其他字段使用，是否包含或不包含指定的key
- [throw](#throw) 
是否抛出指定错误或字符串或匹配指定错误信息
- [respondTo](#respondTo)
断言是否会响应一个方法
- [itself](#itself) 
配合`respondTo`用来判断是否为自身的方法
- [satisfy](#satisfy)
返回一个函数且参数为目标值且返回值为`boolean`，用来指定是否通过检测
- [closeTo](#closeTo)
判断值是否在期望值接收范围内
- [members](#members)
类似于`contains`、`include`，但是能接收数组，主语只能是数组
- [oneOf](#oneOf)
判断值是否出现在指定数组中 
- [change](#change)
判断方法是否会改变指定对象的指定属性的值 
- [increase](#increase)
判断方法是否会增加指定对象的属性的值
- [decrease](#decrease)
判断方法是否会减少指定对象的属性的值
- [extensible](#extensible)
判断指定值是否可扩展(可以添加新属性)
- [sealed](#sealed)
判断指定值是否封闭(不可添加新属性、不可删除旧属性、可修改旧属性)
- [frozen](#frozen)
判断值是否冻结(不可添加新属性、不可删除旧属性、不可修改旧属性)
- [own](#own)
判断值是否拥有指定的属性，不包含上层属性
- [by](#by)
配合`descrease` 或 `increase`、 `change`等来判断断言值是否发生变化在指定范围内
- [fail](#fail)
判断是否会失败
- [ordered](#ordered)
配合`members`用于指定`members`参数数组的顺序与主语数组的顺序一致

<span id="not"></span>

**.not** 
对之后的断言取反
```js
  expect({a: 1}).to.not.equal({ a: 1 })
  expect({ a: 1 }).to.be.not.have.a.keys('b')
  expect([100, 200]).to.be.not.lengthOf(3)
  expect([1, 2]).to.be.length.not.within(-1, 1)
```
[顶](#top)

<span id="deep"></span>

**.deep** 
普通的对象或数组比较是比较它们的整体是否相等。
比如
```js
  expect({ a: 1 }).to.be.not.equal({ a: 1 })
  expect([1, 2]).to.be.not.equal([1, 2])
  expect({ a: 1 }).to.be.deep.equal({ a: 1 })
  expect([1, 2]).to.be.deep.equal([1, 2])
  expect({ a: { b: { c: 3 } } }).to.be.deep.equal({ a: { b: { c: 3 } } })
  expect({ a: { b: 2 } }).to.have.nested.deep.property('a.b')
```
相当于是严格相等 `===`
[顶](#top)

<span id="any"></span>

**.any**
与`keys`使用时至少满足一项
```js
  expect([100, 200]).to.have.any.keys(0)
  expect({ a: 100, b: 200 }).to.have.any.keys('a', 'b')
```
[顶](#top)

<span id="all"></span>

**.all**
与`any`类似，但是至少满足所有项
```js
  expect([100, 200]).to.has.all.keys(0, 1)
  expect([100, 200]).to.not.has.all.keys(0)
  expect({ a: 100, b: 200 }).to.has.all.keys('a', 'b')
  expect({ a: 1, b: 2, c: 3 }).to.not.has.all.keys('a', 'b')
```
需要注意的是，如上最后一条断言所示，当`all`和`keys`一同使用时，断言对象的`key`必须和`keys`完全一样才能通过
[顶](#top)

<span id="a"></span>

**.a .an**
既可以用做链式判断也可用于断言
用作判断时无实际作用，仅用于语义化
用做断言时用于判断值是否为某一类型
方法`type a = (type: 'string' | 'object' | 'null' | 'undefined' | 'array' | 'number' | 'symbol' | 'error' | 'promise'/*还有别的类型...*/, errmsg?: string) => any`
```js
  expect(100).to.be.a('number')
  expect({ a: 100 }).to.has.a.property('a')
  expect(Symbol()).to.be.a('symbol')
  expect(new Error()).to.be.a('error')
  //自定义类型
  const object = {
    [Symbol.toStringTag]: 'diyObj'
  }
  expect(object).to.be.a('diyObj')
  //继续断言
  expect(100).to.be.a('number').and.to.equal(100)
  //自定义错误信息
  expect(100).to.be.a('number', 'it is not impossible')
```
- 可用于自定义类型进行判断，如上使用`Symbol.toStringTag`进行自定义类型定义
- 由`a`和`an`断言会返回断言的值，可以继续做链式调用继续做其他判断
- `a`和`an` 有可选的第二参数可以指定出错时的错误信息
[顶](#top)

<span id="include"></span>

**.include .contains**
用于判断断言值是否包含某个指定的值，但是只能指定一个值
`includes` 、 `contains` `contain` 同义
既可以用做链式判断也可用于断言
方法 `type include = (value: any, errmsg?: string) => any`
```js
  //字符串包含
  expect('Daniel').to.be.include('iel')
  //数组
  expect([1, 2]).to.be.a('array').and.include(1)
  //严格相等
  expect([1, '2']).to.not.be.include(2)
  //对象
  expect({ a: 1, b: 2 }).to.be.include({ a: 1 })
  //map值包含
  expect(new Map([[1, 2], [3, 4]])).to.be.include(2)
  //set值包含
  expect(new Set([1, 2, 3])).to.be.include(3)
  //深层次严格相等
  expect({ a: { b: 2 } }).to.be.not.include({ a: { b: 2 } })
  expect({ a: { b: 2 } }).to.be.deep.include({ a: { b: 2 } })
  expect({ a: { b: 2 } }).to.be.nested.deep.include({ 'a.b': 2 })
  //自定义断言错误信息
  expect([1, 2]).to.be.not.include(3, 'it is not impossible')
  //配合members链式调用
  expect([1, 2, 3]).to.be.include.members([1, 2])
  //配合keys
  expect({ a: 1, b: 2, c: 3 }).to.be.include.any.keys('a', 'b')
  expect({ a: 1, b: 2 }).to.be.include.all.keys('a', 'b')
  //对象可以获取上层属性
  Object.prototype.say = 'Daniel'
  expect({}).to.be.include({ say: 'Daniel' }).but.not.own.include({ say: 'Daniel' })
```
[顶](#top)

<span id="nested"></span>

**.nested**
用于在`property`、`include`等用`.`语法获取深层次属性
有时候对于深层次的对象或数组无法直接判断该内容，可以通过`nested`来实现深层次的值获取
```js
  //深层次嵌套获取
  expect({ a: { b: { c: 1 } } }).to.be.nested.have.a.property('a.b.c')
  //转义
  expect({ '.a': { '..b': { '[c]': 1 } } }).to.be.nested.have.a.property('\\.a.\\.\\.b.\\[c\\]')
```
[顶](#top)

<span id="ok"></span>

**.ok**
表示真值，如`true` `[]` `{}`等
```js
  expect([]).to.be.ok
  expect({}).to.be.ok
  //自定义错误信息
  expect(false, 'it is not impossible').to.be.not.ok
```
一般情况下不太需要使用此属性
关于其他象征性的值直接使用对应的属性就可以
```js
expect(0).to.be.equal(0)
expect(true).to.be.true
expect(null).to.be.null
expect(undefined).to.be.undefined
```
[顶](#top)

<span id="true"></span>

**.true**
同上表示真值，但不进行类型转换，所以只有`true`能通过
```js
  expect(true).to.be.true
```
[顶](#top)

<span id="false"></span>

**false**
与`true`相反，表示假值，不进行类型转换
```js
  expect(false).to.be.false
```
[顶](#top)

<span id="null"></span>

**.null**
用于判断值是否为`null`值
```js
  expect(false).to.be.false
```
[顶](#top)

<span id="undefined"></span>

**.undefined**
用于判断值是否为`undefined`值
```js
  expect(undefined).to.be.undefined
```
[顶](#top)

<span id="NaN"></span>

**.NaN**
用于判断值是否为`NaN`值
```js
  //不推荐使用这个方法比较字符串等，可以直接使用equal
  //expect('Daniel').to.be.NaN
  expect(100).to.be.not.NaN
```
[顶](#top)

<span id="exist"></span>

**.exist**
用于判断值是否存在，即非`null` 且 非`undefined`
```js
  expect(100).to.be.exist
  expect(null).to.be.not.exist
  expect([]).to.be.exist
  expect(undefined).to.be.not.exist
```
[顶](#top)

<span id="finite"></span>

**.finite**
表示有限数组，即非`NaN` 且 非`Infinity`
```js
  expect(200).to.be.finite
  expect(Infinity).to.be.not.finite
  expect('Daniel').to.be.not.finite
```
[顶](#top)

<span id="empty"></span>

**.empty**
判断值得长度是否为`0`
```js
  //字符串的长度
  expect('').to.be.empty
  //数组长度
  expect([]).to.be.empty
  //对象则是判断可枚举的属性的数量(Object.keys(obj).length)
  expect({}).to.be.empty
```
[顶](#top)

<span id="arguments"></span>

**.arguments**
判断值是否为`arguments`对象
```js
  expect(arguments).to.be.arguments
```
[顶](#top)

<span id="equal"></span>

**.equal**
判断值是否严格相等，相当于`===`
`type equal = (value: any, errmsg?: string) => any`
```js
  //比较值的相等
  expect(1).to.be.equal(1)
  //数组和对象则无法严格相等
  expect([1, 2, 3]).to.be.not.equal([1, 2, 3])
  //数组和对象比较可以用之前介绍的deep
  expect([1, 2, 3]).to.be.deep.equal([1, 2, 3])
  expect({ a: 1 }).to.be.deep.equal({ a: 1 })
  //自定义错误提示信息
  expect([1, 2]).to.be.not.equal([1, 2], 'it is not impossible')
```
[顶](#top)

<span id="eql"></span>

**.eql**
可以当做是`deep` 和 `equal`的组合
`type eql = (value: any, errmsg?: string) => any`
```js
  //数组对象等值内容相等
  expect([1, 2, 3]).to.be.eql([1, 2, 3])
  expect({ a: 1 }).to.be.eql({ a: 1 })
  //继续断言
  expect({ a: 1 }).to.be.eql({ a: 1 }).and.not.be.empty
```
- 如上所例🌰，eql返回值本身，可以继续向后做断言
[顶](#top)

<span id="above"></span>

**.above**
判断值是否`大于`指定值
`type above = (value: number, errmsg?: string) => any`
```js
  expect(100).to.be.above(10)
  expect(100).to.be.not.above(101)
```
- 对于字符串，数组等长度的比较建议直接使用`lengthOf`
[顶](#top)

<span id="least"></span>

**.least**
判断值是否`不小于（大于等于）`指定值
`type least = (value: number, errmsg?: string) => any`
```js
  expect(100).to.be.least(100)
  expect(100).to.be.least(99)
```
[顶](#top)

**.below**
判断值是否`小于`指定值
`type below = (value: number, errmsg?: string) => any`
```js
  expect(100).to.be.below(101)
  expect(100).to.be.not.below(99)
```
[顶](#top)

<span id="most"></span>

**.most**
判断值是否`不大于（小于等于）`指定值
`type most = (value: number, errmsg?: string) => any`
```js
  expect(100).to.be.most(100)
  expect(100).to.be.most(101)
```
[顶](#top)

<span id="within"></span>

**.within**
判断值是否在指定区间内
`type within = (start: number, end: number, errmsg?: string) => any`
```js
  //包含开始和结束
  expect(100).to.be.within(0, 100)
  expect('Daniel').to.have.a.lengthOf.within(0, 100)
  expect([1, 2, 3]).to.have.a.lengthOf.within(0, 100)
```
- 不推荐使用该方法，因为它能够实现的测试基本都可以通过`equal`或是`lengthOf`来实现
```js
  //使用equal和lengthOf实现测试
  expect(100).to.be.equal(100)
  expect('Daniel').to.have.a.lengthOf(6)
  expect([1, 2, 3]).to.have.a.lengthOf(3)
```
[顶](#top)

<span id="instanceof"></span>

**.instanceof**
判断值是否为指定值的实例
`type instanceof = (constructor: object, errmsg?: string) => any`
```js
  function Father() {}
  const father = new Father()
  expect(father).to.be.instanceof(Father)
  expect([]).to.be.instanceof(Array)
  expect(new Number(100)).to.be.instanceof(Number)
  expect(new String('Daniel')).to.be.instanceof(String)
```
[顶](#top)

<span id="property"></span>

**.property**
判断值是否包含指定属性
`type property = (key: string, value?: any, errmsg?: string) => any`
```js
  //简单判断是否拥有该属性
  expect({ a: 1 }).to.be.have.a.property('a')
  //并且判断是否为该值
  expect({ a: 1 }).to.be.have.a.property('a', 1)
  //针对深层次的值比较需要 deep 参与
  expect({ a: { b: 1 } }).to.be.not.have.a.property('a', { b: 1 })
  expect({ a: { b: 1 } }).to.be.have.a.deep.property('a', { b: 1 })
  //配合 own 用于判断是否为当前所有的实例实行
  expect({ a: 1 }).to.be.have.a.property('a')
  expect({ a: 1 }).to.be.have.a.property('toString')
  expect({ a: 1 }).to.be.have.a.own.property('a')
  expect({ a: 1 }).to.be.not.have.a.own.property('toString')
  //配合 nested 进行深层次的比较
  expect({ a: { b: 2 } }).to.be.have.nested.deep.property('a.b', 2)
```
[顶](#top)

<span id="own"></span>

**.own**
判断值是否拥有指定的属性，不包含上层属性
```js
  //结合property使用
  expect({ a: 1 }).to.be.have.own.property('a')
  expect({ a: 1 }).to.be.not.have.own.property('toString')
  //配合 deep 和 property进行深层次的比较
  expect({ a: { b: 2 } }).to.be.have.own.deep.property('a', { b: 2 })
```
[顶](#top)

<span id="ownProperty"></span>

**.ownProperty**
判断是否为本身属性，相当于是 `.own.property`的结合
`type ownProperty = (key: string, value?: any, errmsg?: string) => any`
```js
  expect({ a: 1 }).to.be.have.own.property('a')
  expect({ a: 1 }).to.be.have.ownProperty('a')
```
[顶](#top)

<span id="ownPropertyDescriptor"></span>

**.ownPropertyDescriptor**
类似于上面的方法，用于判断是否为本身的属性
但是它可以传递第二参数，表示该属性的描述对象，不知道什么是描述对象的自行百度
`type ownPropertyDescriptor = (key: string, value?: { get?: (undifiend || () => any)=undefined, set?: (undefined || () => any)=undefined, configurable?: boolean=false, enumerable?: boolean=false, value?: any=undefined, writable?: boolean=false }, errmsg?: string) => any`
```js
  const object = {
    name: 'Daniel'
  }
  const descriper = {
    //是否可枚举
    enumerable: true,
    //值
    //value: 'hello world',
    //是否可写
    //writable: false,
    //是否可修改描述符对象
    //注意如果设置为false，后续将无法再修改其描述对象
    configurable: true,
    //获取值拦截
    //设置了拦截就不能设置writable和value
    get() {
      return 'I love China'
    },
    //设置值拦截
    set() {
      return this.value
    }
  }
  Object.defineProperty(object, 'name', descriper)

  expect(object).to.be.ownPropertyDescriptor('name')
  expect(object).to.be.ownPropertyDescriptor('name', descriper)
  //自定义错误
  expect(object).to.be.ownPropertyDescriptor('name', descriper, 'it is impossible')
```
[顶](#top)

<span id="lengthOf"></span>

**.lengthOf .length**
判断值是否存在`length`属性且为指定值
方法 `type lengthOf = (value: number, errmsg?: string) => any`
```js
  expect([1, 2, 3]).to.be.lengthOf(3)
  //用于链式调用，但是不推荐
  expect([1, 2, 3]).to.have.a.lengthOf.below(1)
```
[顶](#top)

<span id="match"></span>

**.match**
判断值是否与指定`正则`匹配
和普通`match`方法一样，所以主语就是`string`
`matches`效果与`match`相同
`type match = (reg: Regexp, errmsg?: string) => any`
```js
  expect('Daniel').to.be.match(/^D.+l$/)
  expect('2020-08-10').to.be.match(/^\d{4}-\d{2}-\d{2}$/)
  expect('13456787654').to.be.match(/^1[^12]\d{9}$/)
```
[顶](#top)

<span id="string"></span>

**.string**
判断值是否包含指定的字符串
`type string = (value: string, errmsg?: string) => any`
```js
  expect('Daniel').to.be.have.a.string('iel')
  expect('hello').to.be.not.have.a.string('world')
  //必须是连续子串
  expect('world').to.be.not.have.a.string('rd')
```
[顶](#top)

<span id="keys"></span>

**.keys**
用于判断`数组`、`对象`、`Set`、`Map`等是否包含相应的`key`
`type keys = (...args: Array<string | number>) => any`
```js
  //普通使用需要将所有key全部传入
  expect({ a: 1 }).to.be.have.keys('a')
  expect([1, 2]).to.be.have.keys('0', '1')
  expect(new Set([1, 2])).to.be.have.keys(1, 2)
  expect(new Map([[ 'a', 1 ]])).to.be.have.keys('a')
  //配合all 和 any 使用
  expect({ a: 1, b: 2 }).to.be.have.any.keys('a')
  expect({ a: 1, b: 2 }).to.be.be.have.all.keys('a', 'b')
  //包含
  expect({ a: 1, b: 2, c: 3 }).to.be.include.keys('a', 'b')
  //深层次比较
  expect({ a: { b: { c: 3 } } }).to.be.have.deep.keys('a.b')
```
[顶](#top)

<span id="throw"></span>

**.throw**
判断值是否抛出指定的错误、错误信息等。
.throw(errConstructor | string | reg) 是否抛出指定错误或字符串或匹配指定错误信息
`type throw = (errorLike?: Error | Construcotr, errMsgMatcher?: string | Regexp, errmsg?: string) => any`
```js
  const errors = new TypeError('oops')
  function error() { throw errors }
  //当不确定会抛出哪一种错误时，直接不传参数
  expect(error).to.be.throw()
  //传递具体的错误类型
  expect(error).to.be.throw(TypeError)
  //传递错误实例
  expect(error).to.be.throw(errors, 'oops')
  //第二参数可为字符串，且表示为子串
  expect(error).to.be.throw(errors, 'oop')
  //也支持正则
  expect(error).to.be.throw(TypeError, /.+/)
  //可直接传递字符串表示抛出的错误内容
  expect(error).to.be.throw('oop')
  //同样支持正则
  expect(error).to.be.throw(/^o.+s$/)
  //断言后的主语更改为错误对象
  errors.code = 404
  expect(error).to.be.throw(errors).and.that.have.a.property('code', 404)
```
`throws` 和 `Throw`同义🙆
[顶](#top)

<span id="respondTo"></span>

**.respondTo**
用于判断一个对象或构造函数是否有相关的方法
`type respondTo = (methodName: string ,errmsg?: string) => any`
```js
  function Father() {}
  Father.prototype.sayFather = function() {}
  Father.saySon = function() {}
  //正常响应所有方法
  expect(new Father()).to.be.respondTo('sayFather')
  //实例无法获取超集静态属性
  expect(new Father()).to.be.not.respondTo('saySon')
  expect({}).to.be.respondTo('toString')
  //添加itself只能响应自身的方法
  expect(Father).to.be.itself.respondTo('saySon').but.not.respondTo('sayFather')
```
`respondsTo`与此方法同义
[顶](#top)

<span id="itself"></span>

**.itself**
配合上述的`respondTo`方法判断值是否响应指定的方法，但是为自身的方法，不包含`prototype`上的方法
具体事例可以看上面的`respondTo`
[顶](#top)

<span id="satisfy"></span>

**.satisfy**
接收一个函数作为参数，函数参数为断言目标值，返回值为boolean，判断是否通过断言  
- `type satisfy = (method: (target: any) => boolean, errmsg?: string) => any`  
```js
  //目标值在[0, 100]内
  expect(100).to.be.satisfy(function(target) {
    return target >= 0 && target <= 100
  })
  expect(100).to.be.satisfies(function(target) {
    return target >= 0 && target <= 100
  })
```
`satisfies`与此方法同义
[顶](#top)

<span id="closeTo"></span>

**.closeTo**
指定值（仅`数字`）是否在期望值的接收范围内
此方法与`within`的区别就是within接收的两个参数是上限和下限
`closeTo`的参数，第一参数为期望的中间值，第二参数为上下限（第一参数加减第二参数）
- `type closeTo = (expected: number, delta: number, errmsg?: string) => any`
```js
  //指定值在[-90, 110]之间
  expect(100).to.be.closeTo(10, 100)
  //包含临界值
  expect(110).to.be.closeTo(10, 100)
  expect(-90).to.be.closeTo(10, 100)
```
虽然此方法可以用于判断值是否在一个区间内，但是直接使用`equal`进行相等判断一样可以
[顶](#top)

<span id="members"></span>

**.members**
类似于contains、include，但是接收参数为数组，主语只能是数组
`type members = (target: Array<any>, errmsg?: string) => any`
```js
  //主语必须为数组
  expect([1, 2, 3]).to.be.have.members([1, 2, 3])
  //非简单类型数组需配合deep
  expect([ { a: 1 } ]).to.be.have.deep.members([ { a: 1 } ])
  //配合orderd来强制数组顺序与主语一致
  expect([ 1, 2, 3 ]).to.be.have.ordered.members([ 1, 2, 3 ])
  //配合include链式调用可以对不必要的数组项不进行验证
  expect([1, 2, 3]).to.be.include.members([ 1, 2 ])
  //相对于验证不存在的数组项推荐使用include
  expect([1]).to.be.not.include(2).and.not.include(3)
  //复合使用
  expect([ { a: 1 }, { b: 2 }, { c: 3 } ]).to.be.include.deep.ordered.members([ { a: 1 }, { b: 2 } ])
```
[顶](#top)

<span id="oneOf"></span>

**.oneOf**
判断值是否出现在指定数组中 
`type oneOf = (list: Array<any>, errmsg?: string) => any`
```js
  //断言值在指定数组中
  expect(100).to.be.oneOf([1, 2, 100])
  //推荐直接使用equal
  expect(100).to.be.equal(100)
```
[顶](#top)

<span id="change"></span>

**.change**
判断方法是否会改变指定的值，主语接收的是一个改变判定对象的值的方法
可以把它当做是`increase`和`decrease`的结合
但是推荐直接使用上述两个方法
`type change = (value: ((value: any) => any) | any, prop?: string, errmsg?: string) => any`
```js
  //普通值
  let number = 0
  let string = '0'
  let array = [ 0 ]
  let object = { 0: 0 }
  function changeNumber() { number ++ }
  function changeString() { string += 1 }
  function changeArray() { array[0] = 1 }
  function changeObject() { object[0] += 1 }

  function getNumber() { return number }
  function getString() { return string }

  //普通值需要借助函数
  //数字
  expect(changeNumber).to.be.change(getNumber)
  //字符串
  expect(changeString).to.be.change(getString)
  //复合值则需添加第二参数，改变的属性名
  //数组
  expect(changeArray).to.be.change(array, '0')
  //对象
  expect(changeObject).to.be.change(object, '0')

  //结合by具体断言改变的范围
  expect(changeNumber).to.be.change(getNumber).by(1)
```
[顶](#top)

<span id="increase"></span>
<span id="decrease"></span>

**.increase | .decrease**
`increase` 判断方法是否会增加指定对象的属性或者普通值的值
`decrease` 判断方法是否会减少指定对象的属性或者普通值的值
`const increase = (value: any, prop?: string, errmsg?: string)`
`const decrease = (value: any, prop?: string, errmsg?: string)`
并且只能是数组
```js
  //普通值
  let number = 0
  function increase() { number ++ }
  function decrease() { number -- }
  function get() { return number }
  expect(increase).to.be.increase(get)
  expect(decrease).to.be.decrease(get)

  //对象
  let obj = { a: 1 }
  function objIncrease() { obj.a ++ }
  function objDecrease() { obj.a -- }
  expect(objIncrease).to.be.increase(obj, 'a')
  expect(objDecrease).to.be.decrease(obj, 'a')

  //数组
  let arr = [1, 2, 3]
  function arrayIncrease() { arr[0] += 2 }
  function arrayDecrease() { arr[0] -= 2 }
  expect(arrayIncrease).to.be.increase(arr, '0').by(2)
  expect(arrayDecrease).to.be.decrease(arr, '0').by(2)

  //通过by判断增加的幅度
  expect(objIncrease).to.be.increase(obj, 'a').by(1)
  expect(objDecrease).to.be.decrease(obj, 'a').by(1)
```
[顶](#top)

<span id="extensible"></span>

**.extensible**
判断指定值是否可扩展(不可以添加新属性)
```js
  let object = {
    name: 'Daniel',
    sayName: function() {
      return this.name
    }
  }
  //设置对象为不可扩展
  Object.preventExtensions(object)
  //可修改
  console.log(object)
  object.name = 'Mike'
  console.log(object)
  //可删除
  console.log(object)
  delete object.name
  console.log(object)
  //不可新增
  console.log(object)
  object.age = 18
  console.log(object)

  //使用
  expect(object).to.be.extensible
```
[顶](#top)

<span id="sealed"></span>

**.sealed**
判断指定值是否封闭(不可添加新属性、不可删除旧属性、可修改旧属性)
```js
  let object = {
    name: 'Daniel',
    sayName: function() {
      return this.name
    }
  }
  //设置对象为封闭
  Object.seal(object)

  //不可新增
  console.log(object)
  object.age = 18
  console.log(object)

  //可修改
  console.log(object)
  object.name = 'Mike'
  console.log(object)

  //不可删除
  console.log(object)
  delete object.name
  console.log(object)

  //使用
  expect(object).to.be.sealed
```
[顶](#top)

<span id="frozen"></span>

**.frozen**
判断值是否冻结(不可添加新属性、不可删除旧属性、不可修改旧属性)
```js
  let object = {
    name: 'Daniel',
    sayName: function() {
      return this.name
    }
  }
  
  //设置对象为冻结
  Object.freeze(object)

  //不可新增
  console.log(object)
  object.age = 18
  console.log(object)

  //不可修改
  console.log(object)
  object.name = 'Mike'
  console.log(object)

  //不可删除
  console.log(object)
  delete object.name
  console.log(object)

  //使用
  expect(object).to.be.frozen
```
[顶](#top)

<span id="by"></span>

**.by**
配合`descrease` 或 `increase`、 `change`等来判断断言值是否发生变化在指定范围内
具体事例🌰可以直接查看上述三个方法的例子👆
[顶](#top)

<span id="fail"></span>

**.fail**
判断是否会失败
有两种参数传递方式
1. `type fail = (message?: string) => any`
2. `type fail = (actual: any, expected: any, message?: string, operator: string) => any`
```js
  //以下均会出错
  //直接使用
  expect.fail()
  expect.fail('it is error')
  //值判断
  expect.fail(1, 2, 'it is impossible')
  expect.fail(1, 2, 'it is impossible', '>')
```
[顶](#top)

<span id="ordered"></span>

**.ordered**
配合`members`用于指定`members`参数数组的顺序与主语数组的顺序一致
```js
  //members参数必须按顺序
  expect([1, 2, 3]).to.be.ordered.members([1, 2, 3])
  expect([1, 2, 3]).to.be.not.ordered.members([2, 1, 3])
```
[顶](#top)

## 完结
😊
如果有什么不对的地方，请指出。



