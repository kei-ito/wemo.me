import {document} from '@wemo.me/global';

export const printError = (
    error: Error,
) => {
    document.body.insertAdjacentText('afterbegin', error.stack || error.toString());
};
