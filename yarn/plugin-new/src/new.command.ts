import { BaseCommand } from '@yarnpkg/cli'
import { Option } from 'clipanion'

export class NewCommand extends BaseCommand {
	static paths = [['new']]

	template = Option.String({ required: true })

	async execute() {
		const template = await fetch(this.template)
	}
}
