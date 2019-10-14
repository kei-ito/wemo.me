import * as path from 'path';
import * as rollup from 'rollup';
import * as afs from '@nlib/afs';
import * as globby from 'globby';
import {App} from './App';
import {getPlugins} from './getPlugins';

export class Builder {

    public readonly watchMode: boolean;

    public readonly startAt: Date;

    public readonly baseDir: string;

    public readonly outDir: string;

    public readonly appFile: string;

    public readonly assetsPrefix: string;

    protected apps?: Array<App>;

    public constructor(
        params: {
            watchMode: boolean,
            baseDir: string,
            outDir: string,
            appFile: string,
        },
    ) {
        this.startAt = new Date();
        this.watchMode = params.watchMode;
        this.baseDir = afs.absolutify(params.baseDir);
        this.outDir = afs.absolutify(params.outDir);
        this.appFile = path.basename(params.appFile);
        this.assetsPrefix = [
            'assets',
            `${this.startAt.getFullYear()}`.padStart(4, '0'),
            `${this.startAt.getMonth() + 1}`.padStart(2, '0'),
            `${this.startAt.getDate()}`.padStart(2, '0'),
            '',
        ].join('/');
        if (params.appFile && params.appFile !== this.appFile) {
            throw new Error(`Invalid appFile: ${params.appFile}`);
        }
    }

    public get assetsDir(): string {
        return path.join(this.outDir, this.assetsPrefix);
    }

    public get appFilePattern(): string {
        return path.join(this.baseDir, '**', this.appFile);
    }

    public async findApps(): Promise<Array<App>> {
        let {apps} = this;
        if (!apps) {
            const appFiles = await globby(
                this.appFilePattern,
                {onlyFiles: true, absolute: true},
            );
            apps = this.apps = appFiles.map((appFile) => new App(this, appFile));
        }
        return apps;
    }

    public async getInputs(): Promise<Set<string>> {
        const apps = await this.findApps();
        const results = await Promise.all(apps.map(async (app) => {
            const inputs = await app.getInputs();
            return inputs;
        }));
        const allInputs = new Set<string>();
        for (const inputs of results) {
            for (const input of inputs) {
                allInputs.add(input);
            }
        }
        return allInputs;
    }

    public async generateRollupPlugin(): Promise<rollup.Plugin> {
        const apps = await this.findApps();
        return {
            name: 'wemo.me',
            renderChunk(_code, chunk) {
                const {facadeModuleId, fileName} = chunk;
                if (facadeModuleId && fileName) {
                    for (const app of apps) {
                        const relativePath = app.relative(facadeModuleId);
                        app.replaces.set(relativePath, fileName);
                    }
                }
                return null;
            },
            async generateBundle() {
                await Promise.all(apps.map(async (app) => {
                    await afs.updateFile(app.dest, await app.html());
                }));
            },
        };
    }

    public async getInputOptions(): Promise<rollup.InputOptions> {
        return {
            input: [...await this.getInputs()],
            plugins: await getPlugins(this),
        };
    }

    public async getOutputOptions(): Promise<rollup.OutputOptions> {
        await Promise.resolve(this);
        return {
            dir: this.assetsDir,
            format: 'system',
            entryFileNames: '[name].[hash].js',
            sourcemap: this.watchMode,
        };
    }

    public async build(): Promise<void> {
        if (this.watchMode) {
            await this.watch();
            return;
        }
        const bundle = await rollup.rollup(await this.getInputOptions());
        await bundle.generate(await this.getOutputOptions());
    }

    public async watch(): Promise<void> {
        await Promise.resolve(this);
    }

}
