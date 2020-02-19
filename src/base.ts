import './AppearanceToggle/index';
import {document} from '@wemo.me/global';
import {setDocumentTitle} from '@wemo.me/util';
{
    const titleElement = document.querySelector('title');
    const title = titleElement && titleElement.textContent;
    if (title) {
        setDocumentTitle(title, 'Kei Ito');
    }
}
