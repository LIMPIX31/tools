import { readFile } from 'node:fs/promises'
import type { ESLint } from 'eslint'
import { Linter as ESLinter } from 'eslint'
import { globby } from 'globby'
import ignorer from 'ignore'
import { join, relative } from 'path'
import eslintconfig from '@lmpx-config/eslint'
import { createPatterns, ignore } from './linter.patterns'

async function getProjectIgnorePatterns(cwd: string): Promise<Array<string>> {
  const content = await readFile(join(cwd, 'package.json'), 'utf-8')

  const { linterIgnorePatterns = [] } = JSON.parse(content)

  return linterIgnorePatterns
}

async function lintFiles(cwd: string, files: Array<string> = []): Promise<Array<ESLint.LintResult>> {
  const ignored = ignorer()
    .add(ignore)
    .add(await getProjectIgnorePatterns(cwd))

  const linterConfig: any = { configType: 'flat' }
  const linter = new ESLinter(linterConfig)

  return Promise.all(
    files
      .filter((file) => ignored.filter([relative(cwd, file)]).length !== 0)
      .map(async (filePath) => {
        const source = await readFile(filePath, 'utf8')

        const messages = linter.verify(source, eslintconfig, { filename: filePath })

        return {
          filePath,
          source,
          messages,
          errorCount: messages.filter((message) => message.severity === 1).length,
          fatalErrorCount: messages.filter((message) => message.severity === 0).length,
          warningCount: messages.filter((message) => message.severity === 2).length,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
          usedDeprecatedRules: [],
        }
      }),
  )
}

async function lintProject(cwd: string): Promise<Array<ESLint.LintResult>> {
  const files = await globby(createPatterns(cwd), { dot: true, markDirectories: false })

  return lintFiles(cwd, files)
}

export async function lint(cwd: string, files?: Array<string>): Promise<Array<ESLint.LintResult>> {
  if (files && files.length > 0) {
    return lintFiles(cwd, files)
  }

  return lintProject(cwd)
}
