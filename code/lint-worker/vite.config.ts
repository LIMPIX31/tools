import { defineConfig } from 'vite'
import { brotliCompressSync } from 'node:zlib'

export default defineConfig({
  build: {
    outDir: './src',
    emptyOutDir: false,
    lib: {
      entry: './src/linter.worker.source.ts',
      formats: ['cjs'],
      fileName: 'linter.worker.content'
    },
    rollupOptions: {
      external: ['pnpapi', 'eslint', 'typescript', /^node:.*/, 'fs', 'path', 'module', 'assert', 'os', 'util', 'crypto', 'url', 'stream', 'events', 'child_process', 'buffer', 'perf_hooks'],
      output: {
        manualChunks: () => 'chunk.js',
      },
    },
  },
  plugins: [
    {
      apply: 'build',
      name: 'wrap-worker',
      generateBundle(options, bundle, isWrite) {
        const bundles = Object.keys(bundle)

        const outputBundle = bundle[bundles[0]] as any

        outputBundle.code = `let hook;\n\nmodule.exports.getContent = () => {\n  if (typeof hook === \`undefined\`)\n    hook = require('zlib').brotliDecompressSync(Buffer.from('${brotliCompressSync(
          outputBundle.code.replace(/\r\n/g, '\n'),
        ).toString('base64')}', 'base64')).toString();\n\n  return hook;\n};\n`
      },
    },
  ],
})
