const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pkg = require('../package.json')

const postcssRules = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      // flex 属性的bug 
      require('postcss-flexbugs-fixes'),
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3
      })
    ]
  }
}

webpack(
  {
    target: 'browserslist:>0.25%, not dead, not op_mini all',
    mode: 'production',
    entry: process.cwd(),
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
                modules: {
                  localIndentName: '[name]__[local]--[hash:base64:5]',
                  auto: resourcePath => resourcePath.endsWith('.module.less')
                }
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

const PREV_CONFIG = {
  entry: './esm/index.js',
  target: 'browserslist:>0.25%, not dead, not op_mini all',
  mode: 'production',
  output: {
    clean: true,
    filename: '[name].min.js',
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
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].min.css'
    })
  ],
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
}