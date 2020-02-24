import {createTypeChecker} from '@wemo.me/util';
import {Language} from '@wemo.me/translation';

export const isLanguage = createTypeChecker(
    'Language',
    (
        input: string,
    ): input is Language => input === 'en'
    || input === 'ja',
);
