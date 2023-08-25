import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { globby } from 'globby'

const privileged = ['react', 'next', 'vite']

export async function loadImportGroups() {
  const exists = new Set()

  try {
    const { workspaces } = await readFile(join(process.cwd(), '/package.json'), 'utf8').then(JSON.parse)

    if (workspaces?.length > 0) {
      const pkgs = await globby(
        workspaces.map((w) => (w.endsWith('/*') ? w.substring(0, w.length - 2) : w)).map((w) => `${w}/package.json`),
        {
          cwd: process.cwd(),
          onlyFiles: true,
          absolute: true,
        },
      )

      await Promise.all(
        pkgs.map(async (pkg) => {
          try {
            const { name } = await readFile(pkg, 'utf-8').then(JSON.parse)

            exists.add(name)
          } catch {
            /* ignored */
          }
        }),
      )
    }
  } catch {
    /* ignored */
  }

  const existsArray = Array.from(exists)

  return [
    ['^\\u0000'],
    [`^(${privileged.join('|')})`],
    ['^(child_process|crypto|events|fs|http|https|os|path|module|util|url|stream|events|buffer)', '^node:'],
    [`^(?!${[...existsArray, ...privileged].join('|')})`],
    [`^(${existsArray.join('|')})`],
    ['^'],
    ['^\\.'],
  ]
}
