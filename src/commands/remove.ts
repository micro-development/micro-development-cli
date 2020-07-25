import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import {getPackageInfo, updatePackageInfo, choosePackageKey} from '../util'
import { red, yellow, green } from 'chalk'
import { GitCommand } from '../git/GitCommand'
import { Msg, RemoveMsg, CommandMsg } from '../message'

export default class Remove extends Command {
  static description = Msg[CommandMsg.DescriptionRemove]

  static aliases = ['r']

  static flags = {
    help: flags.help({char: 'h'}),
    packageKey: flags.string({char: 'k', description: 'all or packageKey'})
  }

  static args = [{name: 'packageKey'}]

  async run() {
    await this.checkParams()
  }

  async checkParams() {
    const {args, flags} = this.parse(Remove)
    const packageKey = args.packageKey || flags.packageKey
    const gitCommand = new GitCommand()
    const packageInfo = gitCommand.packageInfo
    if (packageKey) {
      if (gitCommand.setGitRepoInfo(packageKey) !== false && gitCommand.checkGitRepoDirStatus() !== false) {
        delete packageInfo.dependencies[packageKey]
        updatePackageInfo(packageInfo).then(() => {
          console.log(Msg[RemoveMsg.UpdateConfigFileSuccess]([]))
        }).catch(() => {
          console.log(Msg[RemoveMsg.UpdateConfigFileFail]([]))
        })
      }
    } else {
      const chooseKeyList = await choosePackageKey(packageInfo, {
        message: Msg[RemoveMsg.InquirerMessageChooseKey],
        suffix: Msg[RemoveMsg.InquirerSuffixChooseKey],
        selectType: 'checkbox'
      })
      if (chooseKeyList !== false) {
        (chooseKeyList as []).forEach((itemKey: string) => {
          delete packageInfo.dependencies[itemKey]
        })
        updatePackageInfo(packageInfo).then(() => {
          console.log(Msg[RemoveMsg.UpdateConfigFileSuccess](chooseKeyList))
        }).catch(() => {
          console.log(Msg[RemoveMsg.UpdateConfigFileFail](chooseKeyList))
        })
      }
    }
  }
}
