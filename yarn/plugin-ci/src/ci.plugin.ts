import { Plugin } from '@yarnpkg/core'
import { CiTypecheckCommand } from './ci-typecheck.command'

export const plugin: Plugin = {
  commands: [CiTypecheckCommand],
}
