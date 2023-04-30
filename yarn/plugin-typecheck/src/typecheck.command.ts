import { BaseCommand } from '@yarnpkg/cli'
import { Configuration, MessageName, Project, StreamReport } from '@yarnpkg/core'
import { check } from '@lmpx/code-typescript-worker'
import { inspect } from 'node:util'

export class TypecheckCommand extends BaseCommand {
  static paths = [['typecheck']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start({
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Typecheck', async () => {
          const diagnostics = await check(
            project.cwd,
            project.topLevelWorkspace.manifest.workspaceDefinitions.map(
              (definition) => definition.pattern
            )
          )

          report.reportInfo(MessageName.UNNAMED, inspect(diagnostics, false, 5))
        })
      })

    return commandReport.exitCode()
  }
}
