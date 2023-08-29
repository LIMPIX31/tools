import { BaseCommand } from '@yarnpkg/cli'
import { Configuration, Project, StreamReport } from '@yarnpkg/core'
import { requireAndReport } from '@lmpx/yarn-pnpapi-utils'

export class TestCommand extends BaseCommand {
	static paths = [['service', 'test']]

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
						['@lmpx-config/vite-service', 'vitest'],
						this.context.cwd,
					)

					if (!allow) {
						return
					}

					await this.cli.run(['vitest', '-c', packages['@lmpx-config/vite-service'], 'run'])
				})
			})

		return commandReport.exitCode()
	}
}
