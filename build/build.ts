import * as rollup from 'rollup';
import {appPlugin} from './appPlugin';

export const build = async () => {
    const bundle = await rollup.rollup({plugins: [await appPlugin({production: true})]});
    await bundle.write({});
};

if (!module.parent) {
    build().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
