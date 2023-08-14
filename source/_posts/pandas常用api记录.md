---
title: pandas常用api记录
date: 2023-08-07 17:31:00
tags: trade 
banner_img: /images/pandas常用api记录/background.png
index_img: /images/pandas常用api记录/background.png
categories: 
  - 交易 
---

# pandas常用api记录  

本文简单记录一下学习[pandas](https://github.com/pandas-dev/pandas)的`api`。  

## 开始

### 变量

```python
import pandas as pd
import numpy as np

# 普通数组
normal_array = [1, 2, 3, np.nan, 19]
# 对象
normal_obj = {
    "name": ['Daniel', 'Sam', 'Jack', 'Mike'],
    "age": [4, 5, 6, 8],
    "job": ['it', 'clean', 'cook', 'it']
}
# numpy 数组
numpy_array = np.array([
    ['Daniel', 4, 'it'], 
    ["Sam", 5, 'clean'], 
    ['Jack', 6, 'cook'],
    ['Mike', 8, 'it']
])
# 普通series
series = pd.Series(normal_array)
# 自定义索引的series
series_index = pd.Series(normal_array, index=[1, 2, 3, 4, 5])
# 普通的DataFrame
data_frame = pd.DataFrame(normal_obj)
# 自定义索引的DataFrame
data_frame_index = pd.DataFrame(normal_obj, index=[1, 2, 3, 4])
# numpy的DataFrame
numpy_frame_index = pd.DataFrame(numpy_array, columns=["name", "age", "job"])
```

<img src="/images/pandas常用api记录/变量.jpg" />

> 下面的代码都使用这里的几个变量。  

### 取值

```python
import pandas as pd
import numpy as np

# 取值
# 取name 列
print(data_frame['name'])

# 取 0、1 行
print(data_frame[0:2])

# 取 age > 4 的行
print(data_frame[data_frame['age'] > 4])

# 取 name 和 job 列的数据 (显式索引)
print(data_frame.loc[:, ['name', 'job']])

# 隐式索引
print(data_frame.iloc[0:2])

# 第一行的 job
print(data_frame.at[1, 'job'])
```

<img src="/images/pandas常用api记录/取值.jpg" />

### 统计

```python
import pandas as pd
import numpy as np

# 统计
print(data_frame['age'].mean())

print(data_frame.groupby('job')['age'].mean())

# 统计 总数、均值、标准差、最小值、最大值等等
print(data_frame.describe())
```

<img src="/images/pandas常用api记录/统计.jpg" />

### 增删改查

```python
import pandas as pd
import numpy as np

# 修改 增删改查
# 增
data_frame['hobby'] = ['baseball', 'scoreball', 'pingpang', 'basketball']
print(data_frame)

# 删
data_frame.drop("hobby", axis=1, inplace=True)
print(data_frame)

# 改
data_frame.loc[1, 'age'] = 100
print(data_frame)

# 查
print(data_frame[data_frame['age'] < 8])
```

<img src="/images/pandas常用api记录/增删改查.jpg" />

## 结束  
  大概就这些，剩下有空的话接着补充。  

  参考链接  
> [跟我一起从零开始学python（九）numpy+pandas+matplotlib](https://juejin.cn/post/7257059518630625341)  