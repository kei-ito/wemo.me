import {createTypeChecker} from '@wemo.me/util';

export const isString = createTypeChecker(
    'String',
    (
        input: any,
    ): input is string => typeof input === 'string',
);
