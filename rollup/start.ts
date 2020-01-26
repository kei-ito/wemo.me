import * as path from 'path';
import * as rollup from 'rollup';
import * as sable from 'sable';
import {appPlugin} from './appPlugin';

export const start = async () => {
    const watcher = rollup.watch([{plugins: [appPlugin()]}]);
    watcher.on('event', (event) => {
        const date = new Date();
        const hh = `${date.getHours()}`.padStart(2, '0');
        const mm = `${date.getMinutes()}`.padStart(2, '0');
        console.log(`${hh}:${mm} ${event.code}`);
    });
    await new Promise((resolve, reject) => {
        const onEvent = (
            event: rollup.RollupWatcherEvent,
        ) => {
            switch (event.code) {
            case 'BUNDLE_END':
                resolve();
                break;
            case 'ERROR':
                reject(event.error);
                break;
            default:
            }
        };
        watcher.on('event', onEvent);
    });
    const server = await sable.startServer({
        documentRoot: path.join(__dirname, '../output'),
    });
    console.log(server.address());
};

if (!module.parent) {
    start().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
