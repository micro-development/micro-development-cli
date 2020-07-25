import { green, red } from 'chalk';
import { ConfigInfo } from '../interface';
const config: ConfigInfo = require('../config.json')

export const init = {
    10001: green('the configuration file is not found. please configure your information...'),
    10002: red(`❌ configuration file ${config.configFile} already exists`),
    10003: red(`❌ create profile ${config.configFile} failure`),
    10004: green(`✅ create profile ${config.configFile} success`)
}