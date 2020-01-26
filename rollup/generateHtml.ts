export const generateHtml = (
    props: {
        systemjs: string,
        scripts: Array<string>,
    },
) => [
    '<!doctype html>',
    '<meta charset="utf-8">',
    // '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">',
    '<meta name="viewport" content="width=device-width">',
    `<script src="${props.systemjs}"></script>`,
    ...props.scripts.map((script) => `<script>System.import('./${script}')</script>`),
].join('\n');
