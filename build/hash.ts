import * as crypto from 'crypto';

export const hash = (
    source: string | Buffer,
    algorithm = 'sha256',
    encoding: crypto.HexBase64Latin1Encoding = 'hex',
    length = 8,
): string => {
    const hash = crypto.createHash(algorithm);
    hash.update(source);
    return hash.digest(encoding).slice(0, length);
};
