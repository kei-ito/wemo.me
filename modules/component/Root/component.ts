import {createElement, Fragment} from 'react';
import {Window} from '../Window/component';

export const Root = () => createElement(
    Fragment,
    null,
    createElement(Window),
    createElement(Window),
    createElement(Window),
    createElement(Window),
);
