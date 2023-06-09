import { BaseCommand, WorkspaceRequiredError } from '@yarnpkg/cli'
import { Configuration, Project, StreamReport, structUtils } from '@yarnpkg/core'
import { Option } from 'clipanion'
import { getChangedFiles } from '@lmpx/yarn-plugin-files'
import { getChangedWorkspaces } from '@lmpx/yarn-workspace-utils'

class WorkspacesChangedListCommand extends BaseCommand {
  static paths = [['workspaces', 'changed', 'list']]

  json = Option.Boolean('--json', false)

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    if (!workspace) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd)
    }

    const report = await StreamReport.start(
      {
        configuration,
        json: this.json,
        stdout: this.context.stdout,
      },
      async (report) => {
        const files = await getChangedFiles(project)
        const workspaces = getChangedWorkspaces(project, files)

        for (const ws of workspaces) {
          report.reportInfo(null, ws.relativeCwd)
          report.reportJson({
            name: ws.manifest.name ? structUtils.stringifyIdent(ws.manifest.name) : null,
            location: ws.relativeCwd,
          })
        }
      },
    )

    return report.exitCode()
  }
}

export { WorkspacesChangedListCommand }
