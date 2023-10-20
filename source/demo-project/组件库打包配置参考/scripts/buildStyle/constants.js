
// 静态资源的后缀
const FILE_ASSET_EXT = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "ttf",
  "eot",
  "woff",
  "woff2",
];

// 所有需要处理的资源后缀
const FILE_WATCHED_EXT = FILE_ASSET_EXT.concat(["less", "css"]);

// 静态资源的路径
const ASSET_FILE_ENTRY = `components/**/*.${FILE_ASSET_EXT.join(",")}`

// 静态资源的输出领
const ASSET_FILE_OUTPUT = 'dist/asset'

// 样式文件的路径
const STYLE_FILE_ENTRY = ``

const FILENAME_STYLE_ENTRY_CSS = 'css.js';

const FILENAME_STYLE_ENTRY_RAW = 'index.js'

// 组件库包名
const LIBRARY_PACKAGE_NAME = 'your-package-name'

module.exports = {
  FILE_ASSET_EXT,
  FILE_WATCHED_EXT,
  ASSET_FILE_ENTRY,
  ASSET_FILE_OUTPUT,
  FILENAME_STYLE_ENTRY_CSS,
  FILENAME_STYLE_ENTRY_RAW,
  LIBRARY_PACKAGE_NAME
}