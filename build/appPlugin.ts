import * as path from 'path';
import * as rollup from 'rollup';
import {getPlugins} from './getPlugins';
import {listFiles} from './listFiles';
import {loadHTML} from './loadHTML';
import {generateHtml} from './generateHtml';
import {emitSystemJs} from './emitSystemJs';
import {inputChunks} from './inputChunks';

export interface IAppPluginProps {
    production?: boolean,
    projectRootDirectory?: string,
    modulePrefix?: string,
}

export const appPlugin = async (
    {
        production = false,
        projectRootDirectory = path.join(__dirname, '..'),
        modulePrefix = '@wemo.me/',
    }: IAppPluginProps = {},
): Promise<rollup.Plugin> => {
    const outputDirectory = path.join(projectRootDirectory, 'output');
    const srcDirectory = path.join(projectRootDirectory, 'src');
    const input = await listFiles({
        directory: srcDirectory,
        filter: (file) => file.endsWith('.html'),
    });
    return {
        name: 'app',
        options: (options) => ({
            ...options,
            input: [...input],
            plugins: getPlugins({plugins: options.plugins, production}),
        }),
        outputOptions: (outputOptions) => ({...outputOptions, format: 'system', dir: outputDirectory}),
        resolveId: (importee) => importee.startsWith(modulePrefix) ? path.join(
            projectRootDirectory,
            'modules',
            importee.slice(modulePrefix.length),
            'index.ts',
        ) : null,
        async load(id) {
            return input.has(id) ? await loadHTML(id) : null;
        },
        async generateBundle(_outputOptions, bundle) {
            const systemjs = await emitSystemJs(this, production);
            await Promise.all([...inputChunks(bundle, input)].map(async ({name, chunk, src}) => {
                delete bundle[name];
                await generateHtml({
                    context: this,
                    chunk,
                    src,
                    dest: path.relative(srcDirectory, src),
                    base: path.relative(path.dirname(src), srcDirectory),
                    systemjs,
                });
            }));
        },
    };
};

if (!module.parent) {
    appPlugin()
    .then((plugin) => console.log(plugin))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
