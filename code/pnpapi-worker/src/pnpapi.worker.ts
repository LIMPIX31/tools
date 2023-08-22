import { runWorker } from '@lmpx-code/worker-utils'
import { getContent } from './pnpapi.worker.content'

export async function resolveRequest(request: string, issuer: string | null, opts?: {considerBuiltins?: boolean, extensions?: string[]}): Promise<string | null> {
	return runWorker(getContent(), {
		action: 'resolveRequest',
		args: [request, issuer, opts]
	})
}
