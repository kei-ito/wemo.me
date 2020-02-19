import * as afs from '@nlib/afs';

export const listFiles = async (
    {directory, filter, ignored = new Set()}: {
        directory: string,
        filter: (file: string) => boolean,
        ignored?: Set<string>,
    },
): Promise<Set<string>> => {
    const files = new Set<string>();
    for await (const {stats, path: file} of afs.createDirectoryWalker(directory)) {
        if (!ignored.has(file) && stats.isFile() && filter(file)) {
            files.add(file);
        }
    }
    return files;
};
