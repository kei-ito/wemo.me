import * as afs from '@nlib/afs';

export const listFiles = async (
    {directory, filter}: {
        directory: string,
        filter: (file: string) => boolean,
    },
): Promise<Set<string>> => {
    const files = new Set<string>();
    for await (const {stats, path: file} of afs.createDirectoryWalker(directory)) {
        if (stats.isFile() && filter(file)) {
            files.add(file);
        }
    }
    return files;
};
