import { parentPort, workerData } from 'node:worker_threads'
import { parse, stringify } from 'flatted'
import { check } from '@lmpx/code-typescript'

const { cwd, include } = workerData

check(cwd, include).then((diagnostics) => parentPort!.postMessage(parse(stringify(diagnostics))))
