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
  const config = deepmerge.all([
    tsconfig,
    { compilerOptions: overrides },
    { include },
  ])

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
    noEmit: false,
    overrides:
      {
        ...options.overrides,
        emitDeclarationOnly: true,
        declaration: true,
      },
  })
}

export type BuildOptions = RunOptions

export function build(options: BuildOptions) {
  return run({
    ...options,
    noEmit: false,
    overrides:
      {
        ...options.overrides,
        declaration: true,
      },
  })
}
