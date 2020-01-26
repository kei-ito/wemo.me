import {Object} from '@wemo.me/global';
import {ITypeChecker, ITypeFilter} from './types';
import {AppError} from './AppError';

export const createTypeFilter = <TType>(
    checker: ITypeChecker<TType>,
): ITypeFilter<TType> => Object.defineProperty(
    (input: any) => {
        if (checker(input)) {
            return input;
        }
        throw new AppError('InvalidType', `${input} is unexpected. ${checker.name} is expected.`);
    },
    'name',
    {value: checker.name},
);