import { BaseCommand } from '@yarnpkg/cli'
import { Configuration, Project, StreamReport } from '@yarnpkg/core'
import { Option } from 'clipanion'
import { requireAndReport } from '@lmpx/yarn-pnpapi-utils'

export class ServiceDevCommand extends BaseCommand {
	static paths = [['service', 'dev']]

	rest = Option.Rest()

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
					const [allow, packages] = await requireAndReport(
						configuration,
						report,
						['@lmpx-config/vite-service', 'vite-node'],
						this.context.cwd,
					)

					if (!allow) {
						return
					}

					await this.cli.run(['vite-node', '-c', packages['@lmpx-config/vite-service'], '-w', ...this.rest])
				})
			})

		return commandReport.exitCode()
	}
}
