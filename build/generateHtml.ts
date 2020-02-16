import {promises as afs} from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import * as rollup from 'rollup';
import {emitAsset} from './emitAsset';
import {replaceReferences} from './replaceReferences';

export const generateHtml = async (
    props: {
        context: rollup.PluginContext,
        chunk: rollup.OutputChunk,
        src: string,
        dest: string,
        base: string,
        systemjs: string,
    },
): Promise<void> => {
    const $ = cheerio.load(await afs.readFile(props.src, 'utf8'));
    const base = props.base || '.';
    const head = $('head');
    const body = $('body');
    $('meta[charset]').remove();
    $('meta[name="viewport"]').remove();
    head.prepend(
        `<base href="${base}">`,
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width">',
    );
    const scripts = $('script[src^="."]').remove();
    if (0 < scripts.length) {
        const file = emitAsset(props.context, props.chunk.code, `${path.basename(props.src)}.js`);
        body.append(
            `<script src="${props.systemjs}"></script>`,
            `<script>System.import('./${file}')</script>`,
        );
    }
    const directory = path.dirname(props.src);
    await Promise.all([
        replaceReferences({...props, $, directory, attribute: 'src'}),
        replaceReferences({...props, $, directory, attribute: 'href'}),
    ]);
    props.context.emitFile({
        type: 'asset',
        fileName: props.dest,
        source: [
            '<!doctype html>',
            cheerio(head).html(),
            cheerio(body).html(),
        ].join(''),
    });
};
