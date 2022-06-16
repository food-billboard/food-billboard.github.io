
// 动态彩带
// 动态黑色线条
// 鼠标星星特效
// 雪花特效
// 点击文字特效
hexo.extend.injector.register('body_end', `
  <script src="//cdn.jsdelivr.net/gh/bynotes/texiao/source/js/caidai.js"></script>
  <script src="//cdn.jsdelivr.net/gh/bynotes/texiao/source/js/xiantiao.js"></script>
  <script src="//cdn.jsdelivr.net/gh/bynotes/texiao/source/js/xiaoxingxing.js"></script>
  <script src="//cdn.jsdelivr.net/gh/bynotes/texiao/source/js/daxuehua.js"></script>
  <script src="//cdn.jsdelivr.net/gh/bynotes/texiao/source/js/dianjichuzi.js"></script>
`)

// 打字机颜色渐变
// 鼠标指针
hexo.extend.injector.register('body_before', `
  <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/bynotes/texiao/source/css/toubudaziji.css"></link>
  <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/bynotes/texiao/source/css/shubiao.css"></link>
`)