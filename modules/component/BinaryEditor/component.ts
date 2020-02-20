import {createElement} from 'react';
import {className} from './style.css';

export const BinaryEditor = () => {
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
                        file.slice();
                    }
                },
            },
        ),
    );
};
