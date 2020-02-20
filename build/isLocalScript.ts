export const isLocalScript = (
    {tagName, attribs}: CheerioElement,
): boolean => tagName === 'script'
&& (attribs.src.startsWith('.') || !attribs.src.includes('::/'))
&& (!attribs.type || (/(?:application|text)\/(?:java|ecma)script/).test(attribs.type));
