import {Object} from '@wemo.me/global';
import {ITypeChecker} from '@wemo.me/util';

export const createTypeChecker = <TType>(
    name: string,
    checker: (input: any) => input is TType,
): ITypeChecker<TType> => Object.defineProperty(checker, 'name', {value: name});
