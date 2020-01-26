import {createAction} from 'typesafe-actions';
import {createTypeFilter} from '@wemo.me/util';
import {isEnvironment} from '@wemo.me/is';

export const reboot = createAction('Reboot')();
export const setEnvironment = createAction('SetEnvironment', createTypeFilter(isEnvironment))();
