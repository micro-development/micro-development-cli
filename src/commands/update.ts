import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import { echo, exec, test } from 'shelljs'
import {getPackageInfo, choosePackageKey} from '../util'
import { red, yellow, green } from 'chalk'
import { PullCommand } from '../git/PullCommand'
import { Msg, UpdateMsg, CommandMsg } from '../message'

export default class Update extends Command {
  static description = Msg[CommandMsg.DescriptionUpdate]

  static aliases = ['u']

  static flags = {
    help: flags.help({char: 'h'}),
    packageKey: flags.string({char: 'k', description: 'all or packageKey'})
  }

  static args = [{name: 'packageKey'}]

  async run() {
    await this.checkParams()
  }

  async checkParams() {
    const {args, flags} = this.parse(Update)
    const packageKey = args.packageKey || flags.packageKey
    const gitCommand = new PullCommand()
    if (packageKey) {
      if (packageKey === 'all') {
        await gitCommand.start(Object.keys(gitCommand.packageInfo.dependencies))
      } else {
        await gitCommand.start([packageKey])
      }
    } else {
      const chooseKeyList = await choosePackageKey(gitCommand.packageInfo, {
        message: Msg[UpdateMsg.InquirerMessageChooseKey],
        suffix: Msg[UpdateMsg.InquirerSuffixChooseKey],
        selectType: 'checkbox'
      })
      if (chooseKeyList !== false) {
        await gitCommand.start((chooseKeyList as []))
      }
    }
  }
}
