import {NEGATIVE_HIGH, NEGATIVE_LOW, POSITIVE_HIGH, POSITIVE_LOW} from './colors.js';

// TODO check scope für alles

let s2 = Math.sqrt(2);
let PI = Math.PI;
let GRADIENT_STEP_COUNT = 100;

let getColorCoords = (x, y, size) => {
    let xd = (x - y) / s2;
    let yd = (size / s2) - (s2 * y) - xd;
    return {x: xd, y: yd};
};

let createTriangleImageData = (image, pixels, rightColor, leftColor) => {  // TODO css and divs?!

    let size = image.width;
    let sizeq = image.width / s2;

    // Color interpolation : http://bl.ocks.org/syntagmatic/5bbf30e8a658bcd5152b

    let X = d3.scaleLinear()
        .domain([0, sizeq])
        .range(['white', leftColor]);

    let Y = d3.scaleLinear()
        .domain([0, sizeq])
        .range(['white', rightColor]);

    let colorPixels = pixels.map((p) => {
        let color = d3.scaleLinear()
            .domain([-1, 1])
            .range([X(p.colorCoords.x), Y(p.colorCoords.y)])
            .interpolate(d3.interpolateRgb);

        let strength = (p.colorCoords.y - p.colorCoords.x) / (sizeq);

        let c = d3.rgb(color(strength));

        return {
            x: p.coords.x,
            y: p.coords.y,
            color: c
        }

    });

    colorPixels.forEach((cp) => {
        let pixelIndex = 4*(cp.y*size + cp.x);

        image.data[pixelIndex]     = cp.color.r;
        image.data[pixelIndex + 1] = cp.color.g;
        image.data[pixelIndex + 2] = cp.color.b;
        image.data[pixelIndex + 3] = 255;
    });

};

export const makeGradient = function(placeForCanvas){
    if (typeof placeForCanvas === 'string')
        placeForCanvas = d3.select(placeForCanvas);

    placeForCanvas.classed('gradient-container', true);
    
    let canvas = placeForCanvas.append('canvas')
        .attr('width', GRADIENT_STEP_COUNT)
        .attr('height', GRADIENT_STEP_COUNT)
        .style('image-rendering', 'pixelated')
        .classed('gradient-canvas', 'true')
        .node();

    let context = canvas.getContext('2d');

    let image = context.createImageData(GRADIENT_STEP_COUNT, GRADIENT_STEP_COUNT);

    let arrayNorm = [];
    for( let x = 0; x <= GRADIENT_STEP_COUNT/2; x++ ) {
        for (let y = 0; y <= x; y++)
            arrayNorm.push({x: x, y: y});
    }
    for (let x = GRADIENT_STEP_COUNT/2; x <= GRADIENT_STEP_COUNT; x++) {
        for (let y = 0; y <= GRADIENT_STEP_COUNT - x; y++)
            arrayNorm.push({x: x, y: y});
    }

    let pixelsTop = arrayNorm.map( (an) => {return{
        coords: an,
        colorCoords: getColorCoords(an.x, an.y, GRADIENT_STEP_COUNT)
    }} );

    let rotateToRight = (p) => {return {x: GRADIENT_STEP_COUNT-p.y, y: p.x}};
    let pixelsRight = pixelsTop.map((pt) => {return{
        coords: rotateToRight(pt.coords),
        colorCoords: pt.colorCoords
    }} );

    let rotateToBottom = (p) => {return {x: GRADIENT_STEP_COUNT-p.x, y: GRADIENT_STEP_COUNT-p.y }};
    let pixelsBottom = pixelsTop.map((pt) => {return{
        coords: rotateToBottom(pt.coords),
        colorCoords: pt.colorCoords
    }} );

    let rotateToLeft = (p) => {return {x: p.y, y: GRADIENT_STEP_COUNT - p.x}};
    let pixelsLeft = pixelsTop.map((pt) => {return{
        coords: rotateToLeft(pt.coords),
        colorCoords: pt.colorCoords
    }} );

    createTriangleImageData(image, pixelsTop, NEGATIVE_HIGH, POSITIVE_HIGH);
    createTriangleImageData(image, pixelsRight, POSITIVE_HIGH, POSITIVE_LOW);
    createTriangleImageData(image, pixelsBottom, POSITIVE_LOW, NEGATIVE_LOW);
    createTriangleImageData(image, pixelsLeft, NEGATIVE_LOW, NEGATIVE_HIGH);

    context.putImageData(image, 0, 0);
};

export const makeGradientPolar = function(placeForCanvas){
    if (typeof placeForCanvas === 'string')
        placeForCanvas = d3.select(placeForCanvas);

    placeForCanvas.classed('gradient-container', true);

    let canvas = placeForCanvas.append('canvas')
        .attr('width', GRADIENT_STEP_COUNT)
        .attr('height', GRADIENT_STEP_COUNT)
        .style('image-rendering', 'pixelated')
        .classed('gradient-canvas', 'true')
        .node();

    let context = canvas.getContext('2d');

    let image = context.createImageData(GRADIENT_STEP_COUNT, GRADIENT_STEP_COUNT);

    let pointScale = d3.scaleLinear().domain([0, GRADIENT_STEP_COUNT]).range([1, -1]);

    let colorAngleScale = d3.scaleLinear()
        .domain([0, 0.5 * PI, PI, 1.5*PI, 2*PI])
        .range([POSITIVE_HIGH, NEGATIVE_HIGH, NEGATIVE_LOW, POSITIVE_LOW, POSITIVE_HIGH])
        .interpolate(d3.interpolateLab);

    let colorDistance = (point) => Math.sqrt(point.x*point.x + point.y*point.y);
    let colorAngle = (point) =>
        ( colorDistance(point) === 0 ?
            0 : ( Math.acos(point.x/colorDistance(point)) * (point.y > 0? 1 : -1) + 1.75 * PI ) % (2 * PI));
    let pointColorScale = (point) => {
        let scale = d3.scaleLinear()
            .domain([0, s2])
            .range(['#ffffff', colorAngleScale(colorAngle(point))])
            .interpolate(d3.interpolateLab);
         return scale(colorDistance(point));
    };

    let pixels = Array.from(Array(GRADIENT_STEP_COUNT),
        (o, x) => Array.from(Array(GRADIENT_STEP_COUNT),
            (oo, y) => {
            let p = {x: -pointScale(x), y: pointScale(y)};
            let color = d3.rgb(pointColorScale(p));
                return color;
            } ));

    let testPoints = [
        {x: 0, y: 0},
        {x: 50, y:50},
        {x: 75, y:25},
        {x: 20, y:60},
        {x: 50 ,y:99},
        {x: 50 ,y: -60},
        {x: 20, y: -30},
        {x: -50 ,y: -10},
        {x: -80 ,y: -99},
        {x: -40 ,y: 70},
        {x: -90 ,y: 30}];

    testPoints.forEach( (p) =>
    {
        let cp = {x: -pointScale(p.x), y: pointScale(p.y)};
        console.log('-------------- Point : ' + p.x + ', ' + p.y + ' ---- color Point: ' + cp.x + ', ' + cp.y);
        console.log('distance: '+ colorDistance(cp));
        let testColorAngle = colorAngle(cp);
        console.log('angle: ' + testColorAngle + 'rad, ' + (180 * testColorAngle/PI) + 'deg');
        console.log('color for scale: '+ colorAngleScale(colorAngle(cp)));
        console.log('color: '+ pointColorScale(cp));
    });

    for (let x = 0; x < GRADIENT_STEP_COUNT; x++)
        for (let y = 0; y < GRADIENT_STEP_COUNT; y++) {
            let pixelIndex = 4*(y*GRADIENT_STEP_COUNT + x);
            let color = pixels[x][y];
            image.data[pixelIndex]     = color.r;
            image.data[pixelIndex + 1] = color.g;
            image.data[pixelIndex + 2] = color.b;
            image.data[pixelIndex + 3] = 255;
        }

    context.putImageData(image, 0, 0);
};

export const makeGradientCss = (placeForCanvas) => {
    if (typeof placeForCanvas === 'string')
        placeForCanvas = d3.select(placeForCanvas);

    placeForCanvas.classed('gradient-div', true);

    /*let orangeDiv = placeForCanvas.append('div');
    let redDiv = placeForCanvas.append('div');
    let blueDiv = placeForCanvas.append('div');
    let greenDiv = placeForCanvas.append('div');

    orangeDiv.attr('style', 'width: 400px; height:400px; background-image: linear-gradient(45deg '+ POSITIVE_HIGH +' white 50%)');
    redDiv.attr('style', 'width: 400px; height:400px; background-image: linear-gradient(45deg '+ NEGATIVE_HIGH +' white 50%)');
    blueDiv.attr('style', 'width: 400px; height:400px; background-image: linear-gradient(45deg '+ NEGATIVE_LOW +' white 50%)');
    greenDiv.attr('style', 'width: 400px; height:400px; background-image: linear-gradient(45deg '+ POSITIVE_LOW +' white 50%)'); */
};

const makeGradientChartBackground = (svg, chartSize, fontOffset) => {

    // canvas in svg http://bl.ocks.org/boeric/aa80b0048b7e39dd71c8fbe958d1b1d4
    let placeForCanvas = svg.append('foreignObject')
        .attr('width', chartSize + fontOffset + 'px')
        .attr('height', chartSize + fontOffset + 'px')
        .append('xhtml:body')
        .style('padding', 0)
        .style('padding-left', fontOffset + 'px')
        .style('padding-top', fontOffset + 'px');

    makeGradient(placeForCanvas);
};

export default makeGradientChartBackground;