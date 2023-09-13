const path = require('path')
const fsPromise = require('fs').promises
const fs = require('fs')
const { jsPDF } = require('jspdf')
const { STATIC_PDF_PATH, STATIC_PATH } = require('./constants')

// 图片合并转pdf 
async function image2Pdf() {
  const outputPath = path.join(__dirname, STATIC_PDF_PATH)
  if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
  }
  const imageDir = path.join(__dirname, STATIC_PATH)
  // 找到所有的章节目录并排除一些不相关的文件或目录
  // ? mac 上面会生成 .DS_Store 文件
  const dirList = (await fsPromise.readdir(imageDir))
  .filter(item => !Number.isNaN(parseInt(item)))

  for(let i = 0; i < dirList.length; i ++) {
    const fileName = `第${i + 1}章-龙珠超-次元乱战.pdf`
    const filePath = path.join(__dirname, STATIC_PDF_PATH, fileName)
    if(fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }
    const doc = new jsPDF()
    // pdf的尺寸
    const docWidth = doc.internal.pageSize.getWidth()
    const docHeight = doc.internal.pageSize.getHeight()
    const currentDir = path.join(imageDir, dirList[i])
    const imageList = (await fsPromise.readdir(currentDir)).filter(item => !Number.isNaN(parseInt(item.split('.')[0])))

    for(let j = 0; j < imageList.length; j ++) {
      if(!!j) doc.addPage()
      const imagePath = path.join(currentDir, imageList[j])
      const imageData = await fsPromise.readFile(imagePath, { encoding: 'base64' })
      const [imageFormat] = imagePath.split('.').slice(-1)
      // 把图片充满整页的pdf 
      doc.addImage(
        imageData,
        imageFormat,
        0,
        0,
        docWidth,
        docHeight
      )
    }

    const fileData = doc.output('arraybuffer')
    // 把 arraybuffer 转成 buffer 
    const bufferFileData = Buffer.from(fileData)
    await fsPromise.writeFile(filePath, bufferFileData)
    console.log(`${fileName}生成~`)
  }
}

image2Pdf()