import {createReducer, ActionType} from 'typesafe-actions';
import {SetFile} from './action';
import {IBinaryEditor} from './type';

type Actions =
| typeof SetFile;

export const BinaryEditorReducer = createReducer<IBinaryEditor, ActionType<Actions>>({
    file: null,
})
.handleAction(SetFile, (state, action) => ({...state, file: action.payload}));
