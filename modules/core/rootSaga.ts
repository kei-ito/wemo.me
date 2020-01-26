import {all} from 'redux-saga/effects';
import environmentSaga from './environment/saga';
import {logSaga} from './logSaga';

export const rootSaga = function* () {
    yield all([
        ...environmentSaga,
        logSaga,
    ]);
};
