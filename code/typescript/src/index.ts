import { PortablePath, ppath, xfs } from '@yarnpkg/fslib'
import deepmerge from 'deepmerge'
import { createProgram, getPreEmitDiagnostics, parseJsonConfigFileContent, sys } from 'typescript'

export * from './utils'

export async function check(cwd: PortablePath, include: string[] = []) {
  const tsconfigPath = ppath.join(cwd, './tsconfig.json')

  if (!await xfs.existsPromise(tsconfigPath)) {
    throw new Error(`Tsconfig not found in working directory: ${cwd}`)
  }

  const tsconfig = await xfs.readFilePromise(tsconfigPath, 'utf8')

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
