import {Provider} from 'react-redux';
import {createElement} from 'react';
import {render} from 'react-dom';
import {Root} from '@wemo.me/component';
import {store} from '@wemo.me/core';
import {document} from '@wemo.me/global';
import {className} from './base.css';

const appElement = document.body.appendChild(document.createElement('div'));
appElement.classList.add(className.app);
render(createElement(Provider, {store}, createElement(Root)), appElement);
