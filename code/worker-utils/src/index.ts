import { join } from 'node:path'
import { Worker } from 'node:worker_threads'

function getPnpPath() {
  return process.versions.pnp
    ? require('module').findPnpApi(__filename).resolveRequest('pnpapi', null)
    : join(process.cwd(), '.pnp.cjs')
}

function createWorker(content: string, workerData: object) {
  return new Worker(content, {
    eval: true,
    execArgv: ['--require', getPnpPath(), ...process.execArgv],
    workerData,
  })
}

export async function runWorker<T>(content: string, workerData: object): Promise<T> {
  return new Promise((resolve, reject) => {
    const worker = createWorker(content, workerData)

    const exitHandler = (code: number) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
    }

    worker.once('message', (result) => {
      worker.off('error', reject)
      worker.off('exit', exitHandler)

      resolve(result)
    })

    worker.once('error', reject)
    worker.once('exit', exitHandler)
  })
}

export async function watchWorker(content: string, workerData: object, onMessage) {
  return new Promise((resolve, reject) => {
    const worker = createWorker(content, workerData)

    const exitHandler = (code: number) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      } else {
        resolve(null)
      }
    }

    worker.on('message', onMessage)

    worker.once('error', reject)
    worker.once('exit', exitHandler)
  })
}
