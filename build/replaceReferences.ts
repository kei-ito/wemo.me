import {promises as afs} from 'fs';
import * as path from 'path';
import * as rollup from 'rollup';
import * as cheerio from 'cheerio';
import {emitAsset} from './emitAsset';
import {findReferences} from './findReferences';

export const replaceReferences = async (
    props: {
        context: rollup.PluginContext,
        $: CheerioStatic,
        directory: string,
    },
) => {
    for (const {file, element, attribute} of await findReferences(props)) {
        if (element.tagName === 'link' && element.attribs.rel === 'include') {
            cheerio(element).replaceWith((await afs.readFile(file, 'utf8')).trim());
        } else if (path.extname(file) !== '.html') {
            cheerio(element).attr(
                attribute,
                emitAsset(
                    props.context,
                    await afs.readFile(file),
                    path.basename(file),
                ),
            );
        }
    }
};
