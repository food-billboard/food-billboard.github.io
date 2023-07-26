---
title: numpy常用api记录
date: 2022-09-12 17:50:00
tags: trade 
banner_img: /images/一创聚宽学习/background.jpg
index_img: /images/一创聚宽学习/background.jpg
categories: 
  - 交易 
---

# numpy常用api记录  

本文简单记录一下学习[numpy](https://github.com/numpy/numpy)的`api`。  

> numpy.array([1, 2, 3], dtype=numpy.int8) 

## 开始

### 类型  

#### 整数

> int8、uint8、int16、uint16、int32、uint32、int64、uint64

#### 浮点数  

> float16、float32、float64、float128  

#### 复数  

> complex64、complex128、complex256  

#### 字符串  

> string 

#### 日期  

> datetime64、timedelta64  

`np.array(['2022-01-01 22:22:22'], dtype=np.datetime64)`  

### 数组

```python 
import numpy as np  

array1 = np.array([1, 2, 3, 4])  

# 指定数组深度
array2 = np.array([[1, 2, 3], [4, 5, 6]], ndmin=2) 

# [1, 2]
array1[0:2]

# [2, 3, 4]
array1[1:]

# [2, 4]
# 从索引1开始，隔一个值，一直到最后
array1[1::2]

```

### 计算 

#### 算数运算  
```python 
import numpy as np 

array1 = np.array([1, 2, 3, 4])
array2 = np.array(5, 6, 7, 8) 

# 加减乘除
# [6, 8, 10, 12]
np.add(array1, array2)
# [-4, -4, -4, -4]
np.subtract(array1, array2)
# [5, 12, 21, 32]
np.multiply(array1, array2)
# [1/5, 2 / 6, 3 / 7, 4 / 8]  
np.divide(array1, array2)

# 幂  
# [1, 4, 9, 16]
np.power(array1, 2)

# 整除  
# [0, 0, 1, 0]
np.mod(array1, 2)

# 余数
# [1, 0, 1, 0]
np.remainder(array1, 2)

# 绝对值
# [1, 2, 3, 4]
np.abs(array1)

```

##### 统计函数

```python
import numpy as np 

array1 = np.array([1, 2, 3, 4])

# 平均值
np.mean(array1)

# 标准差计算  
np.std(array1)

# 方差  
np.var(array1)

# 求和
np.sum(array1)

# 求乘积  
np.prod(array1)

# 最大值 最小值
# 4
np.max(array1) 
# 1
np.min(array1) 


```

> 标准差是啥  
> 

> 方差是啥  

### 随机数  

## 结束  
  大概就这些，剩下有空的话接着补充。  

  参考链接  
> [跟我一起从零开始学python（九）numpy+pandas+matplotlib](https://juejin.cn/post/7257059518630625341)  