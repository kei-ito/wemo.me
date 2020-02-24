import {takeEvery, put, select} from 'redux-saga/effects';
import {getType} from 'typesafe-actions';
import {assure} from '@wemo.me/util';
import {isEnvironment} from '@wemo.me/is';
import {Reboot, SetEnvironment} from './action';
import {IEnvironment} from './type';
import {selectEnvironment} from './select';

export const getEnvironment = function* () {
    const state: IEnvironment = yield select(selectEnvironment);
    yield put(SetEnvironment(assure({
        ...state,
    }, isEnvironment)));
};

export const EnvironmentSaga = [
    takeEvery(getType(Reboot), getEnvironment),
];
