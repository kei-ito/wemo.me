import {document, Date, Math} from '@wemo.me/global';
import {className} from './style.css';

const NS = 'http://www.w3.org/2000/svg';

const fix = (
    x: number,
): string => x.toFixed(2).replace(/\.?0*$/, '');

const sun = (
    x: number,
    y: number,
    step = 40,
    r1 = 4,
    r2 = r1 + 3,
    r3 = r2 + 2,
): string => {
    const d = [`M${x + r1} ${fix(y)}A${r1} ${r1} 0 1 1 ${x + r1} ${fix(y - 0.01)}`];
    for (let deg = 0; deg <= 360; deg += step) {
        const rad = Math.PI * deg / 180;
        const rx = Math.cos(rad);
        const ry = Math.sin(rad);
        d.push(
            `M${fix(x + rx * r2)} ${fix(y + ry * r2)}`,
            `L${fix(x + rx * r3)} ${fix(y + ry * r3)}`,
        );
    }
    return d.join('');
};

const moon = (
    x: number,
    y: number,
    r = 7,
) => `M${x} ${y - r}A${r} ${r} 0 1 1 ${x - r} ${y}A4 4 0 1 0 ${x} ${y - r}z`;

const createPath = (
    unit: number,
): SVGPathElement => {
    const pathElement = document.createElementNS(NS, 'path');
    const offset = 2;
    pathElement.setAttribute('d', [
        moon(unit / 2 + offset, unit / 2),
        sun(unit * 2.5 - offset, unit / 2),
    ].join(''));
    return pathElement;
};

const filters = {
    fill: (
        rgba: [number, number, number, number],
    ) => {
        const feComponentTransferElement = document.createElementNS(NS, 'feComponentTransfer');
        feComponentTransferElement.setAttribute('in', 'SourceAlpha');
        ['R', 'G', 'B'].forEach((color, index) => {
            const feFuncElement = document.createElementNS(NS, `feFunc${color}`);
            feFuncElement.setAttribute('type', 'discrete');
            feFuncElement.setAttribute('tableValues', fix(rgba[index]));
            feComponentTransferElement.append(feFuncElement);
        });
        const feFuncAElement = document.createElementNS(NS, 'feFuncA');
        feFuncAElement.setAttribute('type', 'linear');
        feFuncAElement.setAttribute('slope', fix(rgba[3]));
        feComponentTransferElement.append(feFuncAElement);
        return feComponentTransferElement;
    },
    blur: (
        stdDeviation: number,
    ) => {
        const feGaussianBlurElement = document.createElementNS(NS, 'feGaussianBlur');
        feGaussianBlurElement.setAttribute('stdDeviation', `${stdDeviation}`);
        return feGaussianBlurElement;
    },
    offset: (
        d: [number, number],
    ) => {
        const feOffsetElement = document.createElementNS(NS, 'feOffset');
        feOffsetElement.setAttribute('dx', `${d[0]}`);
        feOffsetElement.setAttribute('dy', `${d[1]}`);
        return feOffsetElement;
    },
};

const chainFilters = (
    props: {
        source: string,
        elements: Array<SVGElement>,
        prefix: string,
    },
) => ({
    elements: props.elements,
    source: props.elements.reduce((source, element, index) => {
        const result = `${props.prefix}-${index}`;
        element.setAttribute('in', source);
        element.setAttribute('result', result);
        return result;
    }, props.source),
});

const createBlurFilter = (
    props: {
        offset: [number, number],
        stdDeviation: number,
        rgba: [number, number, number, number],
        id?: string,
    },
) => {
    const id = props.id || `Filter-${Date.now().toString(34)}`;
    const chained = chainFilters({
        prefix: id,
        source: 'SourceAlpha',
        elements: [
            filters.fill(props.rgba),
            filters.blur(props.stdDeviation),
            filters.offset(props.offset),
        ],
    });
    const feCompositeElement = document.createElementNS(NS, 'feComposite');
    feCompositeElement.setAttribute('in', 'SourceGraphic');
    feCompositeElement.setAttribute('in2', chained.source);
    feCompositeElement.setAttribute('operator', 'over');
    const filterElement = document.createElementNS(NS, 'filter');
    filterElement.append(...chained.elements, feCompositeElement);
    filterElement.id = id;
    return filterElement;
};

const createCircle = (
    x: number,
    y: number,
    r: number,
) => {
    const filterElement = createBlurFilter({
        offset: [1, 1],
        stdDeviation: 1,
        rgba: [0, 0, 0, 0.5],
    });
    const circleElement = document.createElementNS(NS, 'circle');
    circleElement.setAttribute('cx', `${fix(x)}`);
    circleElement.setAttribute('cy', `${fix(y)}`);
    circleElement.setAttribute('r', `${fix(r)}`);
    circleElement.setAttribute('stroke', 'none');
    circleElement.setAttribute('fill', 'rgb(255,255,255)');
    circleElement.setAttribute('filter', `url(#${filterElement.id})`);
    return [filterElement, circleElement];
};

const createToggleElement = () => {
    const unit = 30;
    const svgElement = document.createElementNS(NS, 'svg');
    svgElement.setAttribute('viewBox', `0 0 ${unit * 3} ${unit}`);
    svgElement.append(createPath(unit), ...createCircle(unit * 1.5, unit * 0.5, unit * 0.32));
    svgElement.classList.add(className.e);
    return svgElement;
};

const onClick = (event: MouseEvent) => {
    const attr = 'data-inverse-appearance';
    event.preventDefault();
    const element = document.documentElement;
    if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
    } else {
        element.setAttribute(attr, '');
    }
};

for (const element of document.querySelectorAll('.AppearanceToggle')) {
    while (element.lastChild) {
        element.lastChild.remove();
    }
    element.appendChild(createToggleElement()).addEventListener('click', onClick);
}
