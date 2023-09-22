const glob = require('glob')
const path = require('path')
const fs = require('fs')

const parseImport = require('parse-es-import').default

// console.log(glob.sync('components/**/index.less').forEach(entry => {
//   console.log(entry.slice(entry.indexOf('/')))
// }))

const data = parseImport(fs.readFileSync('./template.ts', 'utf-8'))

console.log(data.imports[0].namedImports, 2222)
