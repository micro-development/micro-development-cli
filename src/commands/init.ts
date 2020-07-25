import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as inquirer from 'inquirer'
import { InitParams, ConfigInfo } from '../interface'
import { blue, gray, green, red, yellow } from 'chalk'
import { pwd } from 'shelljs'
import { InitMsg, Msg, CommandMsg } from '../message'
const js_beautify = require('js-beautify').js_beautify
const fs  = require('fs');
const config: ConfigInfo = require('../config.json')
const configFile = config.configFile

export default class Init extends Command {
  static description = Msg[CommandMsg.DescriptionInit]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
    bool: flags.boolean({
      char: 'b'
    })
  }

  static args = [{name: 'file'}]

  private configData: InitParams = {
    name: '',
    description: '',
    author: '',
    targetDir: '',
    gitHost: '',
    gitNamespace: '',
    dependencies: {},
    lock: false
  }

  async run() {
    if (!this.checkExistInit()) {
      console.log(Msg[InitMsg.NotExist])
      this.createInit()
    } else {
      console.log(Msg[InitMsg.IsExist])
    }
  }

  checkExistInit() {
    return fs.existsSync(configFile)
  }

  async writeConfigFile() {
    const data = js_beautify(JSON.stringify(this.configData), {
      indent_size: 2
    })
    fs.writeFile(`${configFile}`, data, (err: any) => {
      if (err) {
        this.log(Msg[InitMsg.CreateFail], err)
      } else {
        this.log(Msg[InitMsg.CreateSuccess])
      }
    });
  }

  async createInit() {
    await this.setPrompt();
  }

  async getParams() {
    const {flags} = this.parse(Init)
    this.log('getParams flags', flags, Init.flags)
  }

  async setPrompt() {
    const path = pwd();
    // console.log(path.stdout);
    let name = ''
    if (path.stdout !== '/') {
      const pathArr = path.split('/')
      name = pathArr[pathArr.length - 1]
    }
    inquirer.prompt([
      {
        type: 'input',
        default: name,
        name: 'name',
        message: Msg[InitMsg.InquirerMessageName],
        validate: (val) => {
          if (!val) {
            console.log(Msg[InitMsg.InquirerValidateName])
            return false
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'description',
        message: Msg[InitMsg.InquirerMessageDescription],
        validate: (val) => {
          if (!val) {
            console.log(Msg[InitMsg.InquirerValidateDescription])
            return false
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'author',
        message: Msg[InitMsg.InquirerMessageAuthor],
        validate: (val) => {
          if (!val) {
            console.log(Msg[InitMsg.InquirerValidateAuthor])
            return false
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'targetDir',
        message: Msg[InitMsg.InquirerMessageTargetDir],
        suffix: Msg[InitMsg.InquirerSuffixTargetDir],
        default: 'src/base-resource',
        validate: (val) => {
          if (!val) {
            console.log(Msg[InitMsg.InquirerValidateTargetDir])
            return false
          }
          if (val.indexOf('/') === 0) {
            console.log(Msg[InitMsg.InquirerValidateTargetDirByRootPath])
            return false
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'gitHost',
        message: Msg[InitMsg.InquirerMessageGitHost],
        suffix: Msg[InitMsg.InquirerSuffixGitHost],
        validate: (val) => {
          if (!val) {
            console.log(Msg[InitMsg.InquirerValidateGitHost])
            return false
          }
          if (val.indexOf('git@') !== 0 && val.indexOf('http') !== 0) {
            console.log(Msg[InitMsg.InquirerValidateGitHost])
            return false
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'gitNamespace',
        message: Msg[InitMsg.InquirerMessageGitNamespace],
        suffix: Msg[InitMsg.InquirerSuffixGitNamespace],
        validate: (val) => {
          if (!val) {
            console.log(Msg[InitMsg.InquirerValidateGitNamespace])
            return false
          }
          return true
        }
      },
      {
        type: 'confirm',
        name: 'lock',
        message: Msg[InitMsg.InquirerMessageLock],
        suffix: Msg[InitMsg.InquirerSuffixLock],
        default: false
      }
    ]).then(answers => {
      // console.log('inquirer answers', answers);
      this.configData.name = answers.name
      this.configData.description = answers.description
      this.configData.author = answers.author
      this.configData.targetDir = answers.targetDir
      this.configData.gitHost = answers.gitHost
      this.configData.gitNamespace = answers.gitNamespace
      this.configData.dependencies = {};
      this.configData.lock = answers.lock
      this.writeConfigFile()
    }).catch(e => {
      console.log('inquirer e', e);
    });
  }
}
