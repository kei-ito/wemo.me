import '../base.css';
import {document, Promise, Error} from '@wemo.me/global';
import {printError} from '@wemo.me/util';

Promise.all([
    import('redux'),
    import('react-redux'),
    import('react'),
    import('react-dom'),
    import('@wemo.me/component'),
    import('@wemo.me/core'),
    import('redux-saga/effects'),
])
.then(([Redux, ReactRedux, React, ReactDOM, Component, Core, Effects]) => {
    const appElement = document.querySelector('#App');
    if (!appElement) {
        throw new Error('NoAppElement');
    }
    const sagaMiddleware = Core.createSagaMiddleware();
    const store = Redux.createStore(Redux.combineReducers({
        Environment: Core.EnvironmentReducer,
        BinaryEditor: Core.BinaryEditorReducer,
    }), Redux.applyMiddleware(sagaMiddleware));
    ReactDOM.render(
        React.createElement(
            ReactRedux.Provider,
            {store},
            React.createElement(Component.BinaryEditor),
        ),
        appElement,
    );
    sagaMiddleware.run(function* () {
        yield Effects.all([
            Core.logSaga(),
            ...Core.EnvironmentSaga,
            ...Core.BinaryEditorSaga,
        ]);
    });
    store.dispatch(Core.Reboot());
})
.catch(printError);
