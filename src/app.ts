import './base.css';
import * as css from './app.css';

const getMessage = (
    name: string,
) => `Hello! ${name}`;

import('./a').catch((error) => {
    document.body.insertAdjacentText('beforeend', `${error}`);
});

document.body.insertAdjacentText('beforeend', JSON.stringify({css, m: getMessage('Foo')}));
