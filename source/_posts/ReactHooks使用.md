---
title: ReactHooks使用
date: 2023-05-25 21:11:00
tags: frontend React 
banner_img: /images/ReactHooks使用/background.png
index_img: /images/ReactHooks使用/background.png
categories: 
  - 前端 
---

## 介绍 
  自`16.8`版本后，出现`hooks`的概念，`react`组件的开发发生了非常大的变化。  
  使用过`hooks`的人相信都不会再回到`class`了。  
  本文将介绍`React`的各个`hooks`的一些简单使用`demo`。  

## 开始
这里介绍的是当前`react18`版本的相关`hooks`的简单使用。  
包括  
> useState、useReducer、useEffect、useLayoutEffect、useRef、useImperativeHandle、useCallback、useMemo、useContext、useId、useInsertionEffect、useTransition、useDeferredValue、useDebugValue、useSyncExternalStore

### useState 
  组件`state`，和`class`组件的`state`一样  
```js
import { useState } from 'react' 

const App = () => {
  // 第一个值是state的值，第二个值是修改state的方法
  // 参数是state的初始值，也可以像下面这样支持回调的形式
  const [ current, setCurrent ] = useState(0)
  const [ callbackCurrent, setCallbackCurrent ] = useState(() => Math.ceil(Math.random() * 100))

  const handleClick = (type) => {
    switch(type) {
      case 'normal':
        // 直接传参改就行
        setCurrent(current + 1)
      case 'callback':
        // 回调形式是把上一个值当做参数，回调的返回值即是新的state 
        setCurrent(prev => prev + 1)
    }
  }

  return (
    <div>
      <button onClick={() => handleClick('normal')}>current ++</button>
      <button onClick={() => handleClick('callback')}>current callback ++</button>
    </div>
  )
}

```

> 回调和直接传值的区别是，直接传值可能会有更新合并的情况，而回调不会出现合并。  
> 并且回调的形式在某些`hooks`中不想将`state`作为依赖项时，可以使用回调来避免在依赖项中添加`state`  

### useReducer  
  类似于`useState`的状态管理，但是它能避免像`state`状态过多，分散的问题。  
  比如  
```js
import { useState } from 'react'

const App = () => {
  // 多个状态难于管理  
  const [ username, setUsername ] = useState('name')
  const [ email, setEmail ] = useState('email')
  const [ password, setPassword ] = useState('password')

  return (
    <div>
      {username}
      {email}
      {password}
    </div>
  )
}
```
此时可以使用`useReducer`代替`useState`  
```js
import { useReducer } from 'react'

// state 为 对应的值  
// action 为 下面dispatch传递的参数，用于识别相应的操作  
// 返回值是新的state值  
function reducer(state, action) {
  switch(action.type) {
    case 'increase':
      return {
        ...state,
        count: state.count + 1
      }
    case 'decrease':
      return {
        ...state,
        count: state.count - 1
      }
  }
  return state 
}

// 初始值
const initialState = {
  count: 0,
  key: 'key'
}

const App = () => {
  // 第一个参数是 处理state 更新的回调
  // 第二个参数 初始值state  
  // 第三个可选参数，用于处理默认初始值的回调，参数为上面第二个参数，比如像下面的回调这样处理
  /*
    // 初始值会新增一个extraValue属性  
    function init(initialState) {
      return {
        ...initialState,
        extraValue: 0
      }
    }
  */
  const [ state, dispatch ] = useReducer(reducer, initialState)
  const { count } = state 

  const handleClick = () => {
    // 触发count + 1
    dispatch({ type: 'increase' })
  }

  return (
    <div onClick={handleClick}>
      {count}
    </div>
  )
}
```

### useEffect 
  副作用  
  简单来说就是根据依赖项的改变来触发对应的回调。  
```js
import { useEffect, useState } from 'react'

const App = () => {

  const [ current, setCurrent ] = useState(0)

  // 初始化时会自动触发一次回调
  // 之后会在每次依赖项发生变化时，触发回调
  useEffect(() => {
    console.log(`current is changed: ${current}`)
  }, [current])

  // 不传第二个参数依赖项时，则表示每一次刷新都会触发回调
  useEffect(() => {
    console.log('每一次渲染都会调用')
  })

  // 传递空的第二参数时，则只有在初始化的时候会触发一次
  useEffect(() => {
    console.log('只会在初始化的时候调用一次')
  }, [])

  // 回调是支持函数作为返回值的，默认会在每一次调用回调前触发
  // 当然初始化时不会触发
  // 最后组件卸载的时候也会触发一次 相当于是class 的 componentWillUnmount 
  // 比如下面这个useEffect，假设current 从 0 改变成 1 
  // 那么日志从初始化开始显示的内容就是如下的顺序
  /*
    current is changed: 0
    
    current is changed prev: 0
    current is changed: 1
  */
  // 相当于就是拿上一次调用回调，返回的那个函数在下一次触发前执行
  // 所以返回的那个回调拿到的是上一次的 state 
  useEffect(() => {
    console.log(`current is changed: ${current}`)
    return () => {
      console.log(`current is changed prev: ${current}`)
    }
  }, [current])

  return (
    <div onClick={() => setCurrent(prev => prev + 1)}>
      set current state 
    </div>
  )

}
```

`useEffect`可以做很多事情，比如  
  - 可以在此处调用接口获取数据  
  - 绑定事件  
  - 清除定时器  
  等等  

### useLayoutEffect  
  类似于`useEffect`  
  不同之处在于  
> useEffect 是**异步**的，组件会先`render`一次，不会阻塞渲染  
> useLayoutEffect 是**同步**的，相当于`class`的`componentDidMount`  

所以不要把一些费时的逻辑放到`useLayoutEffect`中  
或者如果需要在渲染前对`dom`进行修改，可在此`hook`中进行  

```js
import { useLayoutEffect } from 'react'

const App = () => {

  const [ current, setCurrent ] = useState(0)

  useLayoutEffect(() => {
    // 初始化时，模拟数据改变
    // 如果是使用useEffect，会发现有一个current从0到一个随机数的跳闪的过程  
    // 使用此hook则不会发生这样的情况，因为他会先改变了值之后才render  
    if(current == 0) {
      setCurrent(Math.random())
    }
  }, [current])

  return (
    <div>
      {current}
    </div>
  )

}
```

### useRef  
  引用值，相当于是一个改变值不会触发刷新的值  

  借用ahooks中的一个自定义`hook`(`useGetState`)  
```js
  import { useRef, useState, useCallback, useEffect } from 'react'

  function useGetState(initial) {
    const [ value, setValue ] = useState(initial)

    // 创建一个 ref，初始值为value 
    const valueRef = useRef(value)
    // 每次value 更新就赋值到ref 
    // 赋值是赋值在ref.current上
    valueRef.current = value 

    // 暂时忽略useCallback
    // 相当于就是一个函数返回了ref
    const getValue = useCallback(() => valueRef.current)

    return [
      value,
      setValue,
      getValue
    ]

  }

  function App() {
    const [ current, setCurrent, getCurrent ] = useGetValue(0)
    const [ another, setAnother ] = useState(0)

    useEffect(() => {
      console.log(`我可以在不添加依赖项的同时，拿到current的最新值：${getCurrent()}`)
    }, [another])

    return (
      <div onClick={() => setAnother(prev + 1)}>
        {current}
      </div>
    )
  }

```

也可以配合`useImperativeHandle`和`forwardRef`使用，具体例子可以看下面的`useImperativeHandle`  

### useImperativeHandle  
  自定义暴露`ref`所暴露的属性  

  我们都知道，函数组件是没有办法直接通过`ref`来获取到实例的。  
  但是我们可以通过`forwardRef`来包裹组件来达到获取到对应组件的实例。  

```js
import { useRef, useImperativeHandle, forwardRef, useState } from 'react'

// 通过forwardRef包裹组件
// 组件会新增第二参数ref
// 可以将ref直接赋值到当前组件下的element上，也可以达到属性传递的效果（比如将ref绑定到input上，则外部组件可以通过ref调用input组件上的一些方法，比如focus、click）
const Child = forwardRef((props, ref) => {

  const [ value, setValue ] = useState(0)

  // 将ref作为useImperativeHandle的第一参数，简单理解就是把新增的属性绑定到ref上 
  // 第二参数是一个回调，返回值是一个对象，用于自定义暴露给外面能访问的属性  
  // 第三参数是一个依赖项，表示当依赖项里的值发生改变时，重新调用第二参数的回调来刷新暴露的值  
  useImperativeHandle(ref, () => {
    return {
      value
    }
  }, [value])

  return (
    <div onClick={() => setValue(prev => prev + 1)} >set value: {value}</div>
  )

})

const App = () => {
  const ref = useRef()

  const handleClick = () => {
    console.log(`当前子组件的ref状态值是: ${ref.current}`)
  }

  return (
    <div>
      <div onClick={handleClick}>获取子组件的状态</div>
      <Child ref={ref} />
    </div>
  )

}

```

### useCallback  
  缓存**函数**。  
  依赖项不改变的情况下，`re-render`不会重复创建。  
```js
import { useCallback, useEffect } from 'react'

function App() {

  const doSomething = useCallback(() => {

  }, [])

  useEffect(() => {
    // 只有当doSomething发生改变时，才会重新调用该方法
    doSomething()
  }, [doSomething])

  return (
    <div>useCallback demo</div>
  )

}
```

### useMemo 
  缓存**值**。  
  与`useCallback`功能类似，但是缓存的是值。  
```js
import { useMemo } from 'react'

function App(props) {

  const { value } = props 

  // 只有value改变时，才会重新计算
  // 当存在很复杂的计算逻辑时，可以通过useMemo来缓存计算结果，避免重复计算   
  const cacheValue = useMemo(() => {
    return value + 1
  }, [value])

  return (
    <div>useMemo demo</div>
  )

}
``` 

### useContext 
  全局状态控制。  
  平时可能碰到过跨层级的状态传递或者兄弟间的状态传递的情况，比如下面这样  
```js
import { useState } from 'react'

const GrandFather = () => {
  const [ state, setState ] = useState(0)
  return (
    <Parent state={state} />
  )
}

const Parent = (props) => {

  const { state } = props 
  const [ broState, setBroState ] = useState(0)

  return (
    <>
      <Son state={state} broState={broState} />
      <Brother setBroState={setBroState} />
    </>
  )

}

const Son = (props) => {
  const { state, broState } = props 
  return (
    <div>{state}{broState}</div>
  )
}

const Brother = (props) => {

  const { setBroState } = props 

  return (
    <div></div>
  )
}

```

  - `Son`组件需要`GrandFather`的`state`属性，只能通过`Parent`组件向下传递，但是`Parent`组件完全不需要依赖`state`属性。  
  - `Son`组件需要来自其兄弟组件`Brother`的属性`broState`，也只能通过将状态设置在`Parent`组件上来进行传递。  

  此时可以使用`useContext`创建全局的状态，用于在各个地方进行状态共享。  
  一般配合`createContext`来进行使用。  

```js
import { useContext, createContext } from 'react'

// 创建全局的状态
const Context = createContext()

const GrandFather = () => {
  const [ state, setState ] = useState(0)
  const [ broState, setBroState ] = useState(0)

  // 包裹最外层组件
  return (
    <Context.Provider
      value={{
        state,
        broState
      }}
    >
      {/*这里就不再需要状态透传了*/}
      {/*<Parent state={state} />*/}
      <Parent />
    </Context.Provider>
  )
}

const Parent = (props) => {

  // 无须无用状态
  // const { state } = props 
  // const [ broState, setBroState ] = useState(0)

  return (
    <>
      <Son />
      <Brother />
    </>
  )

}

const Son = (props) => {
  // 使用useContext接收全局的状态
  const { state, broState } = useContext(Context) 

  return (
    <div>{state}{broState}</div>
  )
}

const Brother = (props) => {

  return (
    <div></div>
  )
}

```

> 需要注意的是，`Context`中的任何一个属性的改变，都会导致子组件的重新渲染，包括那些本身并不依赖该属性的使用useContext的组件，这在大型项目中会造成性能的问题，所以使用时还需斟酌。  
> 可以使用`github`上的解决方案来避免该问题（[use-context-selector](https://github.com/dai-shi/use-context-selector)）。  

### useId 
  - 简单来说就是为了让**服务端**和**客户端**生成的`id`保持一致。  
  - 或者说可以保证在一个组件中使用一个随机`id`，而组件多次渲染，保证组件的`id`的唯一性。  

  具体的描述可以查看这篇[文章](https://juejin.cn/post/7034691251165200398)。  

```js
import { useId } from 'react'

const RandomIdComp = () => {
  const id = useId()
  return (
    <div>{id}</div>
  )
}

const App = () => {
  return (
    <div>
      {/*两次生成的id是不一样的*/}
      <RandomIdComp />
      <RandomIdComp />
    </div>
  )
}
```

### useInsertionEffect  
  类似于`useEffect`和`useLayoutEffect`的`hook`  
  它的执行时机比`useLayoutEffect`更早，它执行时，`Dom`还未更新。  

  它的唯一作用就是解决`CSS-in-JS`在渲染中注入样式的性能问题。  
```js
import { useInsertionEffect } from 'react'

const App = () => {

  useInsertionEffect(()=>{
     /* 动态创建 style 标签插入到 head 中 */
     const style = document.createElement('style')
     style.innerHTML = `
       .css-in-js{
         color: red;
         font-size: 20px;
       }
     `
     document.head.appendChild(style)
  },[])

  return <div className="css-in-js">useInsertionEffect </div>
}

```

### useTransition  
  帮助`state`更新，不会阻塞渲染。  
  当出现有那种耗性能的更新时，通过`useTransition`包裹更新任务，它会为更新创建过渡状态`isPending`，提升用户体验。  

  比如在这样一个场景  
  用户在百度搜索的时候，输入框在输入的同时，也会同时根据输入内容**调用接口**查询数据。  
  网络请求本身就是一个费时的行为，如果同时页面还有其他的行为，可能会**阻塞渲染**，体验不好。  
  此时可以通过`useTransition`延迟更新状态（`React`本身有自己的一套更新规则，会把一些更新列表划分优先级）。 

```js
import { useTransition, useState, useCallback } from 'react'

const dataSource = new Array(1000).fill(0).map(item => Math.random())

const List = (props) => {
  const { value, isPending } = props 

  const [ searchResult, setSearchResult ] = useState([])

  // 根据延迟状态进行数据筛选
  // 模拟网络请求
  useEffect(() => {
    setSearchResult(dataSource.filter(item => Math.random() > 0.7))
  }, [value])

  return (
    <div>
      <div>当前值（{value}）</div>
      <div>isPending?{isPending.toString()}</div>
      {
        searchResult.map((item, index) => {
          return (
            <div key={item}>{index + 1}: {item}</div>
          )
        })
      }
    </div>
  )
}

const App = function () {
  
  const [ value, setValue ] = useState()
  // 第一个值 是否处于pending 
  // 第二个值 将更新通过此函数包裹达到对应的过渡效果
  const [isPending, startTransition] = useTransition()

  const onChange = useCallback((e) => {
    // 包裹更新状态
    startTransition(() => {
      setValue(e.target.value)
    })
  }, [])

  return (
    <div>
      {/*当用户输入内容时，改变value*/}
      <input value={value} onChange={onChange} />
      {/*筛选列表依赖了 延迟状态*/}
      <List value={value} isPending={isPending} />
    </div>
  )
};
```

### useDeferredValue 
  一个可以允许延迟更新的`state`值。  
  相当于就是使用上面的`useTransition`做了一个简单的封装  

  接着使用上面的`useTransition`的`demo`做一下简单修改  

```js
import { useDeferredValue, useState } from 'react'

const dataSource = new Array(1000).fill(0).map(item => Math.random())

const List = (props) => {
  const { value } = props 

  const [ searchResult, setSearchResult ] = useState([])
  const [ dealCount, setDealCount ] = useState(0)

  // 根据延迟状态进行数据筛选
  // 模拟网络请求
  useEffect(() => {
    setDealCount(prev => prev + 1)
    setSearchResult(dataSource.filter(item => Math.random() > 0.7))
  }, [value])

  return (
    <div>
      <div>我执行了{dealCount}次</div>
      <div>当前值（{value}）</div>
      {
        searchResult.map((item, index) => {
          return (
            <div key={item}>{index + 1}: {item}</div>
          )
        })
      }
    </div>
  )
}

const App = function () {
  
  const [ value, setValue ] = useState()
  // 将 value 作为一个 延迟状态
  const deferredValue = useDeferredValue(value)

  return (
    <div>
      {/*当用户输入内容时，改变value*/}
      <input value={value} onChange={e => setValue(e.target.value)} />
      {/*筛选列表依赖了 延迟状态*/}
      <List value={deferredValue} />
    </div>
  )
};

```

实际在浏览器运行上面的代码时，可能看不出啥，但是当修改`cpu`性能时，就能明显发现下方列表的展示出现**卡顿**，但是没有影响到上面输入框的**用户输入**行为。  

<img src="/images/ReactHooks使用/useDeferredValue-cpu.png" />

可能你会发现他和**防抖**的效果类似，但是正如上面所说，本身执行上面的`demo`并没有发现什么异样，这就是他和**防抖**的区别。  
> 防抖是不管计算机性能好坏，都会延迟更新。  
> `useDeferredValue`会自动根据计算机性能调整`state`更新的优先级。  

### useDebugValue 
  顾名思义是一个偏向于调试性的`hook`，它一般使用于`React`开发者工具中，在编码自定义`hook`时，用于实时观察状态的变化。  

```js
import { useState, useDebugValue } from 'react'

function useDebug() {

  const [ value, setValue ] = useState(0)

  // 接收两个参数
  // 第一个是观察状态的值
  // 第二个用于对观察的状态展示进行一个格式化，参数即为对应的状态
  useDebugValue(value, (value) => {
    const realValue = parseInt(value)
    if(Number.isNaN(realValue)) return '不是数字'
    return realValue % 2 === 0 ? '偶数' : '奇数'
  })

  return [
    value,
    setValue 
  ]

}

function App() {

  // 使用hook 
  const [ value, setValue ] = useDebug()
  
  return (
    <div onClick={() => setValue(prev => prev + 1)}>
      set current value: {value}
    </div>
  )

}
```

<img src="/images/ReactHooks使用/useDebugValue.jpg" />  

从图上可以看出，上面的`hook`(`useDebug`)已经被开发者工具接收到。  
注意上面的名称是`Debug`，因为它会自动将`useDebug`的前缀`use`当做是`hook`的标志，如果`hook`不是以`use`开头，那么他就是`hook`的全名（比如`usDebug`名称就是`usDebug`）。    

### useSyncExternalStore 
  简单来说主要服务于第三方库。  
  快速接入外部的数据源，比如`redux`、`zustand等。  
  并且他的功能也远不止于此（以后再探究吧）。  

```js
import React, { useSyncExternalStore, useState, useEffect } from 'react@18';

let store = {
  name: 'Daniel',
  age: 20
}
let listeners = []

function reducer(type) {
  switch(type) {
    case 'INCREASE':
      store.age ++
      break 
    case 'DECREASE':
      store.age --
      break
    default:
  }
  console.log(store.age)
  listeners.forEach(listener => listener())
}

// 订阅函数
// 参数是一个callback 用于数据发生变化时调用触发
// 返回回调用于清理订阅函数  
// 比如下面的用于清理调指定的callback
function subscribe(callback) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter(item => item != callback)
  }
}

// 返回最新的 state 状态
// 并且是不可变的值
function getSnapshot() {
  return store.age 
}

function getServerSnapshot() {

}

const App = function () {

  // subscribe 表示订阅函数，当数据发生变化时，触发此函数
  // getSnapshot 用于对数据发生变化时，返回对应新的 state状态
  // getServerSnapshot 则是用于在 ssr 模式下 的 getSnapshot(有待研究)
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <div onClick={() => reducer(Math.random() > 0.5 ? 'INCREASE' : 'DECREASE')}>
      {store.name}:{state}
    </div>
  )
};
```

## 结束
  以上就是当前版本所有`hooks`的使用`demo`，如有错误欢迎指正。  

> 参考  
  [useEffect 和 useLayoutEffect](https://juejin.cn/post/7080170967233724447)  
  [useReducer就是useState的升级版](https://juejin.cn/post/6844904105278701581)  
  [useDeferredValue 与 debounce](https://juejin.cn/post/7126533788896591886)  
  [useDeferredValue 与 debounce](https://juejin.cn/post/7126533788896591886)  
  [useDeferredValue-example](https://github.com/joakimsjo/useDeferredValue-example)  
  [为了生成唯一id，React18专门引入了新Hook：useId](https://juejin.cn/post/7034691251165200398)  
  [「React 进阶」 React 全部 Hooks 使用大全 （包含 React v18 版本 ）](https://juejin.cn/post/7118937685653192735)  
  [React Concurrent 模式抢先预览下篇: useTransition 的平行世界](https://juejin.cn/post/6844903986420514823)  
  [React useSyncExternalStore 一览](https://juejin.cn/post/7213744681392783417)  