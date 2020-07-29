import { InitParams, PackageConfig, ConfigInfo } from './interface'
import { red, green, yellow } from 'chalk';
import { strict } from 'assert';
import { string } from '@oclif/command/lib/flags';
import inquirer = require('inquirer');
const path = require('path')
const fs  = require('fs');
const js_beautify = require('js-beautify').js_beautify
const config: ConfigInfo = require('./config.json')
const configFile = config.configFile
/**
 * 获取执行命令所在绝对路径
 * @param joinPath 拼接的路径字符串
 */
export const getPath = (joinPath: string): string => {
    return path.resolve(joinPath)
    // return process.cwd(joinPath)
}

/**
 * 根据git协议组装对应的Git地址
 * @param gitInfo git的配置信息
 * @return url  返回组装好的Git信息
 */
export const getGitUrl = async (repoInfo: PackageConfig):Promise<string> => {
    const packageInfo: InitParams = await getPackageInfo()
    const splitPath = packageInfo.gitHost.indexOf('git@') === 0 ? ':' : '/'
    const gitNamespace = repoInfo.gitNamespace || packageInfo.gitNamespace
    const url = `${packageInfo.gitHost}${splitPath}${gitNamespace}/${repoInfo.gitRepoName}.git`
    return url
}


/**
 * 检测全局包锁
 * @param packageInfo 包信息
 */
export const checkGlobalIsLock = async () => {
    const packageInfo: InitParams = await getPackageInfo()
    return !!packageInfo.lock
}

/**
 * 检测指定包锁
 * 先执行检测全局
 * @param packageInfo 包信息
 * @param packageKey 包的key
 */
export const checkCurPackageIsLock = async (packageKey: string): Promise<boolean> => {
    const packageInfo: InitParams = await getPackageInfo()
    if (!packageInfo.dependencies[packageKey].lock) {
        if (await checkGlobalIsLock() === true) {
            console.log(red(`${packageKey} 不允许删除，因为全局已被锁定！`))
            return true
        }
        return false
    }
    console.log(red(`${packageKey} 已被锁定，不允许删除！`))
    return true
}

/**
 * 检测指定包是否已存在
 * @param packageInfo 包信息
 * @param packageKey 包的key
 */
export const checkCurPackageIsExist = async (packageKey: string): Promise<boolean | InitParams> => {
    const packageInfo: InitParams = await getPackageInfo()
    return !!packageInfo.dependencies[packageKey]
}

/**
 * 获取包信息
 */
export const getPackageInfo: () => InitParams  = () => {
    // return new Promise((resolve, reject) => {
    //     const packageInfo: InitParams = require(getPath(configFile))
    //     resolve(packageInfo)
    // })
    const packageInfo: InitParams = require(getPath(configFile))
    return packageInfo
}

/**
 * 更新包配置文件信息
 * @param packageInfo 最新的包数据信息
 */
export const updatePackageInfo: (packageInfo: InitParams) => Promise<boolean> = (packageInfo) => {
    return new Promise((resolve, reject) => {
        const data = js_beautify(JSON.stringify(packageInfo), {
            indent_size: 2
        })
        // console.log('updatePackageInfo js_beautify data', data)
        fs.writeFile(getPath(configFile), data, (err: any) => {
            if (err) {
                // console.log(red(`❌ 更新配置文件失败！`), err)
                reject(err)
            } else {
                // console.log(green(`✅ 更新配置文件成功。`))
                resolve(true)
            }
        });
    })
}

/**
 * 检测是否存在安装包
 * 是：true
 * 否：返回keys
 * @param packageInfo 包信息
 */
export const checkPackageIsEmpty = (packageInfo: InitParams):boolean | string[] => {
    if (!packageInfo.dependencies) {
        console.log(red('❌ 您还未安装过仓库！'))
        return true
    }
    const dKeys: string[] = Object.keys(packageInfo.dependencies)
    if (!dKeys.length) {
        console.log(red('❌ 您还未安装过仓库！'))
        return true
    }
    return dKeys
}

/**
 * 选择已安装的包下拉框
 * @param packageInfo 包信息
 * @param option 配置参数
 */
export const choosePackageKey = async (packageInfo: InitParams, option: {
    message: string;
    suffix: string;
    selectType: 'checkbox' | 'rawlist';
    isLockText?: string;
    noSelectTip?: string;
}): Promise<string | boolean | string[]> => {
    const dependencies = packageInfo.dependencies
    const dKeys = checkPackageIsEmpty(packageInfo)
    if (dKeys === true) {
      return false
    }
    const list: object[] = [];

    (dKeys as []).forEach((pKey: string) => {
      const isLockStr: string = !!dependencies[pKey].lock ? `${red(`（${option.isLockText || '已被锁定'}）`)}` : ''
      const [pName, pBranch] = pKey.split('#')
      list.push(
        {
          value: `${pKey}`,
          name: `${pKey}${isLockStr}`,
          disabled: dependencies[pKey].lock
        }
      )
    })
    const answer = await inquirer.prompt([
      {
        type: option.selectType,
        name: 'choicePackageKey',
        message: `${option.message}`,
        suffix: `${option.suffix}`,
        choices: list
      }
    ])
    if (!answer.choicePackageKey.length) {
      console.log(yellow(`${option.noSelectTip || '没有选择，您放弃了。'}`))
      return false
    }
    return answer.choicePackageKey
}

/**
 * 获取当前操作仓库的key
 * @param inputPackage 组装当前操作的仓库的key
 */
export const getPackageKey = (inputPackage: PackageConfig, packageKeySplit: string): string => {
    const gitNamespace = inputPackage.gitNamespace ? `${inputPackage.gitNamespace}@` : ``;
    const packagePrefix = `${gitNamespace}${inputPackage.gitRepoName}`
    const packageKey = `${packagePrefix}${packageKeySplit}${inputPackage.gitBranchName}`
    return packageKey
}
