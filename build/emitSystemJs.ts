import {promises as afs} from 'fs';
import * as rollup from 'rollup';
import {hash} from './hash';

export const emitSystemJs = async (
    context: rollup.PluginContext,
    production = false,
): Promise<string> => {
    const filePath = require.resolve(`systemjs/dist/system${production ? '.min' : ''}.js`);
    const source = await afs.readFile(filePath);
    return context.getFileName(context.emitFile({
        type: 'asset',
        fileName: `system-${hash(source)}.js`,
        source,
    }));
};
