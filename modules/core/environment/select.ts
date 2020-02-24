import {IEnvironmentState, IEnvironment} from './type';

export const selectEnvironment = (
    state: IEnvironmentState,
): IEnvironment => state.Environment;
