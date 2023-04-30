import { defineConfig } from 'vite'
import { brotliCompressSync } from 'node:zlib'
import path from 'node:path'

export default defineConfig({
  build: {
    outDir: './src',
    emptyOutDir: false,
    lib: {
      entry: './src/typescript.worker.source.ts',
      formats: ['cjs']
    },
    rollupOptions: {
      output: {
        format: 'cjs',
        entryFileNames: 'typescript.worker.content.js'
      },
      external: ['pnpapi', 'typescript', /^node:.*/],
    },
  },
  plugins: [
    {
      apply: 'build',
      name: 'wrap-worker',
      generateBundle(options, bundle, isWrite) {
        const bundles = Object.keys(bundle)
        if (bundles.length !== 1) throw new Error(`Expected only one bundle, got ${bundles.length}`)

        const outputBundle = bundle[bundles[0]] as any

        outputBundle.code = `let hook;\n\nmodule.exports.getContent = () => {\n  if (typeof hook === \`undefined\`)\n    hook = require('zlib').brotliDecompressSync(Buffer.from('${brotliCompressSync(
          outputBundle.code.replace(/\r\n/g, '\n')
        ).toString('base64')}', 'base64')).toString();\n\n  return hook;\n};\n`
      }
    }
  ]
})
