import * as path from 'path';
import * as rollup from 'rollup';
import {getPlugins} from './getPlugins';
import {listFiles} from './listFiles';
import {loadHTML} from './loadHTML';
import {generateHtml} from './generateHtml';
import {inputChunks} from './inputChunks';
import {emitSystemJs} from './emitSystemJs';

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

export const createModuleResolver = (
    prefix: string,
    directory: string,
) => (
    importee: string,
) => {
    if (importee === 'systemjs') {
        return require.resolve('systemjs/dist/system.js');
    }
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
            plugins: getPlugins({plugins: options.plugins, production}),
        }),
        outputOptions: (outputOptions) => ({
            ...outputOptions,
            format: 'system',
            dir: directory.output,
            sourcemap: true,
            preserveModules: true,
            sourcemapPathTransform: (relativePath) => path.relative(
                directory.root,
                path.join(directory.src, relativePath),
            ),
        }),
        resolveId: createModuleResolver('@wemo.me/', directory.modules),
        async load(id) {
            if (input.has(id)) {
                const {references, code} = await loadHTML(id);
                [...references].forEach(({file}) => this.addWatchFile(file));
                return code;
            }
            return null;
        },
        async generateBundle(_outputOptions, bundle) {
            const systemjs = await emitSystemJs(this);
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
