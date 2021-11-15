---
title: mongodb常用操作符
date: 2020-10-18 16:13:52
tags: 
 - database
 - mongodb
banner_img: /images/mongodb常用操作符/mongodb-cover-page.png
index_img: /images/mongodb常用操作符/mongodb-cover-page.png  
categories:
  - 数据库  
  - mongodb
  - node
  - 后端  
---

## MongoDB操作符

### MongoDB介绍
`MongoDB` 是由`C++`语言编写的，是一个基于分布式文件存储的开源数据库系统。  
在高负载的情况下，添加更多的节点，可以保证服务器性能。  
`MongoDB` 旨在为WEB应用提供可扩展的高性能数据存储解决方案。  
`MongoDB` 将数据存储为一个文档，数据结构由键值(`key=>value`)`对组成。MongoDB` 文档类似于 `JSON` 对象。字段值可以包含其他文档，数组及文档数组。 
如下这种结构
<img src="/images/mongodb常用操作符/mongodb-cover-page.png" />

### MongoDB命令行简单操作

假设存在数据库名称为`database`  
并且存在一个集合为`collection`  
集中`collection`中有如下数据
```javascript
[
  {
    "name": "Daniel",
    "age": 24,
    "job": "it",
    "hobby": "travel"
  },
  {
    "name": "Mike",
    "age": 18,
    "job": "student",
    "hobby": "travel"
  }
]
```

- 创建数据库或使用数据库
`use database`

- 删除数据库
`db.dropDatabase()`

- 查看数据库列表
`show dbs`

- 创建集合
执行`use`操作后  
`db.collection.opertion`
没有创建集合的语法，直接对指定集合进行操作就会创建该集合  

- 查看当前数据库的集合列表
`show collections`

- 删除集合
`db.collection.drop()`

- 查找
1. 执行`find`命令
`db.collection.find({ hobby: "travel" })`
得到以下结果
<img src="/images/mongodb常用操作符/find-common.png"  />

`find`命令会找到符合查询条件的所有结果  
可以在后面跟上`.pretty()`来让数据展示更美观。 
后面跟`.count()`返回查找到的数量  
后面跟`.sort()`返回排序后的数据  
比如这样`db.collection.find({ hobby: "travel" }).sort({ age: 1 })`，`1`表示升序，`2`降序

2. 执行`findOne`命令  
`db.collection.findOne({ hobby: "travel" })`  
<img src="/images/mongodb常用操作符/findOne.png"  />
`findOne`只会找到符合条件的第一条  

- 删除
1. 执行`deleteOne`命令  
`db.collection.deleteOne({ hobby: "travel" })`  
得到以下结果
<img src="/images/mongodb常用操作符/deleteOne.png"  />
`deleteOne`命令会删除符合查询条件的第一条数据

2. 执行`deleteMany`命令  
`db.collection.deleteMany({ hobby: "travel" })`  
`deleteMany`命令会删除符合查询条件的所有数据

- 插入
1. 执行`insertOne`命令  
`db.collection.insertOne({ "name": "Rick", "age": 32, "job": "teacher", "hobby": "sport" })`  
`insertOne`命令可以添加一条数据到集合中  
他有一个可选参数`{ writeConcern }`，写入策略，默认为 1，即要求确认写操作，0 是不要求。  
<img src="/images/mongodb常用操作符/insertOne.png"  />

2. 执行`insertMany`命令  
```javascript
db.collection.insertMany([
  {
    "name": "Jack",
    "age": 12,
    "job": "student",
    "hobby": "watch tv"
  },
  {
    "name": "Mary",
    "age": 8,
    "job": "student",
    "hobby": "book"
  }
])
```
`insertMany`允许同时插入多条数据到集合中  
他有一个可选参数`{ writeConcern, ordered }`，writeConcern意义同上，orderd表示是否按顺序写入，默认 true，按顺序写入。  

- 更新
1. 执行`updateOne`命令
`db.collection.updateOne({ "name": "Mike" }, { $set: { "age": 20 } })`
`updateOne`命令可以更新匹配条件的第一条数据
<img src="/images/mongodb常用操作符/updateOne.png"  />

2. 执行`updateMany`命令
`db.collection.updateMany({ "hobby": "travel" }, { "hobby": "watch tv" })`
`updateMany`命令可以更新匹配条件的所有数据

还有几个可选参数，可自行百度

### MongoDB操作符

接下来介绍的是`MongoDB`中一些常用的操作符，暂时将操作符分为更新和查找两类。

#### 更新操作符  
 ##### $inc  
  对一个字段增加指定数量，且字段的值类型为数字  
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      "$inc": { age: 100 }
    })
  ```
  当然可以通过指定数字值为`负数`实现递减操作。  
  <img src="/images/mongodb常用操作符/$inc.png"  />

 ##### $set  
  这是相当常见的操作符，表示设置指定的`key`
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      "$set": { age: 1000 }
    })
  ```
  上述将`name`为`Mike`的字段的`age`字段设置为`1000`  
  如果`key`不存在的话则创建  
  当然也可以同时设置多个值，但是需要注意的是如果修改的值之前是一个对象或一个数组的话会整个覆盖掉该值。具体的修改方法可以参照下方的具体实例。  
  <img src="/images/mongodb常用操作符/$set.png"  />

  ##### $unset  
  将某一个字段删除  
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      "$unset": { "hobby": "" }
    })
  ```
  上述将`name`为`Mike`的字段的`hobby`字段删除，如果不存在该字段则不进行操作  
  <img src="/images/mongodb常用操作符/$unset.png"  />

  ##### $push  
  对某一字段进行内容追加，只能对数组字段进行操作(否则会报错)，不存在则直接设置为`空数组`并添加  
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      "$push": { "like": "book" }
    })
  ```
  上述将`name`为`Mike`的字段的`like`字段设置为`[ "book" ]`
  <img src="/images/mongodb常用操作符/$push.png"  />

  ##### $pushAll  
  类似上面的`$push`操作符，但是接收的值时一个`数组`，表示可同时追加多个值，同样是对数组字段进行操作  
  ```javascript
    db.collection.updateOne({
      "name": "Jack"
    }, {
      "$pushAll": { "like": [ "tv", "sport" ] }
    })
  ```
  上述紧接前面的操作，向`like`字段中继续追加了`tv`和`sport`  
  不过似乎在高版本`mongodb`已经取消了这个操作符，有待考证。

  ##### $addToSet  
  类似上面的`$pushAll`操作符，不同的是，当且仅当该值在字段中`不存在`时添加，相当于是自动做了去重。  
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      "$addToSet": { "like": [ "tv", "hamberger" ] }
    })
  ```
  继续上面的`like`添加数据，因为上面添加过`tv`字段，所以再次添加被忽略  
  当然此操作符添加的值不一定是数组，也可以这样  
  `$addToSet: { "like": "hamberger" }`  
  <img src="/images/mongodb常用操作符/$addToSet.png"  />

  ##### $pop  
  与`$pop`操作符相反，表示删除指定字段的第一个或最后一个值，同样只能是数组  
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      "$pop": { "like": 1 }
    })
  ```
  上述表示删除`like`字段的最后一个值。  
  `1`表示最后一个值，`-1`表示第一个值  
  <img src="/images/mongodb常用操作符/$pop.png"  />

  ##### $pull  
  表示从某一字段中删除指定的值，针对数组  
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      "$pull": { "like": "hamberger" }
    })
  ```
  上述将`name`为`Mike`的字段的`like`数组中的`hamberger`字段删除  
  <img src="/images/mongodb常用操作符/$pull.png"  />

  ##### $pullAll  
  类似`$pull`操作符，不同的是可以同时删除多个值
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      "$pullAll": { "like": [ "hamberger", "book" ] }
    })
  ```
  上述删除了`name`为`Mike`字段的`like`中的`hamberger`和`book`  
  <img src="/images/mongodb常用操作符/$pullAll.png"  />

  ##### $rename  
  这个操作符表示对之前设置过的字段进行重命名，设置的是`key`
  ```javascript
    db.collection.updateOne({
      "name": "Mike"
    }, {
      $rename: { "like": "dislike" }
    })
  ```
  上述将`like`字段修改为了`dislike`名称。  
  <img src="/images/mongodb常用操作符/$rename.png"  />

#### 查找操作符  

  下面介绍的，是常用的查询操作符🌰  

  ##### $all  
  查找字段中包含指定内容的值，且需要包含全部指定的值，针对数组型字段  
  ```javascript
    db.collection.find({
      "like": { "$all": [ "hamberger", "book" ] }
    })
  ```
  上述能查找到`name`为`Mike`字段，但是无法查找到其他字段，因为他们无法完全满足查询条件。  
  <img src="/images/mongodb常用操作符/$all.png"  />

  ##### $gt  
  查找大于(great then)指定值的字段
  ```javascript
    db.collection.find({
      "age": { "$gt": 18 }
    })
  ```
  上述查找`age`大于`18`的字段，不包含`18`  
  `日期`也可直接那这个进行比较  
  <img src="/images/mongodb常用操作符/$gt.png"  />

  ##### $gte  
  表示不小于指定值，也就是大于等于  
  ```javascript
    db.collection.find({
      "age": { "$gte": 20 }
    })
  ```
  上述查找`age`不小于`20`的字段，所以包括等于`20`的字段  
  <img src="/images/mongodb常用操作符/$gte.png"  />

  ##### $lt  
  与上面的`$gt`操作符相反，表示小于(less then)指定值  
  ```javascript
    db.collection.find({
      "age": { "$lt": 20 }
    })
  ```
  上述查找`age`小于`20`的字段，且不包含`20`  
  <img src="/images/mongodb常用操作符/$lt.png"  />

  ##### $lte  
  表示不大于指定值，也就是小于等于  
  ```javascript
    db.collection.find({
      "name": { "$lte": 18 }
    })
  ```
  上述查找`age`小于`18`的字段，且包含`18`  
  <img src="/images/mongodb常用操作符/$lte.png"  />

  ##### $in  
  查找存在指定数组中值得项，与`$all`不同的是，字段只需要满足其中任意一项即可  
  ```javascript
    db.collection.find({
      "age": { "$in": [ 18, 20 ] }
    })
  ```
  上述可以找到所有在`age`字段等于`18`或`20`的数据  
  <img src="/images/mongodb常用操作符/$in.png"  />

  ##### $nin  
  与上面的`$in`操作符相反，表示查找不存在指定数组中的值的项
  ```javascript
    db.collection.find({
      "like": { "$nin": [ "tv" ] }
    })
  ```
  上述查找`like`字段中不存在`tv`的项  
  <img src="/images/mongodb常用操作符/$nin.png"  />

  ##### $ne  
  有相等就会有不相等，这个操作符就是查找不等于指定值得项，相当于只有一项的`$nin`
  ```javascript
    db.collection.find({
      "like": { "$ne": "book" }
    })
  ```
  上述查找`like`字段中不存在`book`的项  
  <img src="/images/mongodb常用操作符/$ne.png"  />

  ##### $and  
  查找同时满足所有指定条件的项，并且至少需要包含**两个**条件
  ```javascript
    db.collection.find({
      "$and": [
        {
          "name": "Mike"
        },
        {
          "age": 18
        }
      ]
    })
  ```
  上述查找`name`为`Mike`并且`age`为`20`的字段  
  <img src="/images/mongodb常用操作符/$and.png"  />

  ##### $nor  
  与上面的`$and`相反，表示查找同时不满足所有指定条件的项，同样至少需要包含**两个**条件  
  ```javascript
    db.collection.find({
      "$nor": [
        {
          "name": "Mike"
        },
        {
          "age": 18
        }
      ]
    })
  ```
  上述查找`name`不为`Mike`并且`age`不等于`18`的数据  
  <img src="/images/mongodb常用操作符/$nor.png"  />

  ##### $not  
  指定不能满足指定条件的数据项，此操作符只能包含**一个**条件，而且它无法单独完成查询，需要与其他操作符配合一起使用。  
  ```javascript
    db.collection.find({
      "age": {
        "$not": { "$gt": 18 }
      }
    })
  ```
  上述查找`age`字段小于等于`18`的数据项，当然像例子这样的情况也可以直接使用`$lte`操作符完成。  
  <img src="/images/mongodb常用操作符/$not.png"  />

  ##### $or  
  表示查找能至少满足**一个**条件的项，并且需要至少包含**两个**筛选条件  
  ```javascript
    db.collection.find({
      "$or": [
        {
          "name": "Mike"
        },
        {
          "age": 20
        }
      ]
    })
  ```
  上述表示查找`name`为`Mike`或者`age`为`20`的数据项  
  <img src="/images/mongodb常用操作符/$or.png"  />

  ##### $exists  
  此操作符用于字段的`key`的判断，表示查找是否存在否字段`key`的数据项，可选值为`true`和`false`，选择**true**表示存在，**false**则不存在指定字段的项  
  ```javascript
    db.collection.find({
      "name": { "$exists": true }
    })
  ```
  上述查找存在`name`字段的数据项  
  <img src="/images/mongodb常用操作符/$exists.png"  />

  ##### $mod  
  表示查找满足计算结果的数据项，此操作符为取模  
  ```javascript
    db.collection.find({
      "age": { "$mod": [ 3, 0 ] }
    })
  ```
  上述表示`age`字段的值对3取模等于0的值。  
  <img src="/images/mongodb常用操作符/$mod.png"  />

  ##### $type  
  表示选择指定数据类型的数据项  
  ```javascript
    db.collection.find({
      "name": { "$type": "string" }
    })
  ```
  上述查找`name`字段值类型为`string`的数据项
  此操作符表示能查找对应的数据类型的数据项，它也有对应的代码，如下所示
  > Double: 1
  String
  Object	3	 
  Array	4	 
  Binary data	5	 
  Undefined	6	已废弃。
  Object id	7	 
  Boolean	8	 
  Date	9	 
  Null	10	 
  Regular Expression	11	 
  JavaScript	13	 
  Symbol	14	 
  JavaScript (with scope)	15	 
  32-bit integer	16	 
  Timestamp	17	 
  64-bit integer	18	 
  Min key	255	Query with -1.
  Max key	127	 
  <img src="/images/mongodb常用操作符/$type.png"  />

  ##### $regex  
  就是字面意思，使用正则表达式来匹配字段
  ```javascript
    db.collection.find({
      "name": { "$regex": /mike/, "$options": "i" }
    })
  ```
  上述匹配`name`字段值包含`mike`（不区分大小写是因为配置了`$options`）的数据项  
  `$options`表示正则表达式的修饰符，其他的还有`i`(不区分大小写),`g`(全局匹配),`m`(多行匹配),`s`(.包含换行符`\n`)  
  当然直接使用正则表达式也是可以的。  
  <img src="/images/mongodb常用操作符/$regex.png"  />

  ##### $where  
  有些情况下普通方法很难做出筛选，可以使用此操作符用`javascript`语法来进行筛选  
  ```javascript
    db.collection.find({
      "$where": "this.name='Jack'&&this.like.some(key => key == 'hamberger')"
    })
  ```
  上述查找`name`为`Jack`且`like`字段包含`hamberger`值得数据项  
  它甚至可以直接写一个函数`{ function() { return this.name == 'Jack' && this.like.some(key => key == 'hamberger') } }`  
  **注意**  
  虽然这种方法可以有效的解决一些问题，但是还是尽量不要使用这个操作符，因为它会将MongoDB里面保存的BSON数据变为JavaScript的语法结构，这样的方式不方便使用数据库的索引机制。  
  <img src="/images/mongodb常用操作符/$where.png"  />

  ##### $elemMatch  
  此操作符用于对类似一个嵌套数组对象来进行多条件的查询  
  <img src="/images/mongodb常用操作符/$elemMatch.png"  />
  上述查找了`like`字段数组中`type`为`eat`并且`target`为`hamberger`的数据项  

  ##### $slice  
  将数据中的数组字段做切割，选出一段选区  
  ```javascript 
    // 基本查询
    db.collection.find({}, {
      like: {
        $slice: [1, 1]
      }
    })
    //聚合查询
    db.collection.aggregate([
      {
        $project: {
          like: {
            $slice: [ "$like", 1, 1 ]
          }
        }
      }
    ])
  ```
  以上两种方法都能取出对应的数组项的第一条，两个数字分别代表：起始的索引、切割的数量  
  - 基本查询
  <img src="/images/mongodb常用操作符/$slice-normal.jpg"  />  
  - 聚合查询  
  <img src="/images/mongodb常用操作符/$slice-aggregate.jpg" />

### 相关实例

讲完了操作符，这里简单讲几个之前在实践当中碰到的一些问题，以及解决方法，欢迎各位参考。  

  ##### 查找或修改数组中嵌套的对象的属性  
假设`database`的`collection`中存在以下数据  
```javascript
[
  {
    "name": "Mike",
    "age": 18,
    "job": "student",
    "like": [
      {
        "type": "eat",
        "target": "hamberger"
      },
      {
        "type": "sport",
        "target": "running"
      }
    ]
  },
  {
    "name": "Jack",
    "age": 50,
    "job": "teacher",
    "like": [
      {
        "type": "eat",
        "target": "vegetable"
      },
      {
        "type": "sport",
        "target": "baseball"
      }
    ]
  }
]
```
普通情况下无法直接选中对应数组对象的属性，但是`mongodb`中支持`.`来选择数组对象中的属性  
- `parent_field.child_field` 
比如像上面的`like`字段选择`target=vegetable`  
`db.collection.find({ "like.target": "vegetable" })`
 <img src="/images/mongodb常用操作符/数组对象嵌套查询.png"  />

  ##### 修改多层嵌套的数组对象  
有时候不止会有一层嵌套，多层嵌套上面的方法不适用，虽然这种存储方式不太常见，但是也可以解决  
假设有如下的数据
```javascript
[
  {
    "name": "Jack",
    "like": [
      {
        type: "eat",
        target: [
          {
            name: "hamberger",
            price: 100
          },
          { 
            name: "salad",
            price: 200
          }
        ]
      }
    ]
  }
]

//执行更新操作
db.collection.updateOne({ name: "Jack" }, { $set: { "like.$[stepone].target.$[steptwo].price" : 200 } }, {
 arrayFilters: [
  {
   "stepone": {
    "$type": "object"
   },
   "stepone.type": "eat" 
  },
  {
   "steptwo": {
    "$type": "object"
   }
  }
 ]
})
```
上述操作是选择上面数据中`like`字段的`type`为`eat`并且`target`数组中的`name`为`hamberger`的价格`price`改成了200  
`updateOne`的第三个参数用户定义第二参数中用到的嵌套名称的筛选条件，并且它的名称定义为**以小写字母开头的字母数字字符串**  

### 结束
`MongoDB`的操作符以及命令远不止这些，有兴趣的可以自行去MongoDB官网查找学习，本人也会在后续的实践学习中继续更新。😸
