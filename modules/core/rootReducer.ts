import {combineReducers} from 'redux';
import environment from './environment/reducer';

export const rootReducer = combineReducers({
    environment,
});
