import {promises as afs} from 'fs';
import * as path from 'path';

export interface IReference {
    relative: string,
    file: string,
    element: CheerioElement,
    attribute: string,
}

export const findReferences = async (
    props: {
        $: CheerioStatic,
        directory: string,
    },
): Promise<Set<IReference>> => {
    const references = new Set<IReference>();
    await Promise.all(['src', 'href'].map(async (attribute) => {
        await Promise.all(props.$(`[${attribute}^="."]`).toArray().map(async (element) => {
            const relative = element.attribs[attribute];
            const file = path.join(props.directory, relative);
            const stats = await afs.stat(file).catch((error) => {
                if (error.code === 'ENOENT') {
                    return null;
                }
                throw error;
            });
            if (stats && stats.isFile()) {
                references.add({relative, file, element, attribute});
            }
        }));
    }));
    return references;
};
