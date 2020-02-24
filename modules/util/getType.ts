import {Object} from '@wemo.me/global';
const {prototype: {toString}} = Object;

export const getType = (
    input: any,
) => toString.call(input).slice(8, -1);
