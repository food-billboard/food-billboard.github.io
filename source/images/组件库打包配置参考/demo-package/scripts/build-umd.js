const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const pkg = require('../package.json')

webpack(
  {
    entry: './esm/index.js',
    target: 'browserslist:>0.25%, not dead, not op_mini all',
    mode: 'production',
    output: {
      clean: true,
      filename: 'demo-package.min.js',
      libraryTarget: 'umd',
      library: 'demoPackage',
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            babelrc: false,
            configFile: false,
            sourceType: 'unambiguous',
            compact: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: 'umd',
                  useBuiltIns: 'entry',
                  corejs: 3,
                },
              ],
            ],
            plugins: [
              [
                '@babel/plugin-transform-runtime', 
                {
                  corejs: false,
                  version: require('@babel/runtime/package.json').version,
                  helpers: true,
                  regenerator: true,
                },
              ],
            ],
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/inline',
        },
        {
          test: /\.css$/, 
          use: [
            {
              loader: 'style-loader',
              options: {
                attributes: {
                  'data-module': pkg.name,
                  'data-version': pkg.version,
                },
              },
            },
            'css-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                attributes: {
                  'data-module': pkg.name,
                  'data-version': pkg.version,
                },
              },
            },
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [new webpack.ProgressPlugin()],
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              pure_funcs: ['console.log'],
              drop_debugger: true,
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
      ],
    },
    performance: {
      maxEntrypointSize: 1024 * 1024,
      maxAssetSize: 1024 * 1024,
    },
  },
  (error, stats) => {
    if (error) {
      console.error(error)
      process.exit(1)
    }

    if (stats.compilation.errors.length) {
      console.log(stats.toString({ all: false, errors: true, colors: true }))
      process.exit(1)
    }

    console.log(stats.toString({ colors: true }))
  }
)