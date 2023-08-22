import { BaseCommand } from '@yarnpkg/cli'
import { Configuration, MessageName, Project, StreamReport } from '@yarnpkg/core'
import React from 'react'
import { Option } from 'clipanion'
import { ErrorInfo } from '@lmpx-cli/error-info-component'
import { ESLintResult } from '@lmpx-cli/eslint-result-component'
import { lint } from '@lmpx-code/lint-worker'
import { renderStatic } from '@lmpx-cli/renderer'

class LintCommand extends BaseCommand {
  static paths = [['lint']]

  files: Array<string> = Option.Rest({ required: 0 })

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Lint', async () => {

          try {
            const results = await lint(project.cwd, this.files)

            // results
            //   .filter((result) => result.messages.length > 0)
            //   .forEach((result) => {
            //     const output = renderStatic(<ESLintResult result={result} project={project}/>)
            //
            //     output.split('\n').forEach((line) => report.reportError(MessageName.UNNAMED, line))
            //   })
          } catch (error) {
            renderStatic(<ErrorInfo error={error as Error}/>, process.stdout.columns - 12)
              .split('\n')
              .forEach((line) => {
                report.reportError(MessageName.UNNAMED, line)
              })
          }
        })
      },
    )

    return commandReport.exitCode()
  }
}

export { LintCommand }
