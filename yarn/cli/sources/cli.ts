import { npath, ppath } from '@yarnpkg/fslib'
import { runExit } from '@yarnpkg/cli'
import { getPluginConfiguration } from './tools'

runExit(process.argv.slice(2), {
	cwd: ppath.cwd(),
	selfPath: npath.toPortablePath(npath.resolve(process.argv[1])),
	pluginConfiguration: getPluginConfiguration(),
})
