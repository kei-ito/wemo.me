import * as path from 'path';
import * as cheerio from 'cheerio';
import * as afs from '@nlib/afs';
import {Builder} from './Builder';

export class App {

    public readonly builder: Builder;

    public readonly appFile: string;

    public readonly replaces: Map<string, string>;

    public constructor(
        builder: Builder,
        appFile: string,
    ) {
        this.builder = builder;
        this.appFile = appFile;
        this.replaces = new Map();
    }

    public get relativePath(): string {
        return path.relative(this.builder.baseDir, this.appFile);
    }

    public get dest(): string {
        return path.join(this.builder.outDir, this.relativePath);
    }

    public async html(): Promise<string> {
        const $ = await this.loadCheerio();
        const head = $('head');
        if (head.find('base').length === 0) {
            head.prepend('<base>');
        }
        head.find('base').attr('href', this.builder.assetsPrefix);
        for (const script of $('script').toArray()) {
            const {attribs: {src}} = script;
            script.attribs.src = this.replaces.get(src) || src;
        }
        return $.html();
    }

    public relative(...fragments: Array<string>): string {
        return path.relative(path.dirname(this.appFile), path.join(...fragments)).replace(/^([^.])/, `.${path.sep}$1`);
    }

    public async loadHTML(): Promise<string> {
        const html = await afs.readFile(this.appFile, 'utf8');
        return html;
    }

    public async loadCheerio(): Promise<CheerioStatic> {
        return cheerio.load(await this.loadHTML());
    }

    public async getInputs(): Promise<Set<string>> {
        const $ = await this.loadCheerio();
        const inputs = new Set<string>();
        for (const {attribs: {src}} of $('script[src^="."]').toArray()) {
            if (src) {
                inputs.add(path.join(path.dirname(this.appFile), src));
            }
        }
        return inputs;
    }

    public toString(): string {
        return `App:${this.relativePath}`;
    }

}
