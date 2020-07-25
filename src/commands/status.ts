import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import { echo, exec, test } from 'shelljs'
import {getPackageInfo, choosePackageKey} from '../util'
import { red, yellow, green } from 'chalk'
import { StatusCommand } from '../git/StatusCommand'
import { Msg, StatusMsg, CommandMsg } from '../message'

export default class Status extends Command {
  static description = Msg[CommandMsg.DescriptionStatus]

  static aliases = ['s']

  static flags = {
    help: flags.help({char: 'h'}),
    packageKey: flags.string({char: 'k', description: 'all or packageKey'})
  }

  static args = [{name: 'packageKey'}]

  async run() {
    await this.checkParams()
  }

  async checkParams() {
    const {args, flags} = this.parse(Status)
    const packageKey = args.packageKey || flags.packageKey
    const gitCommand = new StatusCommand()
    if (packageKey) {
      if (packageKey === 'all') {
        await gitCommand.start(Object.keys(gitCommand.packageInfo.dependencies))
      } else {
        await gitCommand.start([packageKey])
      }
    } else {
      const chooseKeyList = await choosePackageKey(gitCommand.packageInfo, {
        message: Msg[StatusMsg.InquirerMessageChooseKey],
        suffix: Msg[StatusMsg.InquirerSuffixChooseKey],
        selectType: 'checkbox'
      })
      if (chooseKeyList !== false) {
        await gitCommand.start((chooseKeyList as []))
      }
    }
  }
}
