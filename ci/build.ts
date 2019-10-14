import * as path from 'path';
import {Builder} from './Builder';

const builder = new Builder({
    watchMode: process.argv.includes('--watch'),
    baseDir: path.join(__dirname, '../src'),
    outDir: path.join(__dirname, '../output'),
    appFile: 'app.html',
});

builder.build()
.catch((error) => {
    console.error(error);
    process.exit(1);
});
