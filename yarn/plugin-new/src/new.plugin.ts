import type { Plugin } from '@yarnpkg/core'
import { NewCommand } from './new.command'

export const plugin: Plugin = {
	commands: [NewCommand]
}
