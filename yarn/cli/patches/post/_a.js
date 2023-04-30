/**
 * Reference Error: _a is not defined
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
    'var HEAP,buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;',
    'var HEAP,buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64,_a;'
  )
)
