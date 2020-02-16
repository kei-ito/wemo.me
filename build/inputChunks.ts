import * as rollup from 'rollup';

export const inputChunks = function* (
    bundle: rollup.OutputBundle,
    input: Set<string>,
) {
    for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
            const src = chunk.facadeModuleId || '';
            if (input.has(src)) {
                yield {name, chunk, src};
            }
        }
    }
};
