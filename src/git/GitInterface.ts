export interface CommitOption {
    curPackageKey: string;
    commitContent: string;
}

export interface GitInterface {
    successNum?: number;
    errorNum?: number;
    start(keyList: string[]): void;
    run(option?: CommitOption): void;
}