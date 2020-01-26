import './base.css';
import {Object, document, JSON} from '@wemo.me/global';

const getMessage = (
    name: string,
) => `Hello! ${name} ${Object}`;

document.body.insertAdjacentText('beforeend', JSON.stringify({m: getMessage('Foo')}));
