import {createElement, Fragment} from 'react';
import {className} from './style.css';
import {Window} from '../Window/component';

export const Root = () => createElement(
    Fragment,
    {className: className.e},
    createElement(Window),
    createElement(Window),
    createElement(Window),
    createElement(Window),
);
