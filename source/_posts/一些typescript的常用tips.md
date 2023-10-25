---
title: 一些typescript的常用tips-着色器
date: 2023-10-25 09:36:00
tags: frontend
banner_img: /images/一些typescript的常用tips/background.jpg
index_img: /images/一些typescript的常用tips/background.jpg
categories: 
  - 前端   
  - CSS
---

# 一些typescript的常用tips

## 命名空间

```typescript
declare namespace API {
  export type User = {
    username: string 
  }
}
```

## 文件后缀名扩展
```typescript
  declare module '*.css'

  declare module '*.svg' {
    export function ReactComponent(
      props: React.SVGProps<SVGSVGElement>,
    ): React.ReactElement;
    const url: string;
    export default url;
  }
```

## React的useCallback参数类型
```typescript
  declare namespace React {
    // useCallback parameters are implicitly typed to any.
    // This override has the effect of forcing you to write types any parameters you want to use.
    // See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52873
    function useCallback<T extends (...args: any[]) => any>(
      callback: T,
      deps: readonly any[],
    ): T;
  }
```

## SuperPartial

## 结束

  持续更新。。。
  结束🔚。  