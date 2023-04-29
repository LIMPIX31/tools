import { Plugin } from '@yarnpkg/core'
import { TspaceCommand } from './tspace.command'

export const plugin: Plugin = {
  commands: [TspaceCommand],
}
