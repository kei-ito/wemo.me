import {createTypeChecker, getType} from '@wemo.me/util';

export const isFileOrBlob = createTypeChecker(
    'FileOrBlob',
    (
        input: any,
    ): input is File | Blob => {
        const type = getType(input);
        return type === 'File' || type === 'Blob';
    },
);
