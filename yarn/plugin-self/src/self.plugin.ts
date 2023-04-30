import { Plugin } from '@yarnpkg/core'
import { SelfUpdateCommand } from './self-update.command'

export const plugin: Plugin = {
  commands: [SelfUpdateCommand],
}
