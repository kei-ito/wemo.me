import * as rollup from 'rollup';
export const getPlugins: (
    props?: {
        plugins?: Array<rollup.Plugin>,
        production?: boolean,
    },
) => Array<rollup.Plugin>;
