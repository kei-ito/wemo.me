import * as path from 'path';
import * as rollup from 'rollup';
import {getPlugins} from './getPlugins';
import {generateHtml} from './generateHtml';
import {SystemJSEmitter} from './systemJSEmitter';

export const appPlugin = (
    projectRootDirectory = path.join(__dirname, '..'),
): rollup.Plugin => {
    const input = [
        path.join(projectRootDirectory, 'src/app.ts'),
    ];
    const isInputChunk = (
        output: rollup.OutputAsset | rollup.OutputChunk,
    ): output is rollup.OutputChunk => output.type === 'chunk' && input.includes(output.facadeModuleId || '');
    const systemjs = new SystemJSEmitter();
    return {
        name: 'app',
        options(options) {
            return {
                ...options,
                input,
                plugins: getPlugins(options.plugins),
            };
        },
        outputOptions(outputOptions) {
            delete outputOptions.file;
            return {
                ...outputOptions,
                format: 'system',
                dir: path.join(projectRootDirectory, 'output'),
            };
        },
        async generateBundle(_outputOptions, bundle) {
            this.emitFile({
                type: 'asset',
                fileName: 'index.html',
                source: generateHtml({
                    systemjs: await systemjs.emit(this),
                    scripts: Object.values(bundle)
                    .filter(isInputChunk)
                    .map((chunk) => chunk.fileName),
                }),
            });
        },
    };
};
