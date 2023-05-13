import type { Diagnostic } from 'typescript'
import { runWorker } from '@lmpx-code/worker-utils'
import { getContent } from './typescript.worker.content'
import type { EmitDeclarationOptions, RunOptions } from '@lmpx-code/typescript'

export function run(options: RunOptions): Promise<Diagnostic[]> {
  const cwd = process.cwd()

  process.chdir(options.cwd)

  return runWorker(getContent(), {
    options: { ...options, cwd },
    method: 'run'
  })
}

export function declaration(options: EmitDeclarationOptions): Promise<Diagnostic[]> {
  const cwd = process.cwd()

  process.chdir(options.cwd)

  return runWorker(getContent(), {
    options: { ...options, cwd },
    method: 'declaration'
  })
}

export function build(options: EmitDeclarationOptions): Promise<Diagnostic[]> {
  const cwd = process.cwd()

  process.chdir(options.cwd)

  return runWorker(getContent(), {
    options: { ...options, cwd },
    method: 'build'
  })
}
