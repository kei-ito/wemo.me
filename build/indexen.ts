import * as path from 'path';
import * as fs from 'fs';
import {indexen, defaultConfigurations} from '@nlib/indexen';

export const generateIndex = async () => {
    const modulesDirectory = path.join(__dirname, '../modules');
    await Promise.all((await fs.promises.readdir(modulesDirectory)).map(async (name) => {
        const directory = path.join(modulesDirectory, name);
        const dest = path.join(modulesDirectory, name, 'index.ts');
        await indexen({...defaultConfigurations, directory, dest});
        console.log(`Generated: ${path.relative(modulesDirectory, dest)}`);
    }));
};

if (!module.parent) {
    generateIndex().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
