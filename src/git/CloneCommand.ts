import { echo, exec, test } from 'shelljs'
import { red, yellow, green } from 'chalk'
import { GitCommand } from './GitCommand'
import { GitInterface } from './GitInterface'
import { InitParams } from '../interface'
import { Msg, GitMsg } from '../message'

export class CloneCommand extends GitCommand implements GitInterface {
    constructor(packageInfo?: InitParams) {
        super(packageInfo)
    }

    successNum = 0;
    errorNum = 0;

    /**
     * git clone,pull,status 支持批量，所以封装到一起
     * @param keyList 安装的包列表
     * @param commandName 执行的 git命令名称
     */
    async start(keyList: string[]) {
        console.log(Msg[GitMsg.InstallStartByAll])
        keyList.forEach(async (packageKey) => {
            if (this.setGitRepoInfo(packageKey) !== false) {
                await this.run()
            }
        })
        console.log(Msg[GitMsg.InstallStartEnd](keyList.length, this.successNum, this.errorNum))
    }

    async run() {
        if (this.isRepoDir) {
            if (this.isGitRepoDir) {
                console.log(Msg[GitMsg.InstallDirIsExist](this.curPackageKey, this.commandInfo.gitUrl, this.repoDir))
                return
            } else {
                console.log(Msg[GitMsg.InstallDirNotGit](this.curPackageKey, this.commandInfo.gitUrl, this.repoDir))
                return
            }
        }
        console.log(Msg[GitMsg.InstallStartByCur](this.commandInfo.gitUrl))
        const result = exec(`git clone --progress -b ${this.commandInfo.gitBranchName} ${this.commandInfo.gitUrl} ${this.repoDir}`)
        if (result.code === 0) {
            this.successNum += 1
            console.log(Msg[GitMsg.InstallSuccessByCur](this.commandInfo.gitUrl))
            // console.log(green(`安装仓库：${this.commandInfo.gitUrl} 成功`))
        } else {
            this.errorNum += 1
            console.log(Msg[GitMsg.InstallFailByCur](this.commandInfo.gitUrl, result.code))
            // console.log(red(`安装仓库：${this.commandInfo.gitUrl} 失败，错误码：${result.code}`))
        }
    }
}
