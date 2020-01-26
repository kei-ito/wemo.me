const sucrase = require('@rollup/plugin-sucrase');
const commonJs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const nodeResolve = require('@rollup/plugin-node-resolve');
const embedCSS = require('rollup-plugin-embed-css');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactIS = require('react-is');

exports.getPlugins = ({
    plugins = [],
    production = false,
}) => [
    replace({'process.env.NODE_ENV': JSON.stringify(production ? 'production' : '')}),
    sucrase({transforms: ['typescript']}),
    embedCSS(),
    nodeResolve(),
    commonJs({
        namedExports: {
            [require.resolve('react')]: Object.keys(React),
            [require.resolve('react-dom')]: Object.keys(ReactDOM),
            [require.resolve('react-is')]: Object.keys(ReactIS),
        },
    }),
    ...plugins,
];
