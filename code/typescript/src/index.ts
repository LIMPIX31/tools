import { PortablePath } from '@yarnpkg/fslib'
import deepmerge from 'deepmerge'
import { type CompilerOptions, createProgram, getPreEmitDiagnostics, parseJsonConfigFileContent, sys } from 'typescript'

export * from './utils'

export interface RunOptions {
  cwd: PortablePath,
  tsconfig: object,
  overrides?: CompilerOptions
  include?: string[]
  noEmit?: boolean
}

export function run({ cwd, tsconfig, include = [], noEmit = true, overrides = {} }: RunOptions) {
  const config = deepmerge(
    tsconfig,
    { compilerOptions: overrides },
    { include } as any,
  )

  const { fileNames, options, errors } = parseJsonConfigFileContent(config, sys, cwd)

  if (errors?.length > 0) {
    return errors
  }

  const program = createProgram(fileNames, {
    ...options,
    noEmit,
  })

  const result = program.emit()

  return getPreEmitDiagnostics(program).concat(result.diagnostics)
}

export type EmitDeclarationOptions = RunOptions

export function declaration(options: EmitDeclarationOptions) {
  return run({
    ...options,
    overrides:
      {
        ...options.overrides,
        emitDeclarationOnly: true,
        declaration: true,
      },
  })
}
