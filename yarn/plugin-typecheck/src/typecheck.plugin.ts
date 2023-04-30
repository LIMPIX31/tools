import { Plugin } from '@yarnpkg/core'
import { TypecheckCommand } from './typecheck.command'

export const plugin: Plugin = {
  commands: [TypecheckCommand],
}
