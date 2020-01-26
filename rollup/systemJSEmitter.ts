import * as fs from 'fs';
import * as rollup from 'rollup';

export class SystemJSEmitter {

    private assetReferenceId?: string;

    public async emit(
        context: rollup.PluginContext,
    ): Promise<string> {
        if (!this.assetReferenceId) {
            const filePath = require.resolve('systemjs/dist/system.min.js');
            this.assetReferenceId = context.emitFile({
                type: 'asset',
                name: 'system.js',
                source: await fs.promises.readFile(filePath),
            });
        }
        return context.getFileName(this.assetReferenceId);
    }

}
