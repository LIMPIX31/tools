import type { Diagnostic } from 'typescript'
import { runWorker } from '@lmpx/code-worker-utils'
import { getContent } from './typescript.worker.content'

export async function check(cwd: string, include: string[]): Promise<Diagnostic[]> {
  const originalCwd = process.cwd()

  process.chdir(cwd)

  return runWorker(getContent(), {
    cwd: originalCwd,
    include,
  })
}
