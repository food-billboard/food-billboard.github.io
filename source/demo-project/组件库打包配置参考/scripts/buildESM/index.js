const compileTS = require('../utils/compileTS')

function buildESM() {
  return compileTS({ type: 'es', outDir: `${process.cwd()}/es` })
}

buildESM()