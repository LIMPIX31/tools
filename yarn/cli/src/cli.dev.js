const { join } = require('node:path')

require(`${__dirname}/../../../.pnp.cjs`).setup()

process.execArgv.push('--require')
process.execArgv.push(join(__dirname, '../../../.pnp.cjs'))

process.execArgv.push('--require')

global.YARN_VERSION = `${require('@yarnpkg/cli/package.json').version}.dev`

module.exports = require('./cli')
