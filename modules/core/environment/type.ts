import {Language} from '@wemo.me/translation';

export interface IEnvironment {
    language: Language,
}

export interface IEnvironmentState {
    Environment: IEnvironment,
}
