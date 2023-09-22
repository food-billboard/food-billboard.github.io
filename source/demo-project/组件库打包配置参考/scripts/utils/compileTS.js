const chalk = require('chalk')
const path = require('path')
const vfs = require('vinyl-fs')
const fs = require('fs-extra')
const through = require('through2')
const tsc = require('node-typescript-compiler')
const babelTransform = require('@babel/core').transform
const tscConfig = require('./config/tsConfig')
const babelConfig = require('./config/babelConfig')

async function withBabel({ type, outDir, watch }) {

  // 获取 ts 配置
  const tsconfig = getTSConfig();
  // 目标输出目录
  const targetPath = path.resolve(process.cwd(), outDir);

  // 找到需要编译的目录
  let srcPath = 'components'

  const transform = (file) => {
    // Avoid directly modifying the original presets array, it will cause errors when withBabel is called multiple times
    babelConfig.presets = babelConfig.presets.map((preset) => {
      const strPresetEnv = '@babel/preset-env';
      const presetOptions = { modules: type === 'es' ? false : 'cjs' };

      if (preset === strPresetEnv) {
        return [strPresetEnv, presetOptions];
      }

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

    // babel 编译
    return babelTransform(file.contents, {
      ...babelConfig,
      filename: file.path,
      // Ignore the external babel.config.js and directly use the current incoming configuration
      configFile: false,
    }).code;
  }

  const createStream = (src) => {
    return vfs
      .src(src, {
        allowEmpty: true,
        base: srcPath,
      })
      // 文件转换成obj 
      .pipe(through.obj())

      .pipe(
        // 编译 ts tsx 文件
        gulpIf(
          ({ path }) => {
            return /\.tsx?$/.test(path);
          },
          // Delete outDir to avoid static resource resolve errors during the babel compilation of next step
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
              // 文件格式转换成 buffer
              file.contents = Buffer.from(transform(file));
              // .jsx -> .js
              // 更改文件后缀
              file.path = file.path.replace(path.extname(file.path), '.js');
              cb(null, file);
            } catch (error) {
              console.error(error);
              cb(null);
            }
          })
        )
      )
      .pipe(vfs.dest(targetPath));
  };

  return new Promise((resolve) => {
    const patterns = [
      ...tsconfig.include,
      `!${path.resolve(srcPath, '**/demo{,/**}')}`,
      `!${path.resolve(srcPath, '**/__test__{,/**}')}`,
      `!${path.resolve(srcPath, '**/*.md')}`,
      `!${path.resolve(srcPath, '**/*.mdx')}`,
    ];
    createStream(patterns).on('end', resolve);
  });

}

// 获取ts配置
const getTSConfig = (
  tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json'),
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

async function withTSC({ type, outDir, watch }) {
  // 获取ts配置文件
  const { compilerOptions } = getTSConfig();
  let module = type === 'es' ? 'es6' : 'commonjs';

  // Read module filed from the default configuration (es6 / es2020 / esnext)
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

  return tsc.compile({
    ...tscConfig,
    module,
    outDir,
    watch: !!watch,
    // 生成 .d.ts文件
    declaration: type === 'es',
  });
}

async function compileTS(options) {
  const { compile, ...nextOptions } = options 
  return (compile === 'babel' ? withBabel(nextOptions) : withTSC(nextOptions))
  .then(() => {
    console.log(chalk.green(`编译${nextOptions.type}成功`))
  })
}

module.exports = compileTS