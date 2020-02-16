import {promises as afs} from 'fs';
import * as cheerio from 'cheerio';

export const generateHtml = async (
    props: {
        source: string,
        base: string,
        file: string,
        systemjs: string,
    },
): Promise<string> => {
    const $ = cheerio.load(await afs.readFile(props.source, 'utf8'));
    const base = props.base || '.';
    $('script[src^="."]').remove();
    $('head')
    .prepend(`<base href="${base}">`)
    .append(`<script src="${props.systemjs}"></script>`);
    $('body').append(`<script>System.import('./${props.file}')</script>`);
    return $.html();
};
