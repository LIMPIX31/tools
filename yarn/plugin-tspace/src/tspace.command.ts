import { BaseCommand } from '@yarnpkg/cli'
import { Configuration, MessageName, Project, StreamReport } from '@yarnpkg/core'
import { xfs, ppath } from '@yarnpkg/fslib'

export class TspaceCommand extends BaseCommand {
  static paths = [['tspace']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const tspacePath = ppath.join(this.context.cwd, 'tsconfig.json')

    const commandReport = await StreamReport.start({
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Update tsconfig workspaces', async () => {
          try {
            const tsworkspaces = await xfs.readFilePromise(tspacePath, 'utf8').then(JSON.parse)

            tsworkspaces.compilerOptions.paths = {}
            const { paths } = tsworkspaces.compilerOptions

            project.workspaces.filter(ws => ws.cwd !== this.context.cwd).forEach(({ relativeCwd, manifest: { name } })=> {
              if (name) {
                const fullName = name.scope ? `@${name.scope}/${name.name}` : name.name

                report.reportInfo(MessageName.UNNAMED, `Link ${fullName} -> ${relativeCwd}`)

                paths[fullName] = [relativeCwd]
              }
            })

            await xfs.writeFilePromise(tspacePath, `${JSON.stringify(tsworkspaces, null, 2)}\n`)
          } catch (e: any) {
            report.reportError(MessageName.UNNAMED, e.message)
          }
        })
      },
    )

    return commandReport.exitCode()
  }
}
