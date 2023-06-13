import { MessageName, Plugin, Project, structUtils } from '@yarnpkg/core'
import { TspaceCommand } from './tspace.command'
import { ppath, xfs } from '@yarnpkg/fslib'
import type { InstallOptions } from '@yarnpkg/core/lib/Project'

export const plugin: Plugin = {
  commands: [TspaceCommand],
  hooks: {
    async afterAllInstalled(project: Project, { report }: InstallOptions) {
      const tspacePath = ppath.join(project.cwd, 'tsconfig.json')

      if (!await xfs.existsPromise(tspacePath)) {
        return
      }

      try {
        const tsworkspaces = await xfs.readFilePromise(tspacePath, 'utf8').then(JSON.parse)

        const rootWorkspace = project.tryWorkspaceByCwd(project.cwd)

        if (!rootWorkspace) {
          return
        }

        if (!rootWorkspace.manifest.raw['tsconfigWorkspaces']) {
          return
        }

        tsworkspaces.compilerOptions.paths = {}
        const { paths } = tsworkspaces.compilerOptions

        project.workspaces.filter(ws => ws.cwd !== project.cwd).forEach(({ relativeCwd, manifest: { name } })=> {
          if (name) {
            paths[structUtils.stringifyIdent(name)] = [relativeCwd]
          }
        })

        await xfs.writeFilePromise(tspacePath, `${JSON.stringify(tsworkspaces, null, 2)}\n`)
      } catch (e: any) {
        report.reportError(MessageName.UNNAMED, e.message)
      }
    }
  }
}
