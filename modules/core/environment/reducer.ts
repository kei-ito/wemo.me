import {createReducer, ActionType} from 'typesafe-actions';
import {reboot, setEnvironment} from './action';
import {IEnvironment} from '../types';

type Actions =
| typeof setEnvironment
| typeof reboot;

export default createReducer<IEnvironment | null, ActionType<Actions>>(null)
.handleAction(reboot, (_state) => null)
.handleAction(setEnvironment, (_state, action) => action.payload);
