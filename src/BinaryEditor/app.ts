import '../base.css';
import {document, Promise} from '@wemo.me/global';
import {printError} from '@wemo.me/util';
import {className} from './style.css';

Promise.all([
    import('react-redux'),
    import('react'),
    import('react-dom'),
    import('@wemo.me/component'),
    import('@wemo.me/core'),
])
.then(([redux, React, ReactDOM, Component, Core]) => {
    const appElement = document.body.appendChild(document.createElement('div'));
    appElement.classList.add(className.app);
    ReactDOM.render(
        React.createElement(
            redux.Provider,
            {store: Core.store},
            React.createElement(Component.Root),
        ),
        appElement,
    );
})
.catch(printError);
