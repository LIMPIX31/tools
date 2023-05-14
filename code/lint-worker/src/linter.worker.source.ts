import { parentPort, workerData } from 'node:worker_threads'
import { lint } from '@lmpx-code/lint'

lint(workerData.cwd, workerData.files).then((results) => parentPort!.postMessage(results))
