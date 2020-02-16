import {promises as afs} from 'fs';
import * as path from 'path';
import * as rollup from 'rollup';
import * as cheerio from 'cheerio';
import {emitAsset} from './emitAsset';

export const replaceReferences = async (
    props: {
        context: rollup.PluginContext,
        $: CheerioStatic,
        directory: string,
        attribute: string,
    },
) => {
    await Promise.all(props.$(`[${props.attribute}^="."]`).toArray().map(async (element) => {
        const file = path.join(props.directory, element.attribs[props.attribute]);
        if (path.extname(file) === '.html') {
            return;
        }
        const stats = await afs.stat(file).catch((error) => {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        });
        if (stats && stats.isFile()) {
            cheerio(element).attr(
                props.attribute,
                emitAsset(
                    props.context,
                    await afs.readFile(file),
                    path.basename(file),
                ),
            );
        }
    }));
};
