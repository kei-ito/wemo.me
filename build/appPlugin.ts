import * as path from 'path';
import * as rollup from 'rollup';
import {getPlugins} from './getPlugins';
import {generateHtml} from './generateHtml';
import {emitSystemJs} from './emitSystemJs';

export interface IAppPluginProps {
    production?: boolean,
    projectRootDirectory?: string,
    modulePrefix?: string,
}

export const appPlugin = (
    {
        production = false,
        projectRootDirectory = path.join(__dirname, '..'),
        modulePrefix = '@wemo.me/',
    }: IAppPluginProps = {},
): rollup.Plugin => {
    const input = [
        path.join(projectRootDirectory, 'src/app.ts'),
    ];
    const isInputChunk = (
        output: rollup.OutputAsset | rollup.OutputChunk,
    ): output is rollup.OutputChunk => output.type === 'chunk' && input.includes(output.facadeModuleId || '');
    return {
        name: 'app',
        options(options) {
            return {
                ...options,
                input,
                plugins: getPlugins({plugins: options.plugins, production}),
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
        resolveId(importee) {
            if (importee.startsWith(modulePrefix)) {
                const moduleName = importee.slice(modulePrefix.length);
                return path.join(projectRootDirectory, 'modules', moduleName, 'index.ts');
            }
            return null;
        },
        async generateBundle(_outputOptions, bundle) {
            this.emitFile({
                type: 'asset',
                fileName: 'index.html',
                source: generateHtml({
                    systemjs: await emitSystemJs(this),
                    scripts: Object.values(bundle).filter(isInputChunk).map((chunk) => chunk.fileName),
                }),
            });
        },
    };
};
