import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { globby } from 'globby'

const privileged = ['react', 'next', 'vite']

export async function loadImportGroups() {
  const exists = new Set<string>()

  try {
    const { workspaces } = await readFile(join(process.cwd(), '/package.json'), 'utf8').then(JSON.parse)

    if (workspaces?.length > 0) {
      const folders = await globby(workspaces, {
        cwd: process.cwd(),
        onlyDirectories: true,
        absolute: true,
        expandDirectories: {
          files: ['package.json'],
          extensions: ['json'],
        },
      })

      await Promise.all(
        folders.map(async (folder) => {
          try {
            const { name } = await readFile(join(folder, 'package.json'), 'utf-8').then(JSON.parse)

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
