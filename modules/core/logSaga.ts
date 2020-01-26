import {takeEvery} from 'redux-saga/effects';

export const logSaga = function* () {
    yield takeEvery('*', (action: {type: string, payload: {}}) => {
        console.log({type: action.type, payload: action.payload});
    });
};
