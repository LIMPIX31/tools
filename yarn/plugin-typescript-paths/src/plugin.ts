import type { Plugin, Project } from '@yarnpkg/core'
import { formatUtils, MessageName, structUtils } from '@yarnpkg/core'
import type { InstallOptions } from '@yarnpkg/core/lib/Project'
import { ppath, xfs } from '@yarnpkg/fslib'

export const plugin: Plugin = {
	hooks: {
		async afterAllInstalled(project: Project, { report }: InstallOptions) {
			const rootWorkspace = project.tryWorkspaceByCwd(project.cwd)

			if (!rootWorkspace) {
				return
			}

			const options = rootWorkspace.manifest.raw['typescriptWorkspaces']

			if (!options || !options['enabled']) {
				return
			}

			await report.startTimerPromise('Sync workspaces', async () => {
				const tspacePath = ppath.join(project.cwd, 'tsconfig.json')

				if (!(await xfs.existsPromise(tspacePath))) {
					return
				}

				const artifactsPath = ppath.join(project.cwd, '.yarn', 'artifacts')

				if (!(await xfs.existsPromise(artifactsPath))) {
					await xfs.mkdirPromise(artifactsPath)
				}

				const workspaces = project.workspaces.filter(
					(ws) => ws.cwd !== project.cwd && ws.manifest.name?.scope !== 'private',
				)

				try {
					const tsworkspaces = await xfs.readFilePromise(tspacePath, 'utf8').then(JSON.parse)

					if (!rootWorkspace) {
						return
					}

					const previousPaths = Object.keys(tsworkspaces.compilerOptions.paths ?? {})

					tsworkspaces.compilerOptions.paths = {}
					const { paths } = tsworkspaces.compilerOptions

					const added: string[] = []

					workspaces.forEach(
						({
							relativeCwd,
							manifest: {
								name,
								main,
								raw: { exports = {} },
							},
						}) => {
							if (name) {
								const stringifiedName = structUtils.stringifyIdent(name)
								paths[stringifiedName] = [relativeCwd]
								const customs = Object.entries(exports) as Array<[string, string]>

								if (!previousPaths.includes(stringifiedName)) {
									added.push(stringifiedName)
								}

								customs.forEach(([sub, path]) => {
									const exportsName = `${stringifiedName}/${sub.replaceAll('./', '')}`
									paths[exportsName] = [ppath.join(relativeCwd, path as any)]
								})
							}
						},
					)

					const actualPaths = Object.keys(paths)

					const removed = previousPaths.filter((path) => !actualPaths.includes(path))

					added.forEach((item) => {
						report.reportInfo(MessageName.UNNAMED, formatUtils.pretty(project.configuration, `+ ${item}`, 'ADDED'))
					})

					removed.forEach((item) => {
						report.reportInfo(MessageName.UNNAMED, formatUtils.pretty(project.configuration, `- ${item}`, 'REMOVED'))
					})

					await xfs.writeFilePromise(tspacePath, `${JSON.stringify(tsworkspaces, null, 2)}\n`)
				} catch (e: any) {
					report.reportError(
						MessageName.UNNAMED,
						`Invalid or missing tsconfig. Cause: ${e.message}`,
					)
				}

				if (options['artifacts']) {
					try {
						await xfs.writeFilePromise(
							ppath.join(artifactsPath, 'workspaces.json'),
							JSON.stringify(workspaces.map(({ manifest }) => structUtils.stringifyIdent(manifest.name!))),
						)
					} catch (e) {
						report.reportError(MessageName.UNNAMED, 'Failed to create workspaces json list')
					}
				}
			})
		},
	},
}
