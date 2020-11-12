/**
 * Marching Squares Library Functions
 * @author Roger Ngo
 * 
 * November, 2020
 */

export function generateSamples(dimensions) {
    const samples = [];
    for(let i = 0; i < dimensions.totalRow; i++) {
        samples[i] = [];
        for(let j = 0; j < dimensions.totalCol; j++) {
            samples[i].push(Math.random());
        }
    }

    return samples;
}

export function getState(value, isovalue) {
    return value >= isovalue ? 1 : 0;
}

export function getCase(values) {
    if (values.length < 4) {
        throw new Error("There must be 4 values given to retrieve the case.");
    }
    
    let code = 0;
    for(let i = 0; i < values.length; i++) {
        code = (code << 1) | values[i];
    }
    
    return code & 15;
}

export function getT(f1, f2, isovalue) {
    const v2 = Math.max(f2.v, f1.v);
    const v1 = Math.min(f2.v, f1.v);
    return (isovalue - v1) / (v2 - v1);
}

function getEndpointByInterpolation(p0, p1, t) {
    const x = Math.trunc((1 - t) * p0.x + t * p1.x);
    const y = Math.trunc((1 - t) * p0.y + t * p1.y);

    return {x, y};
}

function getEndpointByMidpoint(p0, p1) {
    const x = Math.trunc(p0.x + ((p1.x - p0.x) / 2));
    const y = Math.trunc(p0.y + ((p1.y - p0.y) / 2));
    
    return {x, y}
}

export function getCoordsForCellAt(cellRow, cellColumn, RESOLUTION, samples) {
    const topLeft = {
        x: cellColumn * RESOLUTION.ColumnGap,
        y: cellRow * RESOLUTION.RowGap,
        v: samples[cellRow][cellColumn]
    };

    const topRight = {
        x: topLeft.x + RESOLUTION.ColumnGap,
        y: topLeft.y,
        v: samples[cellRow][cellColumn+1]
    };

    const bottomRight = {
        x: topLeft.x + RESOLUTION.ColumnGap,
        y: topLeft.y + RESOLUTION.RowGap,
        v: samples[cellRow + 1][cellColumn+1]
    };

    const bottomLeft = {
        x: topLeft.x,
        y: topLeft.y + RESOLUTION.RowGap,
        v: samples[cellRow + 1][cellColumn]
    };

    return {
        topLeft,
        topRight,
        bottomRight,
        bottomLeft
    };
}

export function getEndpointsForCase(c, subgrid, isovalue, isInterpolation) {
    const endpoints = [];
    
    // Structured as {x, y}
    const topLeft = subgrid.topLeft;
    const topRight = subgrid.topRight;
    const bottomRight = subgrid.bottomRight;
    const bottomLeft = subgrid.bottomLeft;
    
    let t1;
    let t2;

    let getEndpoint = isInterpolation
        ? getEndpointByInterpolation 
        : getEndpointByMidpoint;
    
    switch(c) {
        case 0:
        case 15:
            endpoints.push({x: 0, y: 0}, {x: 0, y: 0});
            break;
        case 1:
        case 14:
            t1 = getT(topLeft, bottomLeft, isovalue);
            t2 = getT(bottomLeft, bottomRight, isovalue);
            
            endpoints.push(
                getEndpoint(topLeft, bottomLeft, t1),
                getEndpoint(bottomLeft, bottomRight, t2)
            );
            break;
        case 2:
        case 13:
            t1 = getT(topRight, bottomRight, isovalue);
            t2 = getT(bottomLeft, bottomRight, isovalue);
            
            endpoints.push(
                getEndpoint(topRight, bottomRight, t1),
                getEndpoint(bottomLeft, bottomRight, t2)
            );
            break;
        case 3:
        case 12:
            t1 = getT(topLeft, bottomLeft, isovalue);
            t2 = getT(topRight, bottomRight, isovalue);
            
            endpoints.push(
                getEndpoint(topLeft, bottomLeft, t1),
                getEndpoint(topRight, bottomRight, t2)
            );
            break;
        case 4:
        case 11:
            t1 = getT(topLeft, topRight, isovalue);
            t2 = getT(topRight, bottomRight, isovalue);
            
            endpoints.push(
                getEndpoint(topLeft, topRight, t1),
                getEndpoint(topRight, bottomRight, t2)
            );
            break;
        case 5:
        case 10:
            t1 = getT(topLeft, topRight, isovalue);
            t2 = getT(topLeft, bottomLeft, isovalue);
            
            const p0 = getEndpoint(topLeft, topRight, t1);
            const p1 = getEndpoint(topLeft, bottomLeft, t2);

            t1 = getT(bottomLeft, bottomRight, isovalue);
            t2 = getT(topRight, bottomRight, isovalue);
                        
            const p2 = getEndpoint(bottomLeft, bottomRight, t1);
            const p3 = getEndpoint(topRight, bottomRight, t2);

            if (c === 5) {
                endpoints.push(p0, p3, p1, p2);
            } else if(c === 10) {
                endpoints.push(p0, p1, p2, p3);
            }
            break;
        case 6:
        case 9:
            t1 = getT(topLeft, topRight, isovalue);
            t2 = getT(bottomLeft, bottomRight, isovalue);
            
            endpoints.push(
                getEndpoint(topLeft, topRight, t1),
                getEndpoint(bottomLeft, bottomRight, t2)
            );
            break;
        case 7:
        case 8:
            t1 = getT(topLeft, topRight, isovalue);
            t2 = getT(topLeft, bottomLeft, isovalue);
            
            endpoints.push(
                getEndpoint(topLeft, topRight, t1),
                getEndpoint(topLeft, bottomLeft, t2)
            );
            break
        default:
            break;
    }
    
    return endpoints;
}
