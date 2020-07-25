import { echo, exec, test } from 'shelljs'
import { red, yellow, green } from 'chalk'
import { GitCommand } from './GitCommand'
import { GitInterface } from './GitInterface'
import { InitParams } from '../interface'
import { Msg, GitMsg } from '../message'


export class StatusCommand extends GitCommand implements GitInterface {
    constructor(packageInfo?: InitParams) {
        super(packageInfo)
    }

    successNum = 0;
    errorNum = 0;

    async start(keyList: string[]) {
        console.log(Msg[GitMsg.StatusStartByAll])
        keyList.forEach(async (packageKey) => {
            if (this.setGitRepoInfo(packageKey) !== false && this.checkGitRepoDirStatus() !== false) {
                await this.run()
            }
        })
        console.log(Msg[GitMsg.StatusStartEnd](keyList.length, this.successNum, this.errorNum))
    }

    async run() {
        console.log(Msg[GitMsg.StatusStartByCur](this.curPackageKey))
        const result = exec(`git -C ${this.repoDir} status`)
        if (result.code === 0) {
            this.successNum += 1
            console.log(Msg[GitMsg.StatusSuccessByCur](this.curPackageKey))
        } else {
            this.errorNum += 1
            console.log(Msg[GitMsg.StatusFailByCur](this.curPackageKey, result.code))
        }
    }
}
