import {Error} from '@wemo.me/global';

export class AppError extends Error {

    public readonly code: string;

    public constructor(
        code: string,
        message?: string,
    ) {
        super(message ? `${code}: ${message}` : code);
        this.code = code;
    }

}
