exports.getPlugins = (
    plugins = [],
) => [
    require('@rollup/plugin-sucrase')({transforms: ['typescript']}),
    require('rollup-plugin-embed-css')(),
    require('@rollup/plugin-node-resolve')(),
    require('@rollup/plugin-commonjs')(),
    ...plugins,
];
