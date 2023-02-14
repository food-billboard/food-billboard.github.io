---
title: mongodb操作实例
date: 2021-10-26 15:22:52
tags: 
  - mongodb
  - 数据库  
  - node
banner_img: /images/mongodb操作实例/background.jpg  
index_img: /images/mongodb操作实例/background.jpg   
categories:
  - 后端  
---

## 介绍  
这是`mongodb`的第二篇文章，本文包含了一些在平时自己开发过程当中使用的一些操作符以及特殊情况，希望对各位有帮助😺 。  

## 正文  

### $filter 
- 用于从已有数据对象中的数组中筛选出符合条件的数据项  

- 假设有如下集合名称为`users`的数据:  
```js
  [
    {
      students: [
        {
          name: "Join",
          age: 10
        },
        {
          name: "Lisa",
          age: 19
        },
        {
          name: "Jack",
          age: 17
        }
      ]
    }
  ]
```
- 筛选出年龄大于`18`的学生  
```js
  db.users.aggregate([
    {
      $project: {
        student_gt_18: {
          $filter: {
            input: "$students",
            as: "student",
            cond: {
              $gt: [ "$$student.age", 18 ]
            }
          }
        }
      }
    }
  ])
```
- 你将会得到
```js
  [
    {
      student_gt_18: [
        {
          name: "Lisa",
          age: 19
        }
      ]
    }
  ]
```

`$filter`有三个参数:  
1. `input`  
元数据中的某一字段(如`students`)  
2. `as` 
`students`的遍历项名称(如`student`)
3. `cond`  
筛选条件，可以在其中使用遍历项的值(如`$$student.age`，得到了当前项的`age`)   

### $map  
- 用于遍历已有数据对象中的数组中并解析成新的数组   
其实这个和上面的`$filter`在语义上与`javascript`的同名方法的功能是一致的，这样的话应该会很好理解了👍 。

- 假设有如下集合名称为`users`的数据:  
```js
  [
    {
      students: [
        {
          name: "Join",
          age: 10
        },
        {
          name: "Lisa",
          age: 19
        }
      ]
    }
  ]
```
- 将学生`name`和`age`字段拼接生成新的字段`description`   
```js
  db.users.aggregate([
    {
      $project: {
        new_students: {
          $map: {
            input: "$students",
            as: "student",
            in: {
              description: {
                $concat: [ "$$student.name", "-", "$$student.age" ]
              }
            }
          }
        }
      }
    }
  ])
```
- 你将会得到
```js
  [
    {
      new_students: [
        {
          description: "Join-10",
        },
        {
          description: "Lisa-19",
        }
      ]
    }
  ]
```

`$map`有三个参数:  
1. `input`  
元数据中的某一字段(如`students`)  
2. `as` 
`students`的遍历项名称(如`student`)
3. `in`  
将会生成的数据字段，`key`为字段名称，`value`为字段值，可以在其中使用遍历项的值(如`$$student.age`，得到了当前项的`age`)  
甚至可以在其中对一些数组进行`$filter`操作，这是被允许的。   

### $lookup  
- 复杂多表联查  
这个应该在平常开发中用到的频率非常的高，用于将嵌套的集合进行查询  
想象一下可能你的`users`集合中保存着`teacher`的字段，值为另一个`teachers`集合的`id`，此时就需要用到`$lookup`来进行查询  

**$lookup有两种查询形式**  
#### 简单查询  
这种适合只查询一层的情况，比如上面说的`teachers`集合中不存在当前查询所需要再次联表查询的字段  
听着有些别扭，看下面的例子  

- 假设有如下集合名称为`users`和`teachers`的数据: 

```js
  // users 
  [
    {
      id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: "custom_teacher_id_001"
    }
  ]

  // teachers 
  [
    {
      id: "custom_teacher_id_001",
      name: "Lisa",
      age: 40
    }
  ]
```

- 查询`students`集合并同时查询出其中的`teacher`数据  

```js
  db.users.aggregate([
    {
      $lookup: {
        from: 'teachers',
        localField: 'teacher',
        foreignField: 'id',
        as: 'teacher_data'
      }
    },
    {
      $project: {
        id: 1,
        name: 1,
        age: 1,
        teacher_data: 1
      }
    }
  ])
```

- 你将会得到  

```js
  [
    {
      id: "custom_student_id_001",
      name: "Join",
      age: 18,
      // 注意这里
      teacher_data: [
        {
          id: "custom_teacher_id_001",
          name: "Lisa",
          age: 40
        }
      ]
    }
  ]
```

注意看上面的查询出来的数据的`teacher_data`字段，它是一个数组。通过`$lookup`查询的结果都会变成一个数组。  
如果不想是数组，可以通过`$unwind`来进行拆分，有关`$unwind`可在后文看到。  

简单查询包含四个参数：  
1. `from`  
要查询的目标集合名称  
2. `localField`  
当前集合中需要进行查询的字段名称  
3. `foreignField`  
两个集合所关联起来的字段名称，上面是`id`  
4. `as`  
查询结果保存的字段名称，你可以使用原始字段名称进行覆盖，也可以新增一个  

#### 复杂查询   
通过上面的例子应该可以理解刚刚的那句话了吧，复杂查询可以把那些嵌套关联了多层的数据查询出来  
还是看下面的例子🌰  

- 假设有如下集合名称为`users`和`teachers`以及`schools`的数据: 

```js
  // users 
  [
    {
      id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: "custom_teacher_id_001"
    }
  ]

  // teachers 
  [
    {
      id: "custom_teacher_id_001",
      name: "Lisa",
      age: 40,
      school: "custom_school_id_001"
    }
  ]

  // schools 
  [
    {
      id: "custom_school_id_001",
      name: "high school",
    }
  ]
```

- 查询`students`集合并同时查询出其中的`teacher`数据以及`school`数据  
此时通过简单得查询已经无法满足要求  

```js
  db.users.aggregate([
    {
      $lookup: {
        from: 'teachers', 
        let: {
          teacher_id: "$teacher"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  "$id", "$$teacher_id"
                ]
              }
            }
          },
          {
            $lookup: {
              from: 'schools',
              as: 'school_data',
              foreignField: "id",
              localField: "school"
            }
          },
          {
            $project: {
              id: 1,
              name: 1,
              school: 1,
              age: 1,
              school_data: "$school_data"
            }
          }
        ],
        as: 'teacher_data'
      }
    },
    {
      $project: {
        id: 1,
        name: 1,
        age: 1,
        teacher_data: 1
      }
    }
  ])
```

- 你将会得到  

```js
  [
    {
      id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher_data: [
        {
          id: "custom_teacher_id_001",
          name: "Lisa",
          age: 40,
          school_data: [
            {
              id: "custom_school_id_001",
              name: "high school",
            }
          ]
        }
      ]
    }
  ]
```

复杂查询也是四个参数:  
1. `from`  
与简单查询相同  
2. `as`  
与简单查询相同  
3. `let`  
在当前查询层定义的变量可以在本次查询中使用，比如上面定义的`teacher_id`，用于在下层查询时做筛选条件判断  
4. `pipeline`  
下层查询操作，顾名思义，管道操作，值是一个数组，当中可以使用与外层相同的查询操作，可以访问到上层`let`中定义的变量，使用`$$`前缀  

- 应该有注意到上面在`pipeline`第一项是`$match`，为什么要这样操作？  
当使用复杂查询时，需要自己来定义筛选条件，否则它将会把集合当中的所有数据全部返回  

- `$match` 表示的是筛选条件  
以及其中若使用到`let`定义的变量时，需要使用`$expr`操作符，具体的我还没有了解过😊 。  
还有一点需要注意的是，当要做比较的值得类型是`mongodb`自带的`ObjectId`类型时，相等判断条件需要使用`$eq`操作符，否则永远返回`false`    

- 注意:
- `pipeline` 中使用 `$match` 匹配 `let`中定义的字段时，需要在外面包一个 `$expr`, 否则无法匹配  
`$match: { $expr: { _id: "$$customFields" } }`  
- 如果要在`$match`中匹配`ObjectId`, 需要使用`$eq`, 直接比较似乎无效,原因有待查证. `$expr: { $eq: [ "$_id", "$$customFields" ] }`   

- ps  
这是我另外碰到的一个例子🌰  
需要判断某个值是否在数组中存在，此时可以使用`$in`操作符进行判断  
第一个参数是需要判断的值，第二个参数是查询的数组  
```js
  // 简单描述一下
  {
    let: {
      teacher_id: "$teacher"
    },
    pipeline: [
      {
        $match: {
          $expr: {
            "$in": [ "$name", ["Lisa"] ]
          }
        }
      }
    ]
  }
```

### $unwind  

根据指定的数组字段进行拆分成多项  
它也有两种形式  

#### 简单形式  

- 假设有如下集合名称为`users`的数据: 

```js
  // users 
  [
    {
      id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: [
        "custom_teacher_id_001",
        "custom_teacher_id_002"
      ]
    }
  ]
```

- 查询`users`数据并将`teacher`字段进行拆分    

```js
  db.users.aggregate([
    {
      $unwind: "$teacher"
    }
  ])
```

- 你将会得到  

```js
  [
    {
      _id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: "custom_teacher_id_001"
    },
    {
      _id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: "custom_teacher_id_002"
    }
  ]
```

`teacher`为拆分的字段，需要添加`$`前缀  
这种简单的写法适合那种字段规整的情况，当需要做异常处理时，这种情况就不适用了。  

#### 复杂形式  
- 假设有如下集合名称为`users`的数据: 

```js
  // users 
  [
    {
      id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: [
        "custom_teacher_id_001",
        "custom_teacher_id_002"
      ]
    },
    {
      id: "custom_student_id_002",
      name: "Lisa",
      age: 20,
    }
  ]
```

- 查询`users`数据并将`teacher`字段进行拆分，并设置当`teacher`不存在时继续保留    

```js
  db.users.aggregate([
    {
      $unwind: {
        path: "$teacher",
        preserveNullAndEmptyArrays: true 
      }
    }
  ])
```

- 你将会得到

```js
  [
    {
      _id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: "custom_teacher_id_001"
    },
    {
      _id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: "custom_teacher_id_002"
    },
    {
      _id: "custom_student_id_002",
      name: "Lisa",
      age: 20,
    }
  ]
```

如上可以看到，当`teacher`不存在时，保留了对应的字段，如果设置`preserveNullAndEmptyArrays`时，第三条数据将不被查询到。  

复杂形式有三个参数：
1. `path`  
同简单形式  
2. `preserveNullAndEmptyArrays`  
是否保留空数组  
3. `includeArrayIndex`  
暂时没有用到过，再说。  

### $addToSet   
这个方法在前面的[mongodb常用操作符文章中介绍过](https://food-billboard.github.io/2020/10/18/mongodb%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C%E7%AC%A6/)介绍过，但是那是添加一项，有时候我们需要同时添加多个项。  

- 假设有如下集合名称为`users`的数据: 

```js
  // users 
  [
    {
      id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: [
        "custom_teacher_id_001",
      ]
    },
  ]
```

- 向`name`为`Join`的数据字段添加两个`teacher`项    

```js
  db.users.updateOne({
    name: "Join"
  }, {
    $addToSet: {
      teacher: {
        $each: [
          "custom_teacher_id_002",
          "custom_teacher_id_003"
        ]
      }
    }
  })
```

- 该字段会变成  

```js
  [
    {
      _id: "custom_student_id_001",
      name: "Join",
      age: 18,
      teacher: [
        "custom_teacher_id_001",
        "custom_teacher_id_002",
        "custom_teacher_id_003"
      ]
    },
  ]
```

配合`$each`添加多项，这个没啥好说的  

### $addFields  
- 向输出结果中新增字段  
这种的一般使用情况是对原始的一些数据字段做特殊处理，比如统计等。  

- 假设有如下集合名称为`users`的数据:  

```javascript  
  // users 
  [
    {
      id: "custom_student_id_001",
      name: "Join",
      age: 18,
      homework: [
        30,
        40
      ]
    }
  ]
```
    
- 查询`users`数据并添加新字段`total_homework`    
    

```javascript  
  db.users.aggregate([
    {
      $addFields: {
        total_homework: { 
          $sum: "$homework" 
        }
      }
    },
  ])
```

- 你将会得到

```js
  [
    {
      _id: "custom_student_id_001",
      name: "Join",
      age: 18,
      homework: [
        30,
        40
      ],
      total_homework: 70 
    },
  ]
```

### $push  
这个也是在[前一篇文章](https://food-billboard.github.io/2020/10/18/mongodb%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C%E7%AC%A6/)有介绍  

但是当需要同时添加多项时，可能会需要用到`$pushAll`操作符，但是在实际使用过程中，`$pushAll`会报错，所以这里还是使用`$push`  
至于使用方法，可以参考前面的`$addToSet`操作符。


## 结束  
以上就是本人在实际使用过程中碰到的一部分问题，以后如果有新的问题还会补充。如果有哪里错了欢迎指正😊 。