import * as inquirer from 'inquirer'
import { echo, exec, test } from 'shelljs'
import { red, yellow, green } from 'chalk'
import { getPackageInfo } from '../util'
import { InitParams, PackageConfig } from '../interface'
import { Msg, GitMsg, PackageMsg } from '../message'

/**
 * Git命令封装
 * package：micro-development.json 配置文件的内容，也就是Git配置信息包含安装的各种仓库
 * packageKey: 包的key，也就是安装的仓库标识，和安装到本地的目录名一致
 */
export class GitCommand {
    constructor(packageInfo?: InitParams) {
        if (!packageInfo) {
            this.packageInfo = getPackageInfo()
            this.curPackageKey = ''
            this.setGitInfo()
        } else {
            this.packageInfo = packageInfo
        }
    }

    packageInfo: InitParams = {
        name: '',
        description: '',
        author: '',
        targetDir: '',
        gitHost: '',
        gitNamespace: '',
        packageKeySplit: '',
        dependencies: {},
        lock: false
    }

    /**
     * git protocol
     * ssh or http
     */
    protected protocol: string = '';

    /**
     * ssh协议和http协议，主机和用户名之间的分隔符不一样，需要动态设置
     * ssh: git@github.com:username/repo.git
     * http: https://github.com/username/repo.git
     */
    protected pathSplitStr: string = '';

    /**
     * 当前操作的包
     */
    protected curPackageKey: string = '';

    protected curPackageInfo: PackageConfig = {
        gitUrl: '',
        gitNamespace: '',
        gitRepoName: '',
        gitBranchName: '',
        lock: false
    }

    /**
     * 执行 git 命令时，需要用到的一些数据 进行组装
     */
    protected commandInfo: {
        gitUrl: string;
        gitBranchName: string;
    } = {
        gitUrl: '',
        gitBranchName: ''
    }
    
    /**
     * 全局 锁定，默认 false
     */
    get isLockByGlobal(): boolean {
        return !!this.packageInfo.lock
    }

    /**
     * 当前 锁定，默认 false
     */
    get isLockByCur(): boolean {
        return !!this.curPackageInfo.lock
    }

    /**
     * 当前仓库应该被安装所在路径
     * git 操作时所处的上下文
     */
    get repoDir(): string {
        return `${this.packageInfo.targetDir}/${this.curPackageKey}`
    }

    /**
     * git 仓库目录 是否存在
     * 在：true
     * 否：false
     * 注意：git 克隆失败也会创建目录
     */
    get isRepoDir(): boolean {
        return test('-d', this.repoDir)
    }

    /**
     * 确定是否为 git 仓库 的目录标识
     */
    get gitRepoDir(): string {
        return `${this.repoDir}/.git`
    }

     /**
     * git 仓库目录标识 是否存在
     * 在：true
     * 否：false
     * 注意：git 克隆失败，这个目录一定不会存在
     */
    get isGitRepoDir(): boolean {
        return test('-d', this.gitRepoDir)
    }

    /**
     * 检测全局包是否被锁定，锁定给出提示
     */
    public checkPackageGlobalLock() {
        if (this.isLockByGlobal) {
            console.log(Msg[PackageMsg.GlobalIsLock])
            return false
        }
        return true
    }


    /**
     * 设初始化包信息
     */
    protected async initPkgInfo() {
        this.packageInfo = await getPackageInfo()
        this.curPackageKey = ''
        this.setGitInfo()
    }

    /**
     * 设置git信息
     */
    protected setGitInfo() {
        if (this.packageInfo.gitHost.indexOf('http') === 0) {
            this.protocol = 'http'
            this.pathSplitStr = '/'
        } else {
            this.protocol = 'ssh'
            this.pathSplitStr = ':'
        }
    }

    /**
     * 设置当前仓库信息
     * @param key 当前仓库的唯一标识
     */
    public setGitRepoInfo(key: string): boolean {
        if (!this.packageInfo.dependencies[key]) {
            console.log(Msg[GitMsg.CommonNotFoundKeyByConfigFile])
            return false
        }
        
        this.curPackageKey = key
        this.curPackageInfo = this.packageInfo.dependencies[key]

        if (this.checkPackageStatus() === false) {
            return false
        }
        this.setCommandInfo()
        return true
    }

    /**
     * 组装 git 操作时用到的 信息
     */
    protected setCommandInfo() {
        if (this.curPackageInfo.gitUrl) {
            this.commandInfo.gitUrl = this.curPackageInfo.gitUrl
            this.commandInfo.gitBranchName = this.curPackageKey.split(this.packageInfo.packageKeySplit)[1]
        } else {
            this.commandInfo.gitBranchName = this.curPackageInfo.gitBranchName || ''
            const gitNamespace = this.curPackageInfo.gitNamespace || this.packageInfo.gitNamespace
            this.commandInfo.gitUrl = `${this.packageInfo.gitHost}${this.pathSplitStr}${gitNamespace}/${this.curPackageInfo.gitRepoName}.git`
        }
    }

    protected checkPackageStatus(): boolean {
        if (this.isLockByGlobal) {
            console.log(Msg[GitMsg.CommonGlobalIsLock])
            return false
        }
        if (this.isLockByCur) {
            console.log(Msg[GitMsg.CommonCurPackageKeyIsLock](this.curPackageKey))
            return false
        }
        return true
    }

    public checkGitRepoDirStatus(): boolean {
        if (!this.isRepoDir) {
            console.log(Msg[GitMsg.CommonNotFoundDirByInstall](this.curPackageKey))
            return false
        }
        if (!this.isGitRepoDir) {
            console.log(Msg[GitMsg.CommonNotFoundGitDirByInstall](this.curPackageKey))
            return false
        }
        return true
    }
}
