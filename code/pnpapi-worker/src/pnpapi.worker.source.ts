import { parentPort, workerData } from 'node:worker_threads'

const { action = 'resolveRequest', args } = workerData

const pnpapi = require('pnpapi')

switch (action) {
	case 'resolveRequest':
		parentPort?.postMessage(pnpapi.resolveRequest(...args))
		break
	default:
		throw new Error('Unknown action')
}
