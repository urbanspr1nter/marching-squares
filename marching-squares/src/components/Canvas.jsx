import * as React from 'react';
import {Dropdown} from 'react-bootstrap';
import { getState, getCase, getEndpointsForCase, getCoordsForCellAt, generateSamples } from '../lib/utils';
import './Canvas.css';

const Options = {
    Canvas: {
        width: 800,
        height: 800
    },
    Grid: {
        rows: 16,
        cols: 16
    },
    Isovalue: 0.5
};

const RESOLUTION = {
    ColumnGap: Options.Canvas.width / Options.Grid.cols,
    RowGap: Options.Canvas.height / Options.Grid.rows
};

function getSampleDimensions() {
    return {
        totalCol: Options.Grid.cols + 1,
        totalRow: Options.Grid.rows + 1
    };
}

function getSetKey(coordX, coordY) {
    return `${coordX},${coordY}`;
}

export function Canvas(props) {
    const [samples, setSamples] = React.useState(null);
    const [showGridOverlay, setShowGridOverlay] = React.useState(true);
    const canvas = React.useRef();
    const context = React.useRef();
    const valuesSet = React.useRef(new Set());
    const [isInterpolation, setIsInterpolation] = React.useState(true);
    const [isovalue, setIsovalue] = React.useState(0.4);


    const prepareCanvas = React.useCallback(() => {
        const c = document.querySelector('#canvas');
        canvas.current = c;
        context.current = canvas.current.getContext('2d');

        canvas.current.width = Options.Canvas.width;
        canvas.current.height = Options.Canvas.height;

        context.current.fillStyle = '#ffffff';
        context.current.clearRect(0, 0, Options.Canvas.width, Options.Canvas.height);
        context.current.strokeStyle = '#000000';
        context.current.font = "10px Arial Narrow";

        const ORIGIN = {
            x: Options.Canvas.width / 2,
            y: Options.Canvas.height / 2
        };

        if (showGridOverlay) {
            // Y AXES
            context.current.beginPath();
            context.current.moveTo(ORIGIN.x, 0);
            context.current.lineTo(ORIGIN.x, Options.Canvas.height);
            context.current.stroke();

            // X AXES
            context.current.beginPath();
            context.current.moveTo(0, ORIGIN.y);
            context.current.lineTo(Options.Canvas.width, ORIGIN.y);
            context.current.stroke();

            // Draw Grid
            context.current.strokeStyle = '#bababa';
            for(let i = RESOLUTION.ColumnGap; i < Options.Canvas.width; i += RESOLUTION.ColumnGap) {
                context.current.beginPath();
                context.current.moveTo(i, 0);
                context.current.lineTo(i, Options.Canvas.height);
                context.current.stroke();
            }
            for(let i = RESOLUTION.RowGap; i < Options.Canvas.height; i += RESOLUTION.RowGap) {
                context.current.beginPath();
                context.current.moveTo(0, i);
                context.current.lineTo(Options.Canvas.width, i);
                context.current.stroke();
            }
        }
        
        context.current.fillStyle = '#000000';
        context.current.strokeStyle = '#000000';        
    }, [showGridOverlay]);

    const drawValue = React.useCallback((c, currColIndex) => {
        context.current.fillStyle = '#000000';
        context.current.strokeStyle = '#000000';       

        if (currColIndex === Options.Grid.cols - 1) {
            const k1 = getSetKey(c.topRight.x, c.topRight.y);
            if(!valuesSet.current.has(k1)) {
                context.current.fillText(`${c.topRight.v.toPrecision(2)}`, c.topRight.x - 12, c.topRight.y+10);
                valuesSet.current.add(k1);
            }
            const k2 = getSetKey(c.bottomRight.x, c.bottomRight.y);
            if(!valuesSet.current.has(k2)) {
                context.current.fillText(`${c.bottomRight.v.toPrecision(2)}`, c.bottomRight.x - 12, c.bottomRight.y);
                valuesSet.current.add(k2);
            }                    
        } else {
            const k1 = getSetKey(c.topRight.x, c.topRight.y);
            if(!valuesSet.current.has(k1)) {
                context.current.fillText(`${c.topRight.v.toPrecision(2)}`, c.topRight.x, c.topRight.y+10);
                valuesSet.current.add(k1);

            }
            const k2 = getSetKey(c.bottomRight.x, c.bottomRight.y);
            if(!valuesSet.current.has(k2)) {
                context.current.fillText(`${c.bottomRight.v.toPrecision(2)}`, c.bottomRight.x, c.bottomRight.y);
                valuesSet.current.add(k2);
            }
        }
        const k0 = getSetKey(c.topLeft.x, c.topLeft.y);
        if(!valuesSet.current.has(k0)) {
            context.current.fillText(`${c.topLeft.v.toPrecision(2)}`, c.topLeft.x, c.topLeft.y+10);
            valuesSet.current.add(k0);
        }

        const k3 = getSetKey(c.bottomLeft.x, c.bottomLeft.y);
        if(!valuesSet.current.has(k3)) {
            context.current.fillText(`${c.bottomLeft.v.toPrecision(2)}`, c.bottomLeft.x, c.bottomLeft.y);
            valuesSet.current.add(k3);
        }   
    }, [valuesSet]);

    const renderValues = React.useCallback((samples) => {       
        if (!samples)
            return;

        const cells = [];

        for(let i = 0; i < Options.Grid.rows; i++) {
            cells[i] = [];
            for(let j = 0; j < Options.Grid.cols; j++) {
                const c = getCoordsForCellAt(i, j, RESOLUTION, samples);

                if (showGridOverlay) {
                    drawValue(c, j);
                }
                cells[i].push(c);
            }
        }

        const endpoints = [];
        for(let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[i].length; j++) {
                const values = [
                    getState(cells[i][j].topLeft.v, isovalue),
                    getState(cells[i][j].topRight.v, isovalue),
                    getState(cells[i][j].bottomRight.v, isovalue),
                    getState(cells[i][j].bottomLeft.v, isovalue)
                ];

                const bitCode = getCase(values);
                endpoints.push(
                    getEndpointsForCase(bitCode, cells[i][j], isovalue, isInterpolation
                ));
            }
        }

        context.current.lineWidth = 3;
        context.current.strokeStyle = '#000000';
        for(let i = 0; i < endpoints.length; i++) {
            context.current.beginPath();
            context.current.moveTo(endpoints[i][0].x, endpoints[i][0].y);
            context.current.lineTo(endpoints[i][1].x, endpoints[i][1].y);

            if (endpoints[i].length > 2) {
                context.current.moveTo(endpoints[i][2].x, endpoints[i][2].y);
                context.current.lineTo(endpoints[i][3].x, endpoints[i][3].y);
            }
            context.current.stroke();
        }
    }, [drawValue, showGridOverlay, isInterpolation, isovalue]);

    React.useEffect(() => {
        valuesSet.current = new Set();
        prepareCanvas();
        renderValues(samples);
    }, [samples, renderValues, prepareCanvas, showGridOverlay]);

    // Initial Load
    React.useEffect(() => {
        setSamples(generateSamples(getSampleDimensions()));
    }, []);

    const onRandomizeClick = React.useCallback(() => {
        setSamples(generateSamples(getSampleDimensions()));
    }, []);

    const onToggleGridOverlayClick = React.useCallback(() => {
        setShowGridOverlay(!showGridOverlay);
    }, [showGridOverlay]);

    const onMidpointMethodClick = React.useCallback(() => {
        setIsInterpolation(false);
    }, []);

    const onInterpolationMethodClick = React.useCallback(() => {
        setIsInterpolation(true);
    }, []);

    return (
        <div className="canvas-container">
            <div className="container">
                <div className="row">
                    <canvas id="canvas"></canvas>
                </div>
                <div className="row">&nbsp;</div>
                <div className="row">
                    <div className="col-sm">
                        <button type="button" className="btn btn-secondary" onClick={onRandomizeClick}>Randomize New Set</button>
                    </div>
                    <div className="col-sm">
                        <button type="button" className="btn btn-secondary" onClick={onToggleGridOverlayClick}>Toggle Grid Overlay</button>
                    </div>
                    <div className="col-sm">
                        <Dropdown>
                            <Dropdown.Toggle variant='Secondary'>
                                {isInterpolation? 'Linear Interpolation' : 'Midpoint'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#" onClick={onInterpolationMethodClick}>Linear Interpolation</Dropdown.Item>
                                <Dropdown.Item href="#" onClick={onMidpointMethodClick}>Midpoint</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>

        </div>
    );
}
