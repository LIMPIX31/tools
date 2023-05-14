import { Plugin } from '@yarnpkg/core'
import { CiTypecheckCommand } from './ci-typecheck.command'
import { CiLintCommand } from './ci-lint.command'

export const plugin: Plugin = {
  commands: [CiTypecheckCommand, CiLintCommand],
}
