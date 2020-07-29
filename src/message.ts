import { green, red } from 'chalk';
import { ConfigInfo } from './interface';
const config: ConfigInfo = require('./config.json')
const LangMsg = require(`./i18n/${config.lang}`)
// console.log(LangMsg)

export enum InitMsg {
    NotExist = 10001,
    IsExist = 10002,
    CreateFail = 10003,
    CreateSuccess = 10004,
    
    InquirerValidateName = 10020,
    InquirerMessageName = 10028,
    
    InquirerValidateDescription = 10030,
    InquirerMessageDescription = 10038,
    
    InquirerValidateAuthor = 10040,
    InquirerMessageAuthor = 10048,
    
    InquirerValidateTargetDir = 10050,
    InquirerValidateTargetDirByRootPath = 10051,
    
    InquirerSuffixTargetDir = 10057,
    InquirerMessageTargetDir = 10058,
    
    InquirerValidateGitHost = 10060,
    InquirerValidateGitHostByProtocol = 10061,
    
    InquirerSuffixGitHost = 10067,
    InquirerMessageGitHost = 10068,

    InquirerValidateGitNamespace = 10070,
    InquirerSuffixGitNamespace = 10077,
    InquirerMessageGitNamespace = 10078,

    InquirerSuffixLock = 10087,
    InquirerMessageLock = 10088,

    InquirerMessagePackageKeySplit = 10098,
    InquirerSuffixPackageKeySplit = 10097,
}

export enum AddMsg {
    InquirerMessageChoiceType = 20001,
    InquirerSuffixChoiceType = 20002,
    InquirerChoiceTypeByDefault = 20003,
    InquirerChoiceTypeByCustom = 20004,
    UpdateConfigFileSuccess = 20005,
    UpdateConfigFileFail = 20006,

    InquirerSuffixGitNamespace = 20021,
    InquirerMessageGitNamespace = 20020,

    InquirerSuffixGitRepoName = 20031,
    InquirerMessageGitRepoName = 20030,
    InquirerValidateGitRepoName = 20032,

    InquirerSuffixGitBranchName = 20041,
    InquirerMessageGitBranchName = 20040,
    InquirerValidateGitBranchName = 20042,

    InquirerMessageLock = 20050,
    InquirerSuffixLock = 20051,

    InquirerMessageGitUrl = 20060,
    InquirerSuffixGitUrl = 20061,
    InquirerValidateGitUrl = 20062,
    InquirerValidateGitUrlByFormat = 20063,
}

export enum UpdateMsg {
    InquirerMessageChooseKey = 30000,
    InquirerSuffixChooseKey = 30001,
}

export enum StatusMsg {
    InquirerMessageChooseKey = 40000,
    InquirerSuffixChooseKey = 40001,
}


export enum CommitMsg {
    InquirerMessageChooseKey = 50000,
    InquirerSuffixChooseKey = 50001,
}

export enum RemoveMsg {
    InquirerMessageChooseKey = 60000,
    InquirerSuffixChooseKey = 60001,
    UpdateConfigFileSuccess = 60002,
    UpdateConfigFileFail = 60003,
}

export enum CommandMsg {
    DescriptionInit = 70000,
    DescriptionAdd = 70010,
    DescriptionInstall = 70020,
    DescriptionUpdate = 70030,
    DescriptionStatus = 70040,
    DescriptionCommit = 70050,
    DescriptionRemove = 70060,
}


export enum GitMsg {
    CommonNotFoundKeyByConfigFile = 80000,
    CommonGlobalIsLock = 80001,
    CommonCurPackageKeyIsLock = 80002,
    CommonNotFoundDirByInstall = 80003,
    CommonNotFoundGitDirByInstall = 80004,

    InstallStartByAll = 80010,
    InstallStartEnd = 80011,
    InstallStartByCur = 80012,
    InstallSuccessByCur = 80013,
    InstallFailByCur = 80014,
    InstallDirIsExist = 80015,
    InstallDirNotGit = 80016,

    UpdateStartByAll = 80020,
    UpdateStartEnd = 80021,
    UpdateStartByCur = 80022,
    UpdateSuccessByCur = 80023,
    UpdateFailByCur = 80024,

    StatusStartByAll = 80030,
    StatusStartEnd = 80031,
    StatusStartByCur = 80032,
    StatusSuccessByCur = 80033,
    StatusFailByCur = 80034,

    CommitFailByParam = 80040,
    CommitStartByCur = 80041,
    CommitSuccessByCur = 80042,
    CommitFailByCur = 80043,

}


export const Msg = {
    10001: LangMsg.init[InitMsg.NotExist],
    10002: LangMsg.init[InitMsg.IsExist],
    10003: LangMsg.init[InitMsg.CreateFail],
    10004: LangMsg.init[InitMsg.CreateSuccess],
    10020: LangMsg.init[InitMsg.InquirerValidateName],
    10028: LangMsg.init[InitMsg.InquirerMessageName],
    10030: LangMsg.init[InitMsg.InquirerValidateDescription],
    10038: LangMsg.init[InitMsg.InquirerMessageDescription],
    10040: LangMsg.init[InitMsg.InquirerValidateAuthor],
    10048: LangMsg.init[InitMsg.InquirerMessageAuthor],
    10050: LangMsg.init[InitMsg.InquirerValidateTargetDir],
    10051: LangMsg.init[InitMsg.InquirerValidateTargetDirByRootPath],
    10057: LangMsg.init[InitMsg.InquirerSuffixTargetDir],
    10058: LangMsg.init[InitMsg.InquirerMessageTargetDir],
    10060: LangMsg.init[InitMsg.InquirerValidateGitHost],
    10061: LangMsg.init[InitMsg.InquirerValidateGitHostByProtocol],
    10067: LangMsg.init[InitMsg.InquirerSuffixGitHost],
    10068: LangMsg.init[InitMsg.InquirerMessageGitHost],
    10070: LangMsg.init[InitMsg.InquirerValidateGitNamespace],
    10077: LangMsg.init[InitMsg.InquirerSuffixGitNamespace],
    10078: LangMsg.init[InitMsg.InquirerMessageGitNamespace],
    10087: LangMsg.init[InitMsg.InquirerSuffixLock],
    10088: LangMsg.init[InitMsg.InquirerMessageLock],
    10097: LangMsg.init[InitMsg.InquirerSuffixPackageKeySplit],
    10098: LangMsg.init[InitMsg.InquirerMessagePackageKeySplit],

    20001: LangMsg.add[AddMsg.InquirerMessageChoiceType],
    20002: LangMsg.add[AddMsg.InquirerSuffixChoiceType],
    20003: LangMsg.add[AddMsg.InquirerChoiceTypeByDefault],
    20004: LangMsg.add[AddMsg.InquirerChoiceTypeByCustom],
    20005: LangMsg.add[AddMsg.UpdateConfigFileSuccess],
    20006: LangMsg.add[AddMsg.UpdateConfigFileFail],
    
    20021: LangMsg.add[AddMsg.InquirerSuffixGitNamespace],
    20020: LangMsg.add[AddMsg.InquirerMessageGitNamespace],
    
    20031: LangMsg.add[AddMsg.InquirerSuffixGitRepoName],
    20030: LangMsg.add[AddMsg.InquirerMessageGitRepoName],
    20032: LangMsg.add[AddMsg.InquirerValidateGitRepoName],
    
    20041: LangMsg.add[AddMsg.InquirerSuffixGitBranchName],
    20040: LangMsg.add[AddMsg.InquirerMessageGitBranchName],
    20042: LangMsg.add[AddMsg.InquirerValidateGitBranchName],
    
    20051: LangMsg.add[AddMsg.InquirerSuffixLock],
    20050: LangMsg.add[AddMsg.InquirerMessageLock],
    
    20060: LangMsg.add[AddMsg.InquirerMessageGitUrl],
    20061: LangMsg.add[AddMsg.InquirerSuffixGitUrl],
    20062: LangMsg.add[AddMsg.InquirerValidateGitUrl],
    20063: LangMsg.add[AddMsg.InquirerValidateGitUrlByFormat],

    30000: LangMsg.update[UpdateMsg.InquirerMessageChooseKey],
    30001: LangMsg.update[UpdateMsg.InquirerSuffixChooseKey],

    40000: LangMsg.status[UpdateMsg.InquirerMessageChooseKey],
    40001: LangMsg.status[UpdateMsg.InquirerSuffixChooseKey],

    50000: LangMsg.commit[UpdateMsg.InquirerMessageChooseKey],
    50001: LangMsg.commit[UpdateMsg.InquirerSuffixChooseKey],

    60000: LangMsg.remove[RemoveMsg.InquirerMessageChooseKey],
    60001: LangMsg.remove[RemoveMsg.InquirerSuffixChooseKey],
    60002: LangMsg.remove[RemoveMsg.UpdateConfigFileSuccess],
    60003: LangMsg.remove[RemoveMsg.UpdateConfigFileFail],

    70000: LangMsg.command[CommandMsg.DescriptionInit],
    70010: LangMsg.command[CommandMsg.DescriptionAdd],
    70020: LangMsg.command[CommandMsg.DescriptionInstall],
    70030: LangMsg.command[CommandMsg.DescriptionUpdate],
    70040: LangMsg.command[CommandMsg.DescriptionStatus],
    70050: LangMsg.command[CommandMsg.DescriptionCommit],
    70060: LangMsg.command[CommandMsg.DescriptionRemove],

    80000: LangMsg.gitTip[GitMsg.CommonNotFoundKeyByConfigFile],
    80001: LangMsg.gitTip[GitMsg.CommonGlobalIsLock],
    80002: LangMsg.gitTip[GitMsg.CommonCurPackageKeyIsLock],
    80003: LangMsg.gitTip[GitMsg.CommonNotFoundDirByInstall],
    80004: LangMsg.gitTip[GitMsg.CommonNotFoundGitDirByInstall],

    80010: LangMsg.gitTip[GitMsg.InstallStartByAll],
    80011: LangMsg.gitTip[GitMsg.InstallStartEnd],
    80012: LangMsg.gitTip[GitMsg.InstallStartByCur],
    80013: LangMsg.gitTip[GitMsg.InstallSuccessByCur],
    80014: LangMsg.gitTip[GitMsg.InstallFailByCur],
    80015: LangMsg.gitTip[GitMsg.InstallDirIsExist],
    80016: LangMsg.gitTip[GitMsg.InstallDirNotGit],

    80020: LangMsg.gitTip[GitMsg.UpdateStartByAll],
    80021: LangMsg.gitTip[GitMsg.UpdateStartEnd],
    80022: LangMsg.gitTip[GitMsg.UpdateStartByCur],
    80023: LangMsg.gitTip[GitMsg.UpdateSuccessByCur],
    80024: LangMsg.gitTip[GitMsg.UpdateFailByCur],

    80030: LangMsg.gitTip[GitMsg.StatusStartByAll],
    80031: LangMsg.gitTip[GitMsg.StatusStartEnd],
    80032: LangMsg.gitTip[GitMsg.StatusStartByCur],
    80033: LangMsg.gitTip[GitMsg.StatusSuccessByCur],
    80034: LangMsg.gitTip[GitMsg.StatusFailByCur],

    80040: LangMsg.gitTip[GitMsg.CommitFailByParam],
    80041: LangMsg.gitTip[GitMsg.CommitStartByCur],
    80042: LangMsg.gitTip[GitMsg.CommitSuccessByCur],
    80043: LangMsg.gitTip[GitMsg.CommitFailByCur],
}

