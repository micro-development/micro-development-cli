import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import {choosePackageKey} from '../util'
import { red, yellow, green } from 'chalk'
import { CommitCommand } from '../git/CommitCommand'
import { Msg, CommitMsg, CommandMsg } from '../message'

export default class Commit extends Command {
  static description = Msg[CommandMsg.DescriptionCommit]

  static aliases = ['c']

  static flags = {
    help: flags.help({char: 'h'}),
    packageKey: flags.string({char: 'k', description: 'packageKey'}),
    commitContent: flags.string({char: 'k', description: 'commitContent'})
  }

  static args = [
      {name: 'packageKey'},
      {name: 'commitContent'}
    ]

  private inputPackageKey: string = ''
  private inputCommitContent: string = ''

  async run() {
    await this.checkParams()
  }

  async checkParams() {
    const {args, flags} = this.parse(Commit)
    const packageKey = args.packageKey || flags.packageKey
    const commitContent = args.commitContent || flags.commitContent
    const gitCommand = new CommitCommand()
    if (gitCommand.checkPackageGlobalLock() !== true) {
      return
    }
    if (packageKey) {
      this.inputPackageKey = packageKey
      if (commitContent) {
        this.inputCommitContent = commitContent
        await gitCommand.run({
          curPackageKey: this.inputPackageKey,
          commitContent: this.inputCommitContent
        })
      } else {
        await this.enterCommitContent()
      }
    } else {
      const chooseKeyList = await choosePackageKey(gitCommand.packageInfo, {
        message: Msg[CommitMsg.InquirerMessageChooseKey],
        suffix: Msg[CommitMsg.InquirerSuffixChooseKey],
        selectType: 'rawlist'
      })
      if (chooseKeyList !== false) {
        this.inputPackageKey = (chooseKeyList as string)
        await this.enterCommitContent()
      }
    }
  }

  /**
   * 输入需要提交的内容
   */
  async enterCommitContent() {
    const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'inputCommitContent',
          message: '请输入git提交内容：',
          suffix: yellow('（git commit）'),
          validate: (val) => {
            if (!val) {
              console.log(red('\ngit commit content is requried'))
              return false
            }
            return true
          }
        }
    ])
    const gitCommand = new CommitCommand()
    await gitCommand.run({
      curPackageKey: this.inputPackageKey,
      commitContent: answer.inputCommitContent
    })
  }
}
