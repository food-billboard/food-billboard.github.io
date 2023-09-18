const gulp = require("gulp");
const fs = require('fs-extra')
// 处理less
const gulpLess = require("gulp-less");
// 文件系统
const glob = require('glob')
const path = require('path')
// 流合并
const mergeStream = require('merge-stream')
// 清除无用css样式
const cleanCSS = require('gulp-clean-css')
const NpmImportPlugin = require('less-plugin-npm-import')
const LessAutoprefix = require('less-plugin-autoprefix')
const handleStyleJSEntry = require('./handleStyleJSEntry')
const {  
  FILE_WATCHED_EXT,
  ASSET_FILE_ENTRY,
  ASSET_FILE_OUTPUT
} = require('./constants')

// 支持less中导入 npm 包
const npmImport = new NpmImportPlugin({ prefix: '~' });
// 自动添加css前缀
const autoprefix = new LessAutoprefix();

const LESS_COMPILE_OPTIONS = {
  paths: ['node_modules'],
  plugins: [npmImport, autoprefix],
  relativeUrls: true,
  javascriptEnabled: true 
}

// 把静态资源直接复制到dist下面
function copyAsset() {
  return gulp
    .src(ASSET_FILE_ENTRY, { allowEmpty: true })
    .pipe(gulp.dest(ASSET_FILE_OUTPUT));
}

// 把上面说的 FILE_WATCHED_EXT 静态资源文件复制到 es 和 lib 下面
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

function compileLess() {
  const destDirs = ['es', 'lib']

  let stream = gulp
    .src('components/**/index.less', { allowEmpty: true })
    // less 转 css 
    .pipe(gulpLess(LESS_COMPILE_OPTIONS))
    // 清除无用css
    .pipe(cleanCSS())

  destDirs.forEach((dir) => {
    stream = stream.pipe(gulp.dest(dir));
  });

  return stream.on('error', (error) => {
    console.error(error);
  });
}

// 把相关组件的样式 less文件 自动引入到dist目录下
function distLess(cb) {
  const distPath = 'dist/css'
  const rawFileName = 'index.less'
  let entries = glob.sync('components/**/index.less')

  if (entries.length) {
    const texts = [];

    entries.forEach((entry) => {
      // components/**/index.less -> es/**/index.less
      const esEntry = 'es' + entry.slice(entry.indexOf('/'));
      // 相对于distPath 的相对路径
      const relativePath = path.relative(distPath, esEntry);
      const text = `@import "${relativePath}";`;

      if (esEntry.startsWith(`es/style`)) {
        texts.unshift(text);
      } else {
        texts.push(text);
      }
    });

    fs.outputFileSync(`${distPath}/${rawFileName}`, texts.join('\n'));
  }

  cb();
}

// 把less 转成 css
function distCss() {
  const distPath = 'dist/css'
  const rawFileName = 'index.less'
  const cssFileName = 'index.css'

  let stream = gulp.src(`${distPath}/${rawFileName}`, { allowEmpty: true });

  stream = stream.pipe(gulpLess(LESS_COMPILE_OPTIONS));

  return stream
    .pipe(
      // The less file in the /dist is packaged from the less file in /es, so its static resource path must start with ../es
      replace(
        new RegExp('(\.{2}\/)+es', 'g'),
        path.relative(distPath, ASSET_FILE_OUTPUT)
      )
    )
    .pipe(cleanCSS())
    .pipe(rename(cssFileName))
    .pipe(gulp.dest(distPath))
    .on('error', (error) => {
      console.error(error);
    });
}

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

build()
