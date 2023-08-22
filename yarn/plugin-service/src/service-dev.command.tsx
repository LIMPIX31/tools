import { BaseCommand } from '@yarnpkg/cli'
import { Configuration, formatUtils, MessageName, Project, StreamReport, structUtils } from '@yarnpkg/core'
import { resolveRequest } from '@lmpx-code/pnpapi-worker'

export class ServiceDevCommand extends BaseCommand {
	static paths = [['service', 'dev']]

	async execute() {
		const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
		const { project } = await Project.find(configuration, this.context.cwd)

		const commandReport = await StreamReport.start(
			{
				stdout: this.context.stdout,
				configuration,
			},
			async (report) => {
				await report.startTimerPromise('Service', async () => {
					try {
						const file = await resolveRequest('@lmpx-config/vite-service', this.context.cwd)

						if (!file) {
							throw new Error('File is null')
						}

						await this.cli.run(['vite', '-c', file, 'dev'])
					} catch (e) {
						report.reportError(
							MessageName.UNNAMED,
							`No configuration package found: ${formatUtils.pretty(configuration, structUtils.parseIdent('@lmpx-config/vite-service'), 'IDENT')} `
						)
					}
				})
			})

		return commandReport.exitCode()
	}
}
