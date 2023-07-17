import { defineConfig } from 'vite'
import { brotliCompressSync } from 'node:zlib'

export default defineConfig({
  build: {
    outDir: './src',
    emptyOutDir: false,
    lib: {
      entry: './src/linter.worker.source.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        format: 'cjs',
        entryFileNames: 'linter.worker.content.js',
      },
      external: ['pnpapi', "eslint", 'typescript', /^node:.*/, 'fs', 'path', 'module', 'assert', 'os', 'util', 'crypto', 'url', 'stream', 'events', 'child_process', 'buffer'],
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
          outputBundle.code.replace(/\r\n/g, '\n'),
        ).toString('base64')}', 'base64')).toString();\n\n  return hook;\n};\n`
      },
    },
  ],
})
