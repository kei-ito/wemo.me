import {IBinaryEditorState, IBinaryEditor} from './type';

export const selectBinaryEditor = (
    state: IBinaryEditorState,
): IBinaryEditor => state.BinaryEditor;
