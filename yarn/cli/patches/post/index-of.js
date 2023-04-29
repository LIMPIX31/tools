/**
 * Type Error: Cannot read properties of undefined (reading 'indexOf')
 */

const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const BUNDLE_PATH = join(__dirname, '../../bundles/yarn.js')

writeFileSync(
  BUNDLE_PATH,
  readFileSync(
    BUNDLE_PATH,
    'utf8'
  ).replaceAll(
    'dynamicModule.children.indexOf(freshCacheEntry)',
    'dynamicModule.children?.indexOf(freshCacheEntry)??-1'
  )
)
