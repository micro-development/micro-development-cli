import { green, red, yellow } from 'chalk';
import { ConfigInfo } from '../interface';
const config: ConfigInfo = require('../config.json')

export const common = {
    gitNamespace: {
        message: 'git命名空间',
        suffix: yellow(`（仓库所属用户或组织的名称）`),
    },
    lock: {
        message: '锁定',
        suffix: yellow(`（为true锁定，则不允许再通过脚手架更新配置文件）`),
    }
}

export const init = {
    10001: green('检测到配置文件不存在，请配置您的信息...'),
    10002: red(`❌ 配置文件 ${config.configFile} 已存在！`),
    10003: red(`❌ 创建配置文件 ${config.configFile} 失败！`),
    10004: green(`✅ 创建配置文件 ${config.configFile} 成功。`),
    10020: red('\n项目名称必填'),
    10028: '项目名称',
    10030: red('\n项目描述必填'),
    10038: '项目描述',
    10040: red('\n项目作者必填'),
    10048: '项目作者',
    10050: red('\n存储目标目录必填'),
    10051: red('\n存储目标不能以 "/" 开头'),
    10057: yellow('（git仓库存储目录）'),
    10058: '存储目标目录',
    10060: red('\ngit主机必填'),
    10061: red('\ngit主机必须以 "git@" 或 "http" 开头'),
    10067: yellow(`（sample：git@github.com or https://github.com）`),
    10068: 'git主机',
    10070: red('\ngit命名空间(用户名或组织名)必填'),
    10077: common.gitNamespace.suffix,
    10078: common.gitNamespace.message,
    10097: yellow('（默认为 # ）'),
    10098: '包名称与分支的分隔符',
    10087: common.lock.suffix,
    10088: common.lock.message,
}

export const add = {
    20001: '使用默认配置或者自定义？',
    20002: yellow('（选择使用默认配置还是自定义）'),
    20003: '默认？继续输入仓库名和分支名',
    20004: '自定义？输入其他git平台的地址',
    20005: green(`✅ 写入配置文件成功`),
    20006: red(`❌ 写入配置文件失败`),
    
    20020: common.gitNamespace.message,
    20021: common.gitNamespace.suffix,
    
    20030: '仓库名称',
    20031: yellow('（git仓库的名称）'),
    20032: red('（git仓库必填）'),
    
    20040: '分支名称',
    20041: yellow('（git分支的名称）'),
    20042: red('（git分支必填）'),
    
    20050: common.lock.message,
    20051: common.lock.suffix,

    20060: 'git地址',
    20061: yellow('（示例：git@github.com:username/repo.git 或 https://github.com/username/repo.git）'),
    20062: red('\ngit地址必填'),
    20063: red('\ngit地址格式不正确'),
}

export const update = {
    30000: '选择依赖进行更新?',
    30001: yellow('根据配置信息执行git更新')
}

export const status = {
    40000: '选择仓库查看状态?',
    40001: yellow('（git status）')
}

export const commit = {
    50000: '选择仓库进行提交?',
    50001: yellow('（git commit）')
}

export const remove = {
    60000: '选择依赖进行移除?',
    60001: yellow('（只更新配置文件，不会删除物理文件）'),
    60002: (chooseKeyList: []) => green(`✅ 从配置文件移除 ${(chooseKeyList as []).join(',')} 成功`),
    60003: (chooseKeyList: []) => red(`❌ 从配置文件移除 ${(chooseKeyList as []).join(',')} 失败`)
}

export const command = {
    70000: `初始化配置文件（micro-development.json）`,
    70010: `${green('（a）')}安装一个依赖（git仓库）`,
    70020: `${green('（i）')}安装配置文件中所有的依赖（git仓库），已安装则忽略`,
    70030: `${green('（u）')}更新一个依赖（git仓库）`,
    70040: `${green('（s）')}查看一个依赖变更状态（git status）`,
    70050: `${green('（c）')}提交仓库变更（git commit）`,
    70060: `${green('（r）')}移除一个依赖（git仓库）`,
}

export const gitTip = {
    80000: (key: string) => red(`${key} , 没有在配置文件中找到。`),
    80001: (curPackageKey: string) => red(`${curPackageKey} 不能操作 ，全局已被锁定。`),
    80002: (curPackageKey: string) => red(`${curPackageKey} 已被锁定。`),
    80003: (curPackageKey: string, repoDir: string) => red(`${curPackageKey} , 目录不存在，可能还没有安装，预安装位置：${repoDir} 。`),
    80004: (curPackageKey: string, repoDir: string) => red(`${curPackageKey} , 目录存在，但不是一个git仓库（缺少.git目录），位置：${repoDir} 。`),

    80010: yellow(`全部开始安装...`),
    80011: (keyListLength: number, successNum: number, errorNum: number) => yellow(`\n全部安装结束（Total ${keyListLength}）：（${green(`Success ${successNum} `)}，${red(`Error ${errorNum} `)}）`),
    80012: (gitUrl: string) => yellow(`\n安装仓库：${gitUrl} 开始...`),
    80013: (gitUrl: string) => green(`安装仓库：${gitUrl} 成功`),
    80014: (gitUrl: string, code: number) => red(`安装仓库：${gitUrl} 失败，错误码：${code}`),
    80015: (curPackageKey: string, gitUrl: string, repoDir: string) => yellow(`${curPackageKey} ：${gitUrl} , 已安装过，位置：${repoDir} 。`),
    80016: (curPackageKey: string, gitUrl: string, repoDir: string) => red(`${curPackageKey} ：${gitUrl} , 目录存在但不是一个git仓库，请检查是否通过正常方式安装，位置：${repoDir} 。`),

    80020: yellow(`开始更新...`),
    80021: (keyListLength: number, successNum: number, errorNum: number) => yellow(`\n更新结束（Total ${keyListLength}）：（${green(`Success ${successNum} `)}，${red(`Error ${errorNum} `)}）`),
    80022: (gitUrl: string) => yellow(`\n更新仓库：${gitUrl} 开始...`),
    80023: (gitUrl: string) => green(`更新仓库：${gitUrl} 成功`),
    80024: (gitUrl: string, code: number) => red(`更新仓库：${gitUrl} 失败，错误码：${code}`),

    80030: yellow(`开始查看状态...`),
    80031: (keyListLength: number, successNum: number, errorNum: number) => yellow(`\n查看状态结束（Total ${keyListLength}）：（${green(`Success ${successNum} `)}，${red(`Error ${errorNum} `)}）`),
    80032: (gitUrl: string) => yellow(`\n查看仓库状态：${gitUrl} 开始...`),
    80033: (gitUrl: string) => green(`查看仓库状态：${gitUrl} 成功`),
    80034: (gitUrl: string, code: number) => red(`查看仓库状态：${gitUrl} 失败，错误码：${code}`),

    80040: red(`提交仓库变更内部错误，缺少参入：curPackageKey 或 commitContent 参数`),
    80041: (curPackageKey: string) => yellow(`\n提交仓库变更：${curPackageKey} 开始...`),
    80042: (curPackageKey: string) => green(`提交仓库变更：${curPackageKey} 成功`),
    80043: (curPackageKey: string, code: number) => red(`提交仓库变更：${curPackageKey} 失败，错误码：${code}`),

}

export const packageInfo = {
    111111: red(`全局配置已锁定，禁止操作`),
    111112: red(`当前操作项已被锁定，禁止操作`)
}
