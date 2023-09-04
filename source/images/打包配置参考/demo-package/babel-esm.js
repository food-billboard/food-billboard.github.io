module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // 关闭模块转换
        modules: false 
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        // es module 模式
        useESModules: true
      }
    ]
  ]
}