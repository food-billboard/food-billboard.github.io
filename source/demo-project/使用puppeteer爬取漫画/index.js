const puppeteer = require('puppeteer')
const fsPromise = require('fs').promises
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { STATIC_PATH } = require('./constants')

const COMMON_PUPPETEER_ARGS = { 
  headless: 'new', 
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

// 目录存在检查并创建
async function mkdirAndCheck(pathData='') {
  const realPath = path.join(__dirname, STATIC_PATH, pathData)
  if(fs.existsSync(realPath)) {
    return realPath
  }
  return fsPromise.mkdir(realPath)
  .then(() => realPath)
}

// 文件下载
async function downloadFile(image, pathData, retry=10) {
  const realPath = path.join(__dirname, STATIC_PATH, pathData)
  if(fs.existsSync(realPath)) {
    return 
  }

  // 重试机制
  let retryTimes = Math.max(1, parseInt(retry)) || 10

  function download() {
    return axios({
      url: image,
      responseType: 'stream'
    })
    .then(response => {
      const { data } = response 
      const write = fs.createWriteStream(realPath)
      return new Promise(resolve => {
        data.on('data', (data) => {
          write.write(data)
        })
        data.on('close', resolve)
      })
    })
    .catch(err => {
      if(!!retryTimes) {
        retryTimes -- 
        console.error(`${pathData}下载失败(image)，当前正在重试，剩余重试次数为：${retryTimes}次`)
        return download()
      }else {
        console.error(`${pathData}下载失败(${image})`)
      }
    })
  }

  return download()

}

// 跳转到章节页面获取数据
async function fetchPageData({ index, href }) {

  const dirPath = await mkdirAndCheck((index + 1).toString())
  const currentPageImageList = await fsPromise.readdir(dirPath)

  const browser = await puppeteer.launch(COMMON_PUPPETEER_ARGS);
  const page = await browser.newPage();
  await page.setCacheEnabled(false)

  try {
    await page.goto(href);

    // 找到索引数量，明确当前章节存在页数
    const pageList = await page.$$eval('.pageSelect.nav-pagination', value => value[0])
    const pageLength = Object.keys(pageList).length

    for(let i = 0; i < pageLength; i ++) {
      // 点击下一页按钮，并等待跳转
      if(!!i) await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('.main-btn > .nav-pagination:nth-of-type(4)')
      ])

      // 找到漫画图片
      const image = await page.$eval('#tbCenter #images img', value => {
        return value.getAttribute('src')
      })
      if(image) {
        const [type] = image.split('.').slice(-1)
        const filename = `${i + 1}.${type}`
        if(currentPageImageList.includes(filename)) {
          console.error(`第${index + 1}章的第${i + 1}页已存在，跳过下载！`)
        }else {
          await downloadFile(image, `/${index + 1}/${filename}`)
          console.error(`第${index + 1}章的第${i + 1}页下载成功`)
        }
      }else {
        console.error(`第${index + 1}章的第${i + 1}页的图片url不存在`)
      }
    }
  }catch(err) {
    console.error(err)
  }finally {
    await browser.close()
  }

}

// 获取索引
async function fetchData() {
  const browser = await puppeteer.launch(COMMON_PUPPETEER_ARGS);
  const page = await browser.newPage();
  try {
    await page.goto('https://www.gufengmh.com/manhua/qilongzhuchaociyuanluanzhan/');
    // 找到对应的 a 标签链接
    const pageList = await page.$$eval(
      '#chapter-list-1 li a',
      (value) => {
        return value.map((item) => {
          try {
            const target = item.getAttribute('href')
            return {
              href: target ? `https://www.gufengmh.com${target}` : target,
              text: item.innerText
            }
          }catch(err) {}
          return null
        })
        // 因为存在一些重复的内容
        .filter(item => !!item && !item.text.includes('修'))
        // 有些章节的顺序不太对
        .sort((a, b) => {
          const textA = parseInt(a.text.replace('第', ''))
          const textB = parseInt(b.text.replace('第', ''))
          return textA - textB
        })
      }
    )
    for(let i = 0; i < pageList.length; i ++) {
      if(pageList[i].href) await fetchPageData({ ...pageList[i], index: i })
    }
  }catch(err) {

  }finally {
    await browser.close()
  }
}

mkdirAndCheck()
.then(fetchData)

