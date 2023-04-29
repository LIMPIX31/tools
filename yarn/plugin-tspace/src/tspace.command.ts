import { BaseCommand } from '@yarnpkg/cli'
import { Configuration, MessageName, Project, StreamReport } from '@yarnpkg/core'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { defaultConfig } from './tspace.constants'

export class TspaceCommand extends BaseCommand {
  static paths = [['tspace']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const tspacePath = join(this.context.cwd, 'tsconfig.workspaces.json')

    const commandReport = await StreamReport.start({
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Update tsconfig workspaces', async () => {
          try {
            if (!existsSync(tspacePath)) {
              await writeFile(tspacePath, JSON.stringify(defaultConfig, null, 2))
            }

            const tsworkspaces = await readFile(tspacePath).then(result => JSON.parse(result.toString()))

            tsworkspaces.compilerOptions.paths ??= {}
            const paths = tsworkspaces.compilerOptions.paths

            project.workspaces.filter(ws => ws.cwd !== this.context.cwd).forEach(({ relativeCwd, manifest: { name } })=> {
              if (name) {
                const fullName = name.scope ? `@${name.scope}/${name.name}` : name.name

                report.reportInfo(MessageName.UNNAMED, `Link ${fullName} -> ${relativeCwd}`)

                paths[fullName] = [relativeCwd]
              }
            })

            await writeFile(tspacePath, JSON.stringify(tsworkspaces, null, 2))
          } catch (e: any) {
            report.reportError(MessageName.UNNAMED, e.message)
          }
        })
      },
    )

    return commandReport.exitCode()
  }
}
