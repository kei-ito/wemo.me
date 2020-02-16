import * as path from 'path';
import * as rollup from 'rollup';
import {hash} from './hash';

export const emitAsset = (
    context: rollup.PluginContext,
    source: string | Buffer,
    name: string,
): string => {
    const ext = path.extname(name);
    return context.getFileName(context.emitFile({
        type: 'asset',
        fileName: `${name.slice(0, -ext.length)}-${hash(source)}${ext}`,
        source,
    }));
};
