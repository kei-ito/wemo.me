import {promises as afs} from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import {findReferences, IReference} from './findReferences';
import {findLocalScripts} from './findLocalScripts';

export const loadHTML = async (
    id: string,
): Promise<{references: Set<IReference>, code: string}> => {
    const $ = cheerio.load(await afs.readFile(id, 'utf8'));
    const directory = path.dirname(id);
    return {
        references: await findReferences({$, directory}),
        code: findLocalScripts($).map((element) => `import '${element.attribs.src}';`).join('\n'),
    };
};
