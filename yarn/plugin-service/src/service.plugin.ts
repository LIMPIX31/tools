import { Plugin } from '@yarnpkg/core'
import { ServiceDevCommand } from './service-dev.command'
import { TestCommand } from './test.command'

export const plugin: Plugin = {
	commands: [ServiceDevCommand, TestCommand],
}
