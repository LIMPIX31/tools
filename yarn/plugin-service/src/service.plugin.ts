import { Plugin }            from '@yarnpkg/core'

import { ServiceDevCommand } from './service-dev.command'

export const plugin: Plugin = {
  commands: [ServiceDevCommand],
}
