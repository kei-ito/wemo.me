import {isLocalScript} from './isLocalScript';

export const findLocalScripts = (
    $: CheerioStatic,
): Array<CheerioElement> => $('script[src]').toArray().filter(isLocalScript);
