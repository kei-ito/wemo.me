import * as path from 'path';
import * as afs from '@nlib/afs';

export const cleanup = async () => {
    await afs.rmrf(path.join(__dirname, '../output'));
};

if (!module.parent) {
    cleanup().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
