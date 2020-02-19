import * as path from 'path';
import * as rollup from 'rollup';
import {getPlugins} from './getPlugins';
import {listFiles} from './listFiles';
import {loadHTML} from './loadHTML';
import {generateHtml} from './generateHtml';
import {emitSystemJs} from './emitSystemJs';
import {inputChunks} from './inputChunks';

export const getParameters = async (
    projectRootDirectory = path.join(__dirname, '..'),
) => {
    const srcDirectory = path.join(projectRootDirectory, 'src');
    const input = await listFiles({
        directory: srcDirectory,
        filter: (file) => file.endsWith('.html'),
        ignored: new Set([
            path.join(srcDirectory, 'header.html'),
            path.join(srcDirectory, 'footer.html'),
        ]),
    });
    return {
        directory: {
            root: projectRootDirectory,
            src: srcDirectory,
            modules: path.join(projectRootDirectory, 'modules'),
            output: path.join(projectRootDirectory, 'output'),
        },
        input,
    };
};

export const createLocalModuleResolver = (
    prefix: string,
    directory: string,
) => (
    importee: string,
) => {
    if (importee.startsWith(prefix)) {
        return path.join(directory, importee.slice(prefix.length), 'index.ts');
    }
    return null;
};

export const appPlugin = async (
    production = false,
): Promise<rollup.Plugin> => {
    const {directory, input} = await getParameters();
    return {
        name: 'app',
        options: (options) => ({
            ...options,
            input: [...input],
            plugins: getPlugins({
                plugins: options.plugins,
                production,
            }),
        }),
        outputOptions: (outputOptions) => ({
            ...outputOptions,
            format: 'system',
            dir: directory.output,
        }),
        resolveId: createLocalModuleResolver('@wemo.me/', directory.modules),
        async load(id) {
            return input.has(id) ? [...await loadHTML(id)].map(({relative, file}) => {
                if ((/[tj]s$/).test(relative)) {
                    return `import '${relative}';`;
                } else {
                    this.addWatchFile(file);
                    return '';
                }
            }).join('\n') : null;
        },
        async generateBundle(_outputOptions, bundle) {
            const systemjs = await emitSystemJs(this, production);
            await Promise.all([...inputChunks(bundle, input)].map(async ({chunk, src}) => await generateHtml({
                context: this,
                chunk,
                src,
                dest: path.relative(directory.src, src),
                base: path.relative(path.dirname(src), directory.src),
                systemjs,
            })));
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
