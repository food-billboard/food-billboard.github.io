const gulp = require('gulp')
const babel = require('gulp-babel')
const less = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
// css 压缩
const cssnano = require('gulp-cssnano')
// 
const through = require('through2')

const buildType = process.env.BUILD_TYPE 

const pathDir = {
  dest: {
    lib: 'lib',
    esm: 'esm',
    dist: "dist"
  },
  styles: 'src/**/*.less',
  scripts: [
    "src/**/*.{ts,tsx}",
    "!src/**/demo/*.{ts,tsx}"
  ]
}

// css引入的代码转换
// import './index.less' => import './index.css'
// import '../test/style' => import '../test/style/css.js'
// import '../test/style/index.js' => import '../test/style/css.js'
function cssInjection(content) {
  return content 
  .replace(/\/style\/?'/g, "/style/css'")
  .replace(/\/style\/?"/g, "/style/css")
  .replace(/\.less/g, ".css")
}

function less2css() {
  return gulp
  .src(pathDir.styles)
  // less文件处理
  .pipe(less())
  // css前缀
  .pipe(autoprefixer())
  // 压缩
  .pipe(cssnano({
    zindex: false,
    reduceIndents: false 
  }))
  .pipe(gulp.dest(pathDir.dest[buildType]))
}

// less 打包
function copyLess() {
  return gulp
  .src(pathDir.styles)
  .pipe(gulp.dest(pathDir.dest[buildType]))
}

// css 文件引入修改
function changeCssFileName() {
  return through.obj(function(file, encoding, next) {
    this.push(file.clone())
    if(file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
      const content = file.contents.toString(encoding)
      // 文件内容处理
      file.contents = Buffer.from(cssInjection(content))
      // 重命名
      file.path = file.path.replace(/index\.js/, 'css.js')
      this.push(file)
      next()
    }else {
      next()
    }
  })
}

// cjs 打包
function compileCommonJs() {
  const { dest, scripts } = pathDir
  return gulp
  .src(scripts)
  .pipe(babel({
    presets: [
      require.resolve("@babel/preset-env"),
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-typescript")
    ],
    plugins: [
      require.resolve("@babel/plugin-transform-runtime")
    ]
  }))
  .pipe(changeCssFileName())
  .pipe(gulp.dest(dest.lib))
}

// esm 打包
function compileEsModule() {
  const { dest, scripts } = pathDir
  return gulp
  .src(scripts)
  .pipe(babel({
    presets: [
      [
        require.resolve("@babel/preset-env"),
        {
          // 关闭模块转换
          modules: false 
        }
      ],
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-typescript")
    ],
    plugins: [
      [
        require.resolve("@babel/plugin-transform-runtime"),
        {
          // es module 模式
          useESModules: true
        }
      ]
    ]
  }))
  .pipe(changeCssFileName())
  .pipe(gulp.dest(dest.esm))
}

let build
if(buildType === 'lib') {
  build = gulp.parallel(compileCommonJs, copyLess, less2css)
}else if(buildType === 'esm') {
  build = gulp.parallel(compileEsModule, copyLess, less2css)
}

exports.default = build 