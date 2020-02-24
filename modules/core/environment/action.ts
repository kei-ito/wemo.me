import {createAction} from 'typesafe-actions';
import {createTypeFilter} from '@wemo.me/util';
import {isEnvironment} from '@wemo.me/is';

export const Reboot = createAction('Reboot')();
export const SetEnvironment = createAction('SetEnvironment', createTypeFilter(isEnvironment))();
