import {promises as afs} from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import {findReferences, IReference} from './findReferences';

export const loadHTML = async (
    id: string,
): Promise<Set<IReference>> => await findReferences({
    $: cheerio.load(await afs.readFile(id, 'utf8')),
    directory: path.dirname(id),
});
