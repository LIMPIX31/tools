import React from 'react'
import { BaseCommand } from '@yarnpkg/cli'
import { Option } from 'clipanion'
import { Configuration, MessageName, Project, StreamReport } from '@yarnpkg/core'
import { access } from 'node:fs/promises'
import * as rimraf from 'rimraf'
import { build } from '@lmpx-code/typescript-worker'
import { PortablePath, ppath, xfs } from '@yarnpkg/fslib'
import { renderStatic } from '@lmpx-cli/renderer'
import { TypescriptDiagnostic } from '@lmpx-cli/typescript-diagnostic-component'
import { join } from 'node:path'

export class LibBuildCommand extends BaseCommand {
  static paths = [['lib', 'build']]

  target = Option.String('-t,--target', './dist')

  format = Option.String({ required: false })

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        const tsconfigPath = ppath.join(project.cwd, 'tsconfig.json')

        if (!await xfs.existsPromise(tsconfigPath)) {
          report.reportError(MessageName.UNNAMED, 'Tsconfig is not exists')
          return
        }

        const tsconfig = await xfs.readFilePromise(tsconfigPath, 'utf8').then(JSON.parse)

        await this.cleanTarget()

        await report.startTimerPromise('Building', async () => {
          const module: any = this.format
            ?.replaceAll('cjs', 'commonjs')
            ?.replaceAll('esm', 'esnext')
            ?? 'esnext'

          const diagnostics = await build({
            cwd: project.cwd,
            include: [join(this.context.cwd, './src')],
            overrides: {
              module,
              outDir: join(this.context.cwd, this.target as PortablePath),
            },
            tsconfig,
          })

          diagnostics.forEach((diagnostic) => {
            const output = renderStatic(<TypescriptDiagnostic diagnostic={diagnostic} project={project} />)

            output.split('\n').forEach((line) => report.reportError(MessageName.UNNAMED, line))
          })
        })
      },
    )

    return commandReport.exitCode()
  }

  protected async cleanTarget() {
    try {
      await access(this.target)

      rimraf.sync(this.target)
      // eslint-disable-next-line no-empty
    } catch {}
  }
}
