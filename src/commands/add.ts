import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import {InitParams, PackageConfig} from '../interface'
import { checkCurPackageIsExist, getPackageInfo, getPackageKey, updatePackageInfo } from '../util'
import { green, red, yellow } from 'chalk'
import { Msg, AddMsg, CommandMsg } from '../message'
const js_beautify = require('js-beautify').js_beautify
const fs  = require('fs');

export default class Add extends Command {
  static description = Msg[CommandMsg.DescriptionAdd]

  static aliases = ['a']

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'name to print'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'packageKey'}]
  private packageKey: string = ''

  private configData: PackageConfig = {
    gitRepoName: '',
    gitBranchName: '',
    lock: false
  }


  async test() {
    const {args, flags} = this.parse(Add)
    this.log('args', args)
    this.log('flags', flags)
  }


  async run() {
    // const parsePackageKey = this.customParse()
    await this.choicesType()
  }

  /**
   * 选择采用全局git空间，还是自定义其他git远端
   */
  async choicesType() {
    const answer = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'choiceType',
        message: Msg[AddMsg.InquirerMessageChoiceType],
        suffix: Msg[AddMsg.InquirerSuffixChoiceType],
        choices: [
          {
            name: Msg[AddMsg.InquirerChoiceTypeByDefault],
            value: 'default'
          },
          {
            name: Msg[AddMsg.InquirerChoiceTypeByCustom],
            value: 'custom'
          }
        ]
      }
    ])
    if (answer.choiceType === 'default') {
      await this.defaultConfig()
    }
    if (answer.choiceType === 'custom') {
      await this.customConfig()
    }
  }

  /**
   * 采用默认全局空间配置
   */
  async defaultConfig() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'gitNamespace',
        message: Msg[AddMsg.InquirerMessageGitNamespace],
        suffix: Msg[AddMsg.InquirerSuffixGitNamespace],
        validate: (val) => {
          // if (!val) {
          //   console.log(red('\ngitRepoName is requried'))
          //   return false
          // }
          return true
        }
      },
      {
        type: 'input',
        name: 'gitRepoName',
        message: Msg[AddMsg.InquirerMessageGitRepoName],
        suffix: Msg[AddMsg.InquirerSuffixGitRepoName],
        validate: (val) => {
          if (!val) {
            console.log(Msg[AddMsg.InquirerValidateGitRepoName])
            return false
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'gitBranchName',
        message: Msg[AddMsg.InquirerMessageGitBranchName],
        suffix: Msg[AddMsg.InquirerSuffixGitBranchName],
        default: 'master',
        validate: (val) => {
          if (!val) {
            console.log(Msg[AddMsg.InquirerValidateGitBranchName])
            return false
          }
          return true
        }
      },
      {
        type: 'confirm',
        name: 'lock',
        message: Msg[AddMsg.InquirerMessageLock],
        suffix: Msg[AddMsg.InquirerSuffixLock],
        default: false
      }
    ])
    if (answers.gitNamespace) {
      this.configData.gitNamespace = answers.gitNamespace
    }
    this.configData.gitRepoName = answers.gitRepoName
    this.configData.gitBranchName = answers.gitBranchName
    this.configData.lock = answers.lock
    await this.writeConfig(false)
  }

  /**
   * 采用自定义其他git远端配置
   */
  async customConfig() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'gitUrl',
        message: Msg[AddMsg.InquirerMessageGitUrl],
        suffix: Msg[AddMsg.InquirerSuffixGitUrl],
        validate: (val) => {
          if (!val) {
            console.log(Msg[AddMsg.InquirerValidateGitUrl])
            return false
          }
          if ((val.indexOf('git@') !== 0 && val.indexOf('http') !== 0) || val.indexOf('.git') + 4 !== val.length) {
            console.log(Msg[AddMsg.InquirerValidateGitUrlByFormat])
            return false
          }
          return true
        }
      },
      // {
      //   type: 'input',
      //   name: 'gitRepoName',
      //   suffix: yellow('（sample：username@repo）'),
      //   validate: (val) => {
      //     if (!val) {
      //       console.log(red('\ngitRepoName is requried'))
      //       return false
      //     }
      //     return true
      //   }
      // },
      {
        type: 'input',
        name: 'gitBranchName',
        message: Msg[AddMsg.InquirerMessageGitBranchName],
        suffix: Msg[AddMsg.InquirerSuffixGitBranchName],
        default: 'master',
        validate: (val) => {
          if (!val) {
            console.log(Msg[AddMsg.InquirerValidateGitBranchName])
            return false
          }
          return true
        }
      },
      {
        type: 'confirm',
        name: 'lock',
        message: Msg[AddMsg.InquirerMessageLock],
        suffix: Msg[AddMsg.InquirerSuffixLock],
        default: false
      }
    ])
    this.configData.gitUrl = answers.gitUrl
    if (answers.gitUrl.indexOf('git@') === 0) {
      this.configData.gitRepoName = answers.gitUrl.replace('git@', '').replace('.git', '').replace(':', '@').replace(/\//g, '@')
    } else {
      this.configData.gitRepoName = answers.gitUrl.replace(/http(s)?:\/\//, '').replace('.git', '').replace(/\//g, '@')
    }
    this.configData.gitBranchName = answers.gitBranchName
    this.configData.lock = answers.lock
    await this.writeConfig(true)
  }

  /**
   * 如果用户直接增加了参数，直接进行解析
   */
  async customParse() {
    const {args, flags} = this.parse(Add)
    let path = args.packageKy || flags.name
    if (!path) {
      return false
    }
    return path.includes('#') ? path : `${path}#master`
  }

  /**
   * 检测当前安装的包/仓库是否已存在
   */
  async checkPackageIsExist() {
    if (await checkCurPackageIsExist(this.packageKey) === true) {
      return false
    }
    const packageInfo: InitParams = await getPackageInfo()
    // packageInfo.dependencies[this.packageKey] = this.configData
    return packageInfo
  }

  /**
   * 执行安装
   */
  async writeConfig(isCustom: boolean) {
    const result = await this.checkPackageIsExist()
    if (result !== false) {
      this.log(green('✅ 开始安装...'))
      if (isCustom) {
        delete this.configData.gitRepoName
        delete this.configData.gitBranchName
      }
      this.packageKey = getPackageKey(this.configData, result.packageKeySplit)
      result.dependencies[this.packageKey] = this.configData
      updatePackageInfo(result).then(() => {
        console.log(Msg[AddMsg.UpdateConfigFileSuccess])
      }).catch(() => {
        console.log(Msg[AddMsg.UpdateConfigFileFail])
      })
    } else {
      this.log(red('❌ 该仓库存在！'))
    }
  }
}
