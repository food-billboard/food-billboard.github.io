const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const cwd = process.cwd()

const postcssRules = {
  loader: 'postcss-loader',
  options: {

  }
}

webpack(
  {
    target: 'browserslist:>0.25%, not dead, not op_mini all',
    mode: 'production',
    entry: [
      cwd,
      path.join(cwd, '/src/components/Style/entry.ts')
    ],
    output: {
      clean: true,
      filename: 'demo.min.js',
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
          exclude: /node_modules/,
          use: [
            'thread-loader',
            {
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
                      modules: false 
                    },
                  ],
                  require.resolve('@babel/preset-react'),
                  require.resolve('@babel/preset-typescript'),
                ],
                plugins: [
                  [
                    '@babel/plugin-transform-runtime', 
                  ],
                ],
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              }
            },
            postcssRules,
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true
                }
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            postcssRules
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|bmp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024
            }
          }
        },
        {
          test: /\.(eot|ttf|woff?)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/i,
          use: [
            '@svgr/webpack'
          ],
          exclude: /node_modules/
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].min.css'
      })
    ],
    optimization: {
      // 配置项用于将 Webpack 运行时代码打包成单独的文件，避免每个模块都包含重复的运行时代码。这可以提高缓存利用率并加快构建速度
      // runtimeChunk: true,
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