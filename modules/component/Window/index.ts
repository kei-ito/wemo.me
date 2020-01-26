import {createElement} from 'react';
import {className} from './style.css';

export const Root = () => createElement(
    'div',
    {className: className.e},
    'Window Component',
);
