import * as rollup from 'rollup';
import {Builder} from './Builder';
export const getPlugins: (builder: Builder) => Promise<Array<rollup.Plugin>>;
