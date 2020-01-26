import * as path from 'path';
import * as rollup from 'rollup';
import {getPlugins} from './getPlugins';

export interface IOptions {
    input: rollup.InputOptions,
    output: rollup.OutputOptions,
    watch: rollup.WatcherOptions,
}

export const getOptions = (): IOptions => ({
    input: {
        input: path.join(__dirname, '../src/app.ts'),
        plugins: getPlugins(),
    },
    output: {
        dir: path.join(__dirname, '../output'),
    },
    watch: {},
});
