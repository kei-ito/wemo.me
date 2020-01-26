import {takeEvery, put} from 'redux-saga/effects';
import {getType} from 'typesafe-actions';
import {assure} from '@wemo.me/util';
import {reboot, setEnvironment} from './action';
import {isEnvironment} from '@wemo.me/is';

export const getEnvironment = function* () {
    yield put(setEnvironment(assure({}, isEnvironment)));
};

export default [
    takeEvery(getType(reboot), getEnvironment),
];
