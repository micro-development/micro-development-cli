/**
 * package global config
 */
export interface InitParams {
    name: string;
    description: string;
    author: string;
    targetDir: string;
    gitHost: string;
    gitNamespace: string;
    packageKeySplit: string,
    dependencies: {
        [propName: string]: PackageConfig;
    };
    lock: boolean;
}


/**
 * package key config
 */
export interface PackageConfig {
    gitUrl?: string;
    gitNamespace?: string;
    gitRepoName?: string;
    gitBranchName?: string;
    lock: boolean;
}

export interface ConfigInfo {
    lang: string;
    configFile: string
}
