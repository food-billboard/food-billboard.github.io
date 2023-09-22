const compileTS = require('../utils/compileTS')

function buildCJS() {
  return compileTS({ type: 'lib', outDir: `${process.cwd()}/lib` })
}

buildCJS()