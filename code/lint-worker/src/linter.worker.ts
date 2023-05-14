import type { ESLint } from 'eslint'
import { runWorker } from '@lmpx-code/worker-utils'
import { getContent } from './linter.worker.content'

export async function lint(cwd: string, files: Array<string> = []): Promise<Array<ESLint.LintResult>> {
  return runWorker(getContent(), {
    cwd,
    files,
  })
}
