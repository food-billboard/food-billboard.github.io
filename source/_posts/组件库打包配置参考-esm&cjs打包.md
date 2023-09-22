---
title: 组件库打包配置参考-esm&cjs打包
date: 2023-09-19 17:18:00
tags: frontend
banner_img: /images/组件库打包配置参考/background.png
index_img: /images/组件库打包配置参考/background.png
categories:
  - 前端
  - 配置
---

# 组件库打包配置参考-esm&cjs打包

今天简单讲讲关于组件库打包的`esm`和`cjs`打包，这里拿[arco-design](https://arco.design/)的打包工具[arco-cli](https://github.com/arco-design/arco-cli/tree/1.x/packages/arco-scripts)的`1.0`版本来讲解。

因为代码用的是同一套，所以就一起讲，下面主要以`esm`的角度分析，`cjs`其实只是部分不同，各位可以酌情甄别一下🙏🏻。    

### 开始前

`arco-cli`使用的是[gulp](https://github.com/gulpjs/gulp)来组织任务执行的，他能极大的简化构建任务，生态也是及其的庞大，基本业务中的情况都能找到对应的插件。  
简单的一些知识可以看看[这里](https://food-billboard.github.io/2023/09/09/gulp相关知识/)。

## 开始

```js
const buildES = () => {
  return compileTS({ outDir: `${process.cwd()}/es`, type: 'es' });
}
```

接着看`compileTS`方法  
```js
export default (options) => {
  // BUILD_ENV_TS_COMPILER 是一个环境变量，可以指定使用 "babel" 还是使用 "tsc" 来编译组件库
  // 看代码应该默认使用的是 "tsc"
  return (BUILD_ENV_TS_COMPILER === 'babel' ? withBabel(options) : withTSC(options)).then(
    () => {},
    (error) => {
      throw error;
    }
  );
}
```

接着就两个编译方法都做一下简单的解析

### withTSC  

```js
function withTSC({ type, outDir, watch }) {
  const { compilerOptions } = getTSConfig();
  let module = type === 'es' ? 'es6' : 'commonjs';

  // Read module filed from the default configuration (es6 / es2020 / esnext)
  if (type === 'es') {
    const regexpES = /^es/i;
    // tscConfig 这个后面会讲到
    if (typeof tscConfig.module === 'string' && regexpES.test(tscConfig.module)) {
      module = tscConfig.module;
    } else if (
      typeof compilerOptions?.module === 'string' &&
      regexpES.test(compilerOptions.module)
    ) {
      module = compilerOptions.module;
    }
  }

  return tsc.compile({
    ...tscConfig,
    module,
    outDir,
    watch: !!watch,
    declaration: type === 'es',
  });
}
```

我们按照顺序一一解析。  

- `const { compilerOptions } = getTSConfig();`  
  `getTSConfig`方法是处理`ts`配置合并问题的。  
  - 首先查找项目根目录下面的`tsconfig.json`文件，接着和自定义配置进行合并（后者覆盖前者）  
  - 接着根据上面的`tsconfig.json`中的`extends`字段，递归向上查找继承的`ts`配置，同样按照上面的步骤进行合并合并。  

  下面是代码  
  ```js
  const getTSConfig = (
    // 项目根目录的ts配置文件路径
    tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json'),
    // 自定义配置
    subConfig = { compilerOptions: {} }
  ) => {
    // 如果项目存在ts配置文件则使用配置文件
    if (fs.pathExistsSync(tsconfigPath)) {
      const config = fs.readJsonSync(tsconfigPath);
      const compilerOptions = (config && config.compilerOptions) || {};
      const subCompilerOptions = (subConfig && subConfig.compilerOptions) || {};

      // 编译配置合并
      // Avoid overwriting of the compilation options of subConfig
      subConfig.compilerOptions = { ...compilerOptions, ...subCompilerOptions };
      Object.assign(config, subConfig);

      // 存在外部继承的配置则递归获取合并配置
      if (config.extends) {
        return getTSConfig(path.resolve(path.dirname(tsconfigPath), config.extends), config);
      }

      return config;
    }
    return { ...subConfig };
  };
  ```

- `if(type === 'es')`  
  讲这个之前先说一下上面代码中出现的`tscConfig`，源码当中绕了几个圈，说白点就是。  
  项目约定了一个目录`.config`，当中存放一些项目自定义的配置，包括`'jest' | 'webpack' | 'babel' | 'docgen' | 'style' | 'tsc'`，
  打包时，代码会去查找`.config/xx.config.js`文件，文件应该默认导出一个**方法**，参数接收默认配置，并返回经过处理后的**自定义配置**供后续打包使用。  

  而`tsConfig`是查找`.config/tsc.config.js`。  
  查看`arco-design`源码目录可以发现，暂时还没有使用到这个。  

  接着我们继续来看上面的`if`逻辑。  

  ```js
  if (type === 'es') {
    const regexpES = /^es/i;
    if (typeof tscConfig.module === 'string' && regexpES.test(tscConfig.module)) {
      module = tscConfig.module;
    } else if (
      typeof compilerOptions?.module === 'string' &&
      regexpES.test(compilerOptions.module)
    ) {
      module = compilerOptions.module;
    }
  }
  ```

  其实也不难看出，只是为了确定最终的编译的`module`。  
  所以不出意外的话，`module`的值还是原来的`es6`


- `tsc.compile({})`   

  这里用到了一个第三方的包[node-typescript-compiler](https://www.npmjs.com/package/node-typescript-compiler?activeTab=readme)来讲`ts`编译成`js`。  

  ```js
    return tsc.compile({
      ...tscConfig,
      module,
      outDir,
      watch: !!watch,
      declaration: type === 'es',
    })
  ```

### withBabel 

  ```js
  async function withBabel({ type, outDir, watch }) {

    // 1. 获取 ts 配置
    const tsconfig = getTSConfig();
    // 2. 目标输出目录
    const targetPath = path.resolve(process.cwd(), outDir);

    // 3. 获取目标编译目录
    let srcPath = '';
    for (const pattern of tsconfig.include as string[]) {
      // xxx 
    }

    const transform = () => {
      // xxx
    }

    const createStream = () => {
      // xxx
    }

    // 4. 编译
    return new Promise(resolve => {
      // xxx 
    })

  }
  ```

我们按照上面`1.2.3.4`的顺序来看具体的代码  

- `1`的话和上面的`withTSC`中是一样的，获取`tsconfig`配置。  

- `2`是目标编译输出的目录(`cwd/es/xx`)。  

- `3`是根据`1`的配置中的`include`字段来找到需要编译的目录  
  具体代码如下  
  ```js
    let srcPath = '';
    // ["components/**/*.ts", "components/**/*.tsx"]
    for (const pattern of tsconfig.include) {
      // match 'src/**/*.ts` or 'src/**/*.{ts,tsx}' or 'src/**/*.t{s,sx}'
      if (/\/\*{2}\/\*\.{?t{?s/.test(pattern)) {
        srcPath = pattern.split('/**/')[0];
        break;
      }
    }
  ```
  所以`srcPath`其实就是组件库的目录`components`  

- `4`  
  具体的编译流程就是这里。  

  - 首先是定义了目标目录当中一些不需要编译的文件(下面数组当中以`!`为前缀的)    
  ```js
  const patterns = [
    ...tsconfig.include,
    `!${path.resolve(srcPath, '**/demo{,/**}')}`,
    `!${path.resolve(srcPath, '**/__test__{,/**}')}`,
    `!${path.resolve(srcPath, '**/*.md')}`,
    `!${path.resolve(srcPath, '**/*.mdx')}`,
  ]
  ```
    这些文件其实就是组件库的测试文件`__test__`，组件演示的示例`demo`，组件库文档文件`md(x)`  

  - `createStream`  
    接着看一下`createStream`方法。  

    下面用到了几个包  
    - [vinyl-fs](https://github.com/gulpjs/vinyl-fs)，根据`glob`目录格式进行解析。  
    - [through2](https://github.com/rvagg/through2)，文件流处理  
    - [gulp-if](https://github.com/robrich/gulp-if)，根据条件判断是否执行相关任务  

  ```js
    const createStream = (src) => {
      // vinyl-fs 
      // 解析相应的文件 得到相应的元数据
      return vfs
        .src(src, {
          allowEmpty: true,
          base: srcPath,
        })
        // 将文件数据转换成 对象模式
        // 方便下面任务对文件的处理
        .pipe(through.obj())
        .pipe(
          // 文件是 .ts 或者 .tsx 的则执行此任务
          // 其实就是 ts文件 的编译
          gulpIf(
            ({ path }) => {
              return /\.tsx?$/.test(path);
            },
            // Delete outDir to avoid static resource resolve errors during the babel compilation of next step
            // 拿到前面拿到的tsconfig配置
            // 如果 type 是 es（esm模式），输出类型声明文件  
            // 这里把 outDir 设置成了 undefined，根据上面英文解释可以知道，是为了避免在下面的任务中的编译发生冲突
            gulpTS({ ...tsconfig.compilerOptions, declaration: type === 'es', outDir: undefined })
          )
        )
        .pipe(
          gulpIf(
            // 编译 ts js tsx jsx 文件，且非.d.ts文件
            ({ path }) => {
              return !path.endsWith('.d.ts') && /\.(t|j)sx?$/.test(path);
            },
            through.obj((file, _, cb) => {
              try {
                // 使用babel编译文件，并将文件格式转成 buffer  
                // transform 会在下面介绍
                file.contents = Buffer.from(transform(file));
                // .jsx -> .js
                file.path = file.path.replace(path.extname(file.path), '.js');
                cb(null, file);
              } catch (error) {
                console.error(error);
                cb(null);
              }
            })
          )
        )
        // 输出文件到指定目录
        .pipe(vfs.dest(targetPath));
    };

  ```

  - `transform`  
    最后看一下`withBabel`的最后的`babel`编译方法。  
  ```js
    const transform = (file) => {
      // Avoid directly modifying the original presets array, it will cause errors when withBabel is called multiple times
      // babelConfig 和前面提到的 withTSC中的 tscConfig 类似，当然这里他是一些默认值的配置的，具体可以查看下面的config
      // 这里对默认配置的 @babel/preset-env 做一下处理，关于转换模式的
      babelConfig.presets = babelConfig.presets.map((preset) => {
        const strPresetEnv = '@babel/preset-env';
        // 如果 type 是 es 那么就不需要做转换，否则就是转换成 commonjs 模式
        // 这里具体可以看下官网的解释
        // https://www.babeljs.cn/docs/babel-preset-env#modules
        const presetOptions = { modules: type === 'es' ? false : 'cjs' };

        // 第一种情况是没有默认配置，则直接赋值
        if (preset === strPresetEnv) {
          return [strPresetEnv, presetOptions];
        }

        // 第二种情况是有默认配置，那么就是合并配置
        if (Array.isArray(preset) && preset[0] === strPresetEnv) {
          const _preset = preset.slice();
          _preset[1] = {
            ...(_preset[1] || {}),
            ...presetOptions,
          };
          return _preset;
        }

        return preset;
      });

      // 最终的babel 编译
      return babelTransform(file.contents, {
        ...babelConfig,
        filename: file.path,
        // Ignore the external babel.config.js and directly use the current incoming configuration
        configFile: false,
      }).code;
    }
  ```

  ```js
  const config = {
    // TODO Solve babel error when there is no [filename]
    filename: '',
    presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-react-jsx-source',
    ],
  };
  ```

## 结束

关于上面的代码，可以参考下[简化的代码](https://github.com/food-billboard/food-billboard.github.io/tree/hexo/source/demo-package/组件库打包配置参考)，其实就是`cv`了`arco-scripts`的代码🌶。  

结束 🔚。

参考链接

> [【目录】组件库打包 cli 教程](https://github.com/lio-mengxiang/mx-design-cli/issues/16)  
> [react 组件库打包指南](https://github.com/lio-mengxiang/mx-design-cli/issues/13)  
> [每天一个npm包：through2](https://zhuanlan.zhihu.com/p/365329097)  
