import '../base.css';
import {document, Promise, Error} from '@wemo.me/global';
import {printError} from '@wemo.me/util';

Promise.all([
    import('react-redux'),
    import('react'),
    import('react-dom'),
    import('@wemo.me/component'),
    import('@wemo.me/core'),
])
.then(([redux, React, ReactDOM, Component, Core]) => {
    const appElement = document.querySelector('#App');
    if (!appElement) {
        throw new Error('NoAppElement');
    }
    ReactDOM.render(
        React.createElement(
            redux.Provider,
            {store: Core.store},
            React.createElement(Component.BinaryEditor),
        ),
        appElement,
    );
})
.catch(printError);
