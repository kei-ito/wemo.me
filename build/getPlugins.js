const sucrase = require('@rollup/plugin-sucrase');
const embedCSS = require('rollup-plugin-embed-css');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonJs = require('@rollup/plugin-commonjs');

exports.getPlugins = (
    plugins = [],
) => [
    sucrase({transforms: ['typescript']}),
    embedCSS(),
    nodeResolve(),
    commonJs(),
    ...plugins,
];
