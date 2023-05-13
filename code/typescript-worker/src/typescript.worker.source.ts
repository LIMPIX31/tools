import { parentPort, workerData } from 'node:worker_threads'
import { parse, stringify } from 'flatted'
import * as ts from '@lmpx-code/typescript'

const { options, method = 'run' } = workerData

switch (method) {
  case 'run': parentPort!.postMessage(parse(stringify(ts.run(options))))
    break
  case 'declaration': parentPort!.postMessage(parse(stringify(ts.declaration(options))))
    break
}
