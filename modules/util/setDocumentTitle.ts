import {document} from '@wemo.me/global';
let suffix: string | undefined;

export const setDocumentTitle = (
    title: string,
    newSuffix?: string,
) => {
    if (newSuffix) {
        suffix = newSuffix;
    }
    document.title = suffix ? `${title}・${suffix}` : title;
    for (const element of document.querySelectorAll('[data-sync-title')) {
        element.textContent = title;
    }
};
