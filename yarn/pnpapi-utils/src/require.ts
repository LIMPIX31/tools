import type { Configuration, Report } from '@yarnpkg/core'
import { formatUtils, MessageName, structUtils } from '@yarnpkg/core'
import { resolveRequest } from '@lmpx-code/pnpapi-worker'

export async function requireAndReport<const T extends string>(configuration: Configuration, report: Report, idents: T[], issuer = process.cwd()) {
	const failed: string[] = []

	const result = await Promise.all(idents.map(async (ident) => {
		try {
			const resolved = await resolveRequest(ident, issuer)

			if (!resolved) {
				failed.push(ident)
			}

			return [ident, resolved]
		} catch (e) {
			failed.push(ident)
		}
	})).then(result => result.filter(Boolean) as [string, string][])

	if (failed.length > 0) {
		report.reportError(MessageName.UNNAMED, 'Following packages are required but cannot be resolved')
		failed.forEach((ident) => {
			report.reportError(MessageName.UNNAMED, formatUtils.pretty(configuration, structUtils.parseIdent(ident), 'IDENT'))
		})
	}

	return [failed.length === 0, Object.fromEntries(result) as Record<T, string>]
}
