import { Plugin } from '@yarnpkg/core'
import { LibBuildCommand } from './lib-build.command'

export const plugin: Plugin = {
  commands: [LibBuildCommand],
}
