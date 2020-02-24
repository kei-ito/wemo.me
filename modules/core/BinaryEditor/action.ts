import {createAction} from 'typesafe-actions';
import {createTypeFilter} from '@wemo.me/util';
import {isFileOrBlob} from '@wemo.me/is';

export const SetFile = createAction('SetFile', createTypeFilter(isFileOrBlob))();
