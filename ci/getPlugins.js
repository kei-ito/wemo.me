const embedCSS = require('rollup-plugin-embed-css');
const url = require('rollup-plugin-url');
const {default: svgr} = require('@svgr/rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const sucrase = require('rollup-plugin-sucrase');
const {terser} = require('rollup-plugin-terser');
const commonjs = require('rollup-plugin-commonjs');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactIS = require('react-is');

exports.getPlugins = async (builder) => [
    embedCSS(),
    svgr({include: /\.svg$/}),
    url({
        include: /\.(jpg|png|gif)$/,
        limit: 1024 * 5,
        destDir: builder.assetsDir,
    }),
    nodeResolve({extensions: ['.js', '.ts']}),
    replace({
        'process.env.NODE_ENV': JSON.stringify(builder.watchMode ? '' : 'production'),
    }),
    commonjs({
        namedExports: {
            [require.resolve('react')]: Object.keys(React),
            [require.resolve('react-dom')]: Object.keys(ReactDOM),
            [require.resolve('react-is')]: Object.keys(ReactIS),
        },
    }),
    sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript'],
    }),
    builder.watchMode ? null : terser(),
    await builder.generateRollupPlugin(),
];
