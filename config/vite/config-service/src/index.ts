import { defineConfig, createLogger } from 'vite'
import { VitePluginNode as node } from 'vite-plugin-node'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

export default defineConfig(async () => {
	const logger = createLogger()

	const cwd = process.cwd()
	const packageJsonPath = join(cwd, 'package.json')

	if (!existsSync(packageJsonPath)) {
		logger.error('No package.json found')
		process.exit(1)
	}

	let packageJson = {}

	try {
		packageJson = await readFile(packageJsonPath).then((json) => JSON.parse(json.toString('utf8')))
	} catch (e) {
		logger.error('Invalid package.json')
		process.exit(1)
	}

	const options = packageJson['service'] ?? {}

	return ({
		server: {
			host: options.host ?? '0.0.0.0',
			port: Number(options.port ?? 80),
		},
		plugins: [
			...node({
				adapter: 'nest',
				appPath: './src/main.ts',
				exportName: 'app',
				tsCompiler: 'swc',
			}),
		],
		optimizeDeps: {
			exclude: options.exclude ?? ['@nestjs/websockets', '@nestjs/microservices', 'class-transformer', '@apollo/subgraph'],
			include: options.include ?? ['./src/main.ts'],
		},
		envPrefix: 'SERVICE',
	})
})
