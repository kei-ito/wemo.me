import {takeEvery, select} from 'redux-saga/effects';
import {getType} from 'typesafe-actions';
import {SetFile} from './action';
import {IBinaryEditor} from './type';
import {selectBinaryEditor} from './select';

export const loadFile = function* () {
    const state: IBinaryEditor = yield select(selectBinaryEditor);
    state.toString();
};

export const BinaryEditorSaga = [
    takeEvery(getType(SetFile), loadFile),
];
