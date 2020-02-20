import {promises as afs} from 'fs';
import * as rollup from 'rollup';
import {hash} from './hash';

export const emitSystemJs = async (
    context: rollup.PluginContext,
): Promise<string> => {
    const [code, map, src] = await Promise.all([
        afs.readFile(require.resolve('systemjs/dist/system.min.js')),
        afs.readFile(require.resolve('systemjs/dist/system.min.js.map')),
        afs.readFile(require.resolve('systemjs/dist/system.js')),
    ]);
    const fileName = `system-${hash(code)}.js`;
    const referenceId = {
        code: context.emitFile({
            type: 'asset',
            fileName,
            source: Buffer.concat([
                code,
                Buffer.from(`\n//# sourceMappingURL=${fileName}.map`),
            ]),
        }),
        map: context.emitFile({
            type: 'asset',
            fileName: `${fileName}.map`,
            source: JSON.stringify({
                ...JSON.parse(`${map}`),
                sources: ['node_modules/systemjs/dist/system.js'],
                sourcesContent: [`${src}`],
            }),
        }),
    };
    return context.getFileName(referenceId.code);
};
