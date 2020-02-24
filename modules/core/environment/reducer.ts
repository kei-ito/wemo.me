import {createReducer, ActionType} from 'typesafe-actions';
import {Reboot, SetEnvironment} from './action';
import {IEnvironment} from './type';
import {getDefaultLanguage} from '@wemo.me/translation';

type Actions =
| typeof SetEnvironment
| typeof Reboot;

export const EnvironmentReducer = createReducer<IEnvironment, ActionType<Actions>>({
    language: getDefaultLanguage(),
})
.handleAction(Reboot, (state) => state)
.handleAction(SetEnvironment, (_state, action) => action.payload);
