import { Plugin } from '@yarnpkg/core'
import { ServiceDevCommand } from './service-dev.command'
import { TestCommand } from './test.command'
import { ServiceRunCommand } from './service-run.command'

export const plugin: Plugin = {
	commands: [ServiceDevCommand, TestCommand, ServiceRunCommand],
}
