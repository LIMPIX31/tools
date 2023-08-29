import { createLogger, defineConfig } from 'vite'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { Options, transform } from '@swc/core'
import deepmerge from 'deepmerge'

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

	const swcOptions = options['swc'] ?? {}
	const testOptions = options['test'] ?? {}

	return ({
		test: deepmerge(
			{
				globals: true,
				root: process.cwd(),
				include: [
					'integration/**/*.{test,spec}.?(c|m)[jt]s?(x)',
					'__tests__**/*.{test,spec}.?(c|m)[jt]s?(x)',
					'tests/**/*.{test,spec}.?(c|m)[jt]s?(x)',
					'unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'
				],
				includeSource: ['**/*.?(c|m)[jt]s?(x)']
			},
			testOptions
		),

		plugins: [{
			name: 'swc',

			enforce: 'pre',

			async transform(code, id) {
				const result = await transform(code, deepmerge(
					{
						filename: id,
						sourceMaps: true,
						module: {
							type: 'nodenext',
						},
						jsc: {
							parser: {
								syntax: 'typescript',
								decorators: true,
								dynamicImport: true,
							},
							transform: {
								decoratorMetadata: true,
							},
							target: 'esnext',
						},
						minify: false,
					},
					swcOptions,
				) as Options)

				return {
					code: result.code,
					map: result.map && JSON.parse(result.map),
				}
			},
		}],
		esbuild: false,
	})
})
