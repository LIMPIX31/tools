import { BaseCommand } from '@yarnpkg/cli'
import { Option } from 'clipanion'

export class SelfUpdateCommand extends BaseCommand {
  static paths = [['self', 'update']]

  version = Option.String({ required: false })

  async execute() {
    await this.cli.run(['set', 'version', `https://github.com/LIMPIX31/tools/raw/${this.version ?? 'master'}/yarn/cli/bundles/yarn.js`])
  }
}
