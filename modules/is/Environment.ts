import {createTypeChecker} from '@wemo.me/util';
import {IEnvironment} from '@wemo.me/core';
import {isNonNullObject} from './NonNullObject';
import {isLanguage} from './Language';

export const isEnvironment = createTypeChecker(
    'Environment',
    (
        input: any,
    ): input is IEnvironment => isNonNullObject(input)
    && isLanguage(input.language),
);
