const gulp = require('gulp')
const rename = require('gulp-rename')
const fs = require('fs-extra')
const glob = require('glob')
// 替换文件内的文本内容
const replace = require('gulp-replace')
const path = require('path')
const through = require('through2')
const vfs = require('vinyl-fs')
const { FILENAME_STYLE_ENTRY_CSS, FILENAME_STYLE_ENTRY_RAW, LIBRARY_PACKAGE_NAME } = require('./constants')
const parsePackageImports = require('./parsePackageImports')

const dependenciesCacheMap = {};

// 把组件 style/index.ts 里面的引入less改成css，并把文件改成css.js  
async function compileCssJsEntry({
  styleJSEntry,
  outDirES,
  outDirCJS,
}) {
  // module es | lib
  const compile = (module) => {
    return new Promise((resolve, reject) => {
      gulp.src(styleJSEntry, {
        allowEmpty: true,
        base: styleJSEntry.replace(/(\/\*{1,2})*\/style\/index\.[jt]s$/, ''),
      })
        .pipe(replace('.less', '.css'))
        .pipe(
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
            const [basename, extname] = FILENAME_STYLE_ENTRY_CSS.split('.');
            path.basename = basename;
            path.extname = `.${extname}`;
          })
        )
        .pipe(gulp.dest(module === 'es' ? outDirES : outDirCJS))
        .on('end', resolve)
        .on('error', reject);
    });
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

// /**/es/*
function getComponentDirPattern(dirName) {
  const pathDir = `${process.cwd()}/${dirName.length > 1 ? `{${dirName.join(',')}}` : dirName[0]}`;
  let pattern = pathDir;
  if (glob.sync(path.resolve(pathDir, `*/style/${FILENAME_STYLE_ENTRY_RAW}`)).length) {
    pattern = path.resolve(pathDir, './*');
  }
  return pattern;
}

async function transformStyleEntryContent({
  esEntryPath,
  module,
}) {
  const replaceStyleEntryContent = async (type) => {
    const moduleDirName = module === 'es' ? 'es' : 'lib';
    // index.js | css.js 
    const styleEntryFileName =
      type === 'less'
        ? FILENAME_STYLE_ENTRY_RAW
        : FILENAME_STYLE_ENTRY_CSS;
    // 把路径修改成置顶模块的路径
    const styleEntryPath = path
      .resolve(path.dirname(esEntryPath), `./style/${styleEntryFileName}`)
      .replace('/es/', `/${moduleDirName}/`);

    if (fs.pathExistsSync(styleEntryPath)) {
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
  };

  await Promise.all([
    replaceStyleEntryContent('less'),
    replaceStyleEntryContent('css'),
  ]);
}

function injectPackageDepStyle(componentEsDirPattern) {
  return new Promise((resolve) => {
    const esEntry = path.resolve(componentEsDirPattern, 'index.js');

    if (!fs.existsSync(esEntry)) {
      resolve(null);
      return;
    }

    vfs
      .src(esEntry, {
        allowEmpty: true,
        // /es/*
        base: componentEsDirPattern,
      })
      .pipe(
        through.obj(async (file, _, cb) => {
          try {
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

async function handleStyleJSEntry() {
  await compileCssJsEntry({
    styleJSEntry: 'components/*/style/index.ts',
    outDirES: 'es',
    outDirCJS: 'lib',
  });

  await injectPackageDepStyle(getComponentDirPattern(['es']));

  // renameStyleEntryFilename();
}

module.exports = handleStyleJSEntry