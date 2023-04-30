import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import deepmerge from 'deepmerge'
import { parseJsonConfigFileContent, sys, createProgram, getPreEmitDiagnostics } from 'typescript'

export * from './utils'

export async function check(cwd: string, include: string[] = []) {
  const tsconfigPath = join(cwd, './tsconfig.json')

  if (!existsSync(tsconfigPath)) {
    throw new Error(`Tsconfig not found in working directory: ${cwd}`)
  }

  const tsconfig = await readFile(tsconfigPath, 'utf8')

  const config = deepmerge(
    JSON.parse(tsconfig),
    { include },
  )

  const { fileNames, options, errors } = parseJsonConfigFileContent(config, sys, cwd)

  if (errors?.length > 0) {
    return errors
  }

  const program = createProgram(fileNames, {
    ...options,
    noEmit: true,
  })

  const result = program.emit()

  return getPreEmitDiagnostics(program).concat(result.diagnostics)
}
