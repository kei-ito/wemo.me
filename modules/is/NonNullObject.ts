import {createTypeChecker} from '@wemo.me/util';

export const isNonNullObject = createTypeChecker(
    'NonNullObject',
    (
        input: any,
    ): input is {[key: string]: any} => input && typeof input === 'object',
);
