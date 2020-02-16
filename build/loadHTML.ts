import {promises as afs} from 'fs';
import * as cheerio from 'cheerio';

export const loadHTML = async (
    htmlFile: string,
): Promise<string> => {
    const $ = cheerio.load(await afs.readFile(htmlFile, 'utf8'));
    return $('script[src^="."]').toArray().map((element) => `import '${element.attribs.src}';`).join('\n');
};
