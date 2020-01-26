import {AppError} from './AppError';
import {ITypeChecker} from './types';

export const assure = <TType>(
    input: any,
    checker: ITypeChecker<TType>,
): TType => {
    if (checker(input)) {
        return input;
    }
    throw new AppError('InvalidType', `${input} is unexpected. ${checker.name} is expected.`);
};
