const webpack = require('webpack')
const babelConfig = require('../utils/config/babelConfig')
const packageName = require('../../package.json').name

webpack({
  mode: 'production',
  entry: `${process.cwd()}/components/index.tsx`,
  output: {
    path: `${process.cwd()}/dist`,
    publicPath: `https://unpkg.com/${packageName}@latest/dist/`,
    filename: '[name].min.js',
    library: '[name]',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
          {
            loader: 'ts-loader',
            options: {}
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ]
      },
      {
        test: /\.css$/,
        sideEffects: true,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.module\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:10]',
              },
            }
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ]
      },
    ]
  }
}, (err, stats) => {

  if (err) {
    console.error(err.stack || err);
    return;
  }

  console.log(stats.toString({
    assets: true,
    colors: true,
    warnings: true,
    errors: true,
    errorDetails: true,
    entrypoints: true,
    version: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    children: false,
  }))

  // if (stats.hasErrors()) {
  //   // reject();
  // } else {
  //   // resolve(null);
  // }
})