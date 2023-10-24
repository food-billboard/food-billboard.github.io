import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "Home" },
  ],
  npmClient: 'yarn',
  chainWebpack(memo, { env, webpack }) {
    const glslReg = /\.(glsl|vs|fs)$/
    memo
    .module
    .rule('asset')
    .exclude
    .add(glslReg)
    .end()

    memo.module
    .rule('glslify')
    .test(glslReg)
    .exclude
    .add(/node_modules/)
    .end()
    .use('raw-loader')
    .loader('raw-loader')
    .end()
    .use('glslify-loader')
    .loader('glslify-loader')
    .end()

  },
});
