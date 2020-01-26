import * as fs from 'fs';
import * as rollup from 'rollup';

export const emitSystemJs = async (
    context: rollup.PluginContext,
): Promise<string> => {
    const filePath = require.resolve('systemjs/dist/system.min.js');
    const assetReferenceId = context.emitFile({
        type: 'asset',
        name: 'system.js',
        source: await fs.promises.readFile(filePath),
    });
    return context.getFileName(assetReferenceId);
};
