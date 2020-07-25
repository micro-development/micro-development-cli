import {Command, flags} from '@oclif/command'
import { green, red, yellow } from 'chalk'
import { CloneCommand } from '../git/CloneCommand'
import { Msg, CommandMsg } from '../message'

export default class Install extends Command {
  static description = Msg[CommandMsg.DescriptionInstall]

  static aliases = ['i']

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'name to print'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    await this.gitClone()
  }

  async gitClone() {
    const gitCommand = new CloneCommand()
    await gitCommand.start(Object.keys(gitCommand.packageInfo.dependencies))
  }
}
