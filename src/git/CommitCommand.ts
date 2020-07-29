import { echo, exec, test } from 'shelljs'
import { red, yellow, green } from 'chalk'
import { GitCommand } from './GitCommand'
import { GitInterface, CommitOption } from './GitInterface'
import { InitParams } from '../interface'
import { Msg, GitMsg } from '../message'

export class CommitCommand extends GitCommand implements GitInterface {
    constructor(packageInfo?: InitParams) {
        super(packageInfo)
    }

    async start(keyList: string[]) {}

    async run({ curPackageKey, commitContent }: CommitOption) {
        if (curPackageKey && commitContent) {
            if (this.setGitRepoInfo(curPackageKey) !== false && this.checkGitRepoDirStatus() !== false) {
                console.log(Msg[GitMsg.CommitSuccessByCur](curPackageKey))
                const commandList = [
                    `git -C ${this.repoDir} add .`,
                    `git -C ${this.repoDir} commit -m '${commitContent}'`,
                    `git -C ${this.repoDir} pull`,
                    `git -C ${this.repoDir} push`
                ]
                const result = exec(commandList.join(' && '))
                if (result.code === 0) {
                    console.log(Msg[GitMsg.CommitSuccessByCur](curPackageKey))
                } else {
                    console.log(Msg[GitMsg.CommitFailByCur](curPackageKey))
                }
            }
        } else {
            console.log(Msg[GitMsg.CommitFailByParam])
        }
    }
}
