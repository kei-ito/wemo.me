import {createElement} from 'react';
import {useDispatch} from 'react-redux';
import {SetFile} from '@wemo.me/core';
import {className} from './style.css';

export const BinaryEditor = () => {
    const dispatch = useDispatch();
    return createElement(
        'div',
        {
            className: className.e,
        },
        createElement(
            'input',
            {
                type: 'file',
                onChange: (event) => {
                    const file = (event.currentTarget.files || [null])[0];
                    if (file) {
                        dispatch(SetFile(file));
                    }
                },
            },
        ),
    );
};
