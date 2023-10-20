---
title: 组件库打包配置参考-css打包
date: 2023-09-20 15:18:00
tags: frontend
banner_img: /images/组件库打包配置参考/background.jpg
index_img: /images/组件库打包配置参考/background.jpg
categories:
  - 前端
  - 配置
---

# 组件库打包配置参考-css打包

今天简单讲讲关于组件库打包的`css`打包，这里拿[arco-design](https://arco.design/)的打包工具[arco-cli](https://github.com/arco-design/arco-cli/tree/1.x/packages/arco-scripts)的`1.0`版本来讲解。

### 开始前

`arco-cli`使用的是[gulp](https://github.com/gulpjs/gulp)来组织任务执行的，他能极大的简化构建任务，生态也是及其的庞大，基本业务中的情况都能找到对应的插件。  
简单的一些知识可以看看[这里](https://food-billboard.github.io/2023/09/09/gulp相关知识/)。

> 下面展示的代码可能是笔者更改过的，请勿过分较真(`へ´*)ノ。

> 在这里贴几个下面会用到的常量  
```js 
  // 静态资源的后缀
  const FILE_ASSET_EXT = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "svg",
    "ttf",
    "eot",
    "woff",
    "woff2",
  ];

  // 所有需要处理的资源后缀
  const FILE_WATCHED_EXT = FILE_ASSET_EXT.concat(["less", "css"]);

  // 静态资源的路径
  const ASSET_FILE_ENTRY = `components/**/*.${FILE_ASSET_EXT.join(",")}`

  // 静态资源的输出领
  const ASSET_FILE_OUTPUT = 'dist/asset'
```

## 开始

根据源代码，可以看到任务具体分为三个步骤。每个步骤有两个并行的子任务，下面按照任务的顺序一一做介绍。

```js
function build() {
  return new Promise((resolve) => {
    gulp.series(
      gulp.parallel(copyAsset, copyFileWatched),
      gulp.parallel(compileLess, handleStyleJSEntry),
      gulp.parallel(distLess, distCss),
      gulp.parallel(() => resolve())
    )();
  });
}
```

> 因为该`arco-scripts`是一个通用的打包`cli`，所以本文是基于`react`组件库打包进行解析。  

### copyAsset & copyFileWatched

#### copyAsset

复制静态文件  
此方法比较简单，这里就直接贴代码，看下注释也就能明白。

```js
function copyAsset() {
  return gulp
    // 从目录 components/ 下面找到指定静态资源
    .src(ASSET_FILE_ENTRY, { allowEmpty: true })
    // 直接复制文件输出到 dist/asset目录下
    .pipe(gulp.dest(ASSET_FILE_OUTPUT));
}
```

#### copyFileWatched
和`copyAsset`类似的方法。  

复制静态资源和**样式文件**到`es`和`lib`目录下。  

代码也很简单，直接贴了  

```js 
function copyFileWatched() {
  const patternArray = [`components/**/*.{${FILE_WATCHED_EXT.join(",")}}`];

  const destDirs = ["es", "lib"];

  return Promise.all(
    destDirs.map(dir => {
      return new Promise((resolve, reject) => {
        gulp.src(patternArray, {
          allowEmpty: true,
          // base: cssConfig.watchBase[pattern],
        })
        .pipe(gulp.dest(dir))
        .on('end', resolve)
        .on('error', reject)
      })
    })
  )
}
```

### compileLess & handleStyleJSEntry

#### compileLess

编译`less`文件。  

- [gulp-less](https://github.com/gulp-community/gulp-less)，其实就是一个对`less`封装的`gulp`插件。  
- [gulp-clean-css](https://github.com/scniro/gulp-clean-css)，同样是[clean-css](https://github.com/clean-css/clean-css)的封装，用于清理没有使用的`css`样式。  
- [less-plugin-npm-import](https://github.com/less/less-plugin-npm-import)，`less`插件，可以在`less`文件中引入`npm`包样式文件。  
- [less-plugin-autoprefix](https://github.com/less/less-plugin-autoprefix)，`less`插件，顾名思义，自动补全各个浏览器的**前缀**。  

```js
  const cleanCSS = require('gulp-clean-css')
  const gulpLess = require("gulp-less");
  const NpmImportPlugin = require('less-plugin-npm-import')
  const LessAutoprefix = require('less-plugin-autoprefix')

  const LESS_COMPILE_OPTIONS = {
    paths: ['node_modules'],
    plugins: [npmImport, autoprefix],
    relativeUrls: true,
    javascriptEnabled: true 
  }

  function compileLess() {
    const destDirs = ['es', 'lib']

    let stream = gulp
      .src('components/**/index.less', { allowEmpty: true })
      // less 转 css 
      .pipe(gulpLess(LESS_COMPILE_OPTIONS))
      // 清除无用css
      .pipe(cleanCSS())

    // 将编译好的样式文件复制到 commonjs & usm 目录下面
    destDirs.forEach((dir) => {
      stream = stream.pipe(gulp.dest(dir));
    });

    return stream.on('error', (error) => {
      console.error(error);
    });
  }
```

#### handleStyleJSEntry  

看名字的意思，处理样式的`js`入口文件，即`index.js`引入样式的文件。  
```js
  // index.js 
  import '../../style/index.less';
  import './index.less';
```

先看一下主方法  
```js
async function handleStyleJSEntry() {
  await compileCssJsEntry({
    styleJSEntry: 'components/*/style/index.ts',
    outDirES: 'es',
    outDirCJS: 'lib',
  });

  await injectPackageDepStyle(getComponentDirPattern(['es']));

  // 为什么注释这个方法呢
  // 看源码的话是用来改名的，并且好像并没有实际用到，所以不讲了(`へ´*)ノ
  // renameStyleEntryFilename();
}
```

接着来一一看下里面的两个方法。  
  - `compileCssJsEntry`    
    简单解释就是，把源代码里面的每一个组件的样式入口文件`index.ts`编译为两个文件`index.js`和`css.js`。  
    - `index.js`里面还是原来的内容  
    - `css.js`里面是引入的文件的经过编译的`css`文件  
    就像下面这样  
    ```js 
      // index.ts内容
      import '../../style/index.less';
      import './index.less';

      // index.js内容
      import '../../style/index.less';
      import './index.less';

      // css.js内容
      import '../../style/index.css';
      import './index.css';

    ```
    
    为什么要这么做呢？这样其实就是方便了一些项目可能使用的并不是`less`预编译库，可以直接引入`css.js`。  

    然后我们来看下代码
    ```js
      async function compileCssJsEntry({
        styleJSEntry,
        outDirES,
        outDirCJS,
      }) {
        const compile = (module) => {
          // xxx
        };

        try {
          const asyncTasks = [];
          if (fs.pathExistsSync(outDirES)) {
            asyncTasks.push(compile('es'));
          }
          if (fs.pathExistsSync(outDirCJS)) {
            asyncTasks.push(compile('cjs'));
          }
          await Promise.all(asyncTasks);
        } catch (error) {
          console.error(error);
        }
      }
    ```

    这一部分的话简单明了，就是创建了两个任务分别创建了`es`和`lib`目录的处理任务。  
    核心代码的话还是在`compile`方法里。  

    下面用到了一个`gulp`插件[gulp-replace](https://github.com/lazd/gulp-replace)，是用来做文件内容替换的。  
    还有一个[gulp-rename](https://github.com/hparra/gulp-rename)，顾名思义是做文件重命名的。  

    ```js
      const replace = require('gulp-replace')
      const rename = require('gulp-rename')

      const compile = (module) => {
        return new Promise((resolve, reject) => {
          // styleJSEntry = components/*/style/index.ts
          gulp.src(styleJSEntry, {
            allowEmpty: true,
            // 看着一堆，其实就是 components
            base: styleJSEntry.replace(/(\/\*{1,2})*\/style\/index\.[jt]s$/, ''),
          })
            // 把文件里面的 .less 改成 .css
            .pipe(replace('.less', '.css'))
            .pipe(
              // 源码中已经有注释来说明这一步的目的了，也就是我之前说的那个
              // import './index.css' => import './index.css'
              // import '../es/Button/style' => import '../es/Button/style/css.js'
              replace(/import\s+'(.+(?:\/style)?)(?:\/index.[jt]s)?'/g, (_, $1) => {
                const suffix = $1.endsWith('/style') ? '/css.js' : '';
                return module === 'es' ? `import '${$1}${suffix}'` : `require('${$1}${suffix}')`;
              })
            )
            .pipe(
              rename(function (path) {
                // css js 
                path.basename = 'css';
                path.extname = '.js';
              })
            )
            // 输出到指定的目录
            .pipe(gulp.dest(module === 'es' ? outDirES : outDirCJS))
            .on('end', resolve)
            .on('error', reject);
        });
      }
    ```
  - injectPackageDepStyle  

    接着来看一下`injectPackageDepStyle`方法。  
    首先是参数`getComponentDirPattern(['es'])`  
    > 省流 -> return cwd/es/*
    ```js
      function getComponentDirPattern(dirName) {
        const pathDir = `${process.cwd()}/${dirName.length > 1 ? `{${dirName.join(',')}}` : dirName[0]}`;
        // cwd/es
        let pattern = pathDir;
        // cwd/es/*/style/index.js 
        // 也就是上一步被编译好的样式入口文件
        if (glob.sync(path.resolve(pathDir, '*/style/index.js')).length) {
          // cwd/es/*
          pattern = path.resolve(pathDir, './*');
        }
        return pattern;
      }
    ```

    <!-- vinyl-fs -->
    接着是主方法  

    下面用到一个插件[vinyl-fs](https://github.com/gulpjs/vinyl-fs)，用来做文件解析处理。  
    还有一个[through2](文件流处理)，文件流处理。  

    ```js
      const vfs = require("vinyl-fs")
      const through = require("through2")

      function injectPackageDepStyle(componentEsDirPattern) {
        return new Promise((resolve) => {
          // cwd/es/*/index.js
          const esEntry = path.resolve(componentEsDirPattern, 'index.js');

          // ***这里比较奇怪***
          if (!fs.existsSync(esEntry)) {
            resolve(null);
            return;
          }

          vfs
            // 解析所有复合条件的目标文件
            .src(esEntry, {
              allowEmpty: true,
              // /es/*
              base: componentEsDirPattern,
            })
            .pipe(
              through.obj(async (file, _, cb) => {
                try {
                  // 这一部分下面接着讲
                  await Promise.all([
                    transformStyleEntryContent({
                      esEntryPath: file.path,
                      module: 'es',
                    }),
                    transformStyleEntryContent({
                      esEntryPath: file.path,
                      module: 'cjs',
                    }),
                  ]);
                } catch (error) {
                  console.error(error);
                }
                cb(null);
                resolve(null);
              })
            );
        });
      }
    ```

    > 上面标注了一段非常奇怪的代码，`fs.existsSync(esEntry)`，实际的esEntry=`process.cwd()/es/*/index.js`，但是看下好像`fs.existsSync`并不支持`*`这类标识符，所以一直会返回`false`，它后面的代码根本不会执行，不知道是为什么，可能是我没理解，有懂的可以下面说下👁。    
    > 所以我们暂时忽略这串代码，直接走下面的逻辑。  

      - `transformStyleEntryContent`  
      
        里面用到了`transformStyleEntryContent`这个方法(俄罗斯套娃一样，一层又一层🤷🏻‍♀️)  
        ```js
          async function transformStyleEntryContent({
            esEntryPath,
            module,
          }) {
            const replaceStyleEntryContent = async (type) => {
              // xxx 
            };

            await Promise.all([
              replaceStyleEntryContent('less'),
              replaceStyleEntryContent('css'),
            ]);
          }
        ```
        看名字来看就是替换样式入口文件内容的自已。我们接着看`replaceStyleEntryContent`  

        - `replaceStyleEntryContent`  

          ```js
            const replaceStyleEntryContent = async (type) => {
              // 前面方法的参数 es & cjs  
              const moduleDirName = module === 'es' ? 'es' : 'lib';
              // index.js | css.js 
              const styleEntryFileName =
                type === 'less'
                  ? 'index.js'
                  : 'css.js';
              // 把路径修改成置顶模块的路径
              // 最终就是 (es | lib)/xx/style/(index | css).js
              const styleEntryPath = path
                // esEntryPath 就是正在解析的那个文件的目录
                // path.dirname(esEntryPath) 就是这个文件的所在的文件夹的位置
                // 其实就是 es/xx/style/(index | css).js
                .resolve(path.dirname(esEntryPath), `./style/${styleEntryFileName}`)
                // 接着把目录改成需要的模块的目录
                .replace('/es/', `/${moduleDirName}/`);

              // 这个里面有一串比较奇怪的代码，我们单独下面讲解
              if (fs.pathExistsSync(styleEntryPath)) {
                // xxx 
              }
            }
          ```

          上面的`if`里面还有一串的代码，比较奇怪，所以我们单独放在这里讲  
          在文件最外层有一个`dependenciesCacheMap`变量， 它是一个对象。  

          还有这么一个变量`LIBRARY_PACKAGE_NAME`表示的是你的组件库的包名(我们这里取名`your-package-name`)  
          ```js
            if(fs.pathExistsSync(styleEntryPath)) {
              let styleIndexContent = fs.readFileSync(styleEntryPath, 'utf8');

              if (!dependenciesCacheMap[esEntryPath]) {
                dependenciesCacheMap[esEntryPath] = await parsePackageImports(
                  esEntryPath,
                  LIBRARY_PACKAGE_NAME
                );
              }

              dependenciesCacheMap[esEntryPath].forEach((dep) => {
                const depStyleRequirePath = `${LIBRARY_PACKAGE_NAME}/${moduleDirName}/${dep}/style/${styleEntryFileName}`;
                if (styleIndexContent.indexOf(depStyleRequirePath) === -1) {
                  const expression =
                    module === 'es'
                      ? `import '${depStyleRequirePath}';\n`
                      : `require('${depStyleRequirePath}');\n`;
                  styleIndexContent = `${expression}${styleIndexContent}`;
                }
              });

              fs.writeFileSync(styleEntryPath, styleIndexContent);
            }
          ```

          首先他有一个`dependenciesCacheMap`用来存储所有已经被解析过的文件模块，避免重复解析。  
          如果`dependenciesCacheMap[esEntryPath]`不存在时，就会使用`parsePackageImports`来解析模块。  
          `parsePackageImports`是使用[parse-es-import](https://github.com/MisterLuffy/parse-es-import)来解析每个`es/*/index.js`的引入。  
          如果是**第三方**的模块且是`LIBRARY_PACKAGE_NAME`，那么就是收集该模块的**所有引入**。  
          如果是**相对路径**模块，则递归调用`parsePackageImports`，继续解析该引入的模块。  
          收集完所有的`LIBRARY_PACKAGE_NAME`引入，即`parsePackageImports`的返回值，即`dependenciesCacheMap[esEntryPath]`。  
          接着再遍历，拼接出新的引入模块（对应模块的样式），添加到`styleEntryPath`内容中。  

          个人理解的话，就是组件当中引入了自己本身的第三方模块，然后自动引入该模块的样式文件。  

### distLess & distCss

#### distLess

把所有组件的入口`less`文件自动集中到一个`less`文件中，并放到`dist`目录下。  

大概就是如下这样的结构。  
```less
@import "../../es/style/mixins/index.less";
@import "../../es/style/index.less";
@import "../../es/_class/Draggable/style/index.less";
@import "../../es/_class/picker/style/index.less";
@import "../../es/Affix/style/index.less";
@import "../../es/Alert/style/index.less";
```
简单流程就是找到`components/xx/index.less`文件（所以目录结构有规范，默认认为`index.less`为组件等的入口样式文件），**路径**修改后，字符串拼接出需要的语法，合并到一个字符串中，并写入对应的文件中。  

```js
function distLess(cb) {
  // 输出的目录
  const distPath = 'dist/css'
  // 输出文件名称
  const rawFileName = 'index.less'
  // 找到所有的样式文件目录
  const entries = glob.sync('components/**/index.less')

  if (entries.length) {
    const texts = [];

    entries.forEach((entry) => {
      // components/**/index.less -> es/**/index.less
      const esEntry = 'es' + entry.slice(entry.indexOf('/'));
      // 相对于distPath 的相对路径
      // relative 的意思是 esEntry相对于distPath的相对路径
      const relativePath = path.relative(distPath, esEntry);
      const text = `@import "${relativePath}";`;

      // 下面的代码控制的写入顺序，也就是引入顺序
      // 个人的理解应该是 es/style 开头表示为组件的样式，其余的样式写在后面，即其余样式能覆盖组件的样式
      if (esEntry.startsWith(`es/style`)) {
        texts.unshift(text);
      } else {
        texts.push(text);
      }
    });

    // 输出文件
    fs.outputFileSync(`${distPath}/${rawFileName}`, texts.join('\n'));
  }

  cb();
}

```

#### distCss

将上一步(`distLess`)生成的`less`文件转换成单个`css`文件，其目的就是能在`umd`模式下能全量引入所有组件的样式。  
比如：`import 'package-components/dist/css/index.min.css'`  

```js
  function distCss() {
    // 输出的文件目录
    const distPath = 'dist/css'
    // 指定的 less 文件
    const rawFileName = 'index.less'
    // 指定输出的 css 文件
    const cssFileName = 'index.css'

    let stream = gulp.src(`${distPath}/${rawFileName}`, { allowEmpty: true });

    // 将less文件编译成css
    // 这里的步骤和 上面 compileLess 任务中的编译其实是同一个逻辑    
    stream = stream.pipe(gulpLess(LESS_COMPILE_OPTIONS));

    return stream
      .pipe(
        // 把样式文件当中一些引入的静态资源文件 更换路径到 dist下面的路径
        replace(
          new RegExp('(\.{2}\/)+es', 'g'),
          path.relative(distPath, ASSET_FILE_OUTPUT)
        )
      )
      // 清理无用样式
      .pipe(cleanCSS())
      // 改名为 index.css
      .pipe(rename(cssFileName))
      .pipe(gulp.dest(distPath))
      .on('error', (error) => {
        console.error(error);
      });
  }
```

## 结束

关于上面的代码，可以参考下[简化的代码](https://github.com/food-billboard/food-billboard.github.io/tree/hexo/source/demo-package/组件库打包配置参考)，其实就是`cv`了`arco-scripts`的代码🌶。  

结束 🔚。

参考链接

> [【目录】组件库打包 cli 教程](https://github.com/lio-mengxiang/mx-design-cli/issues/16)  
> [react 组件库打包指南](https://github.com/lio-mengxiang/mx-design-cli/issues/13)  
> [每天一个npm包：through2](https://zhuanlan.zhihu.com/p/365329097)  
