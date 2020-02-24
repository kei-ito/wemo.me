import {navigator} from '@wemo.me/global';
import {Language} from './types';

export const getDefaultLanguage = (
    input = navigator.language.slice(0, 2),
): Language => {
    switch (input.toLowerCase()) {
    case 'ja':
        return 'ja';
    default:
        return 'en';
    }
};
