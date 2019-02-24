export const POSITIVE_HIGH = '#FFCD93'; //hsl(32.2, 100%, 78.8%) hue, saturation, lightness
export const POSITIVE_LOW = '#BEE986'; //hsl(86.1, 69.2%, 72%)
export const NEGATIVE_HIGH = '#DA7DA4'; //hsl(199.4, 25.9%, 50.8%)
export const NEGATIVE_LOW = '#618DA2'; //hsl(334.8, 55.7%, 67.3%)

export const HSL_POSITIVE_HIGH = 'hsl(32.2, 100%, 78.8%)';
export const HSL_POSITIVE_LOW = 'hsl(86.1, 69.2%, 72%)';
export const HSL_NEGATIVE_HIGH = 'hsl(199.4, 25.9%, 50.8%)';
export const HSL_NEGATIVE_LOW = 'hsl(334.8, 55.7%, 67.3%)';

// TODO Code doubling optimieren
// TODO check scope für alles

let sqrt2 = Math.sqrt(2);
let yColorScale = d3.scaleLinear().domain([-sqrt2, 0, sqrt2]).range(['#BEE986', '#FFFFFF', '#DA7DA4']);
let xColorScale = d3.scaleLinear().domain([-sqrt2, 0, sqrt2]).range(['#618DA2', '#FFFFFF', '#FFCD93']);

export default function distinctColorForEmotion(valence, arousal) {
    if (valence >= 0 && arousal >= 0)
        return POSITIVE_HIGH;
    else if (valence >= 0 && arousal < 0)
        return POSITIVE_LOW;
    else if (valence < 0 && arousal >= 0)
        return NEGATIVE_HIGH;
    else if (valence < 0 && arousal < 0)
        return NEGATIVE_LOW;
}

export function continuousColorForEmotion(v, a) {

    let distanceTo0 = Math.sqrt(v * v + a * a);

// Color interpolation : http://bl.ocks.org/syntagmatic/5bbf30e8a658bcd5152b

    let alpha = Math.acos(v/distanceTo0) * (a>0? 1 : -1);
    let beta = alpha - (Math.PI/4);
    beta = (beta < -Math.PI ? beta + 2*Math.PI : beta);
    let xColor = Math.cos(beta)*distanceTo0;
    let yColor = Math.sin(beta)*distanceTo0;

    let xOnXColorScale = xColorScale(xColor);
    let yOnYColorScale = yColorScale(yColor);

    //console.log(v + ', ' + a + ' => ' + xColor + ', ' + yColor + ' alpha: '+ alpha + ' beta: '+ beta +
    //' Punktfarbskala: ' + d3.rgb(xOnXColorScale).toString() + ', ' + d3.rgb(yOnYColorScale).toString());

    let color = d3.scaleLinear()
        .domain([-sqrt2, sqrt2])
        .range([xOnXColorScale, yOnYColorScale])
        .interpolate(d3.interpolateRgb);

    let strength = Math.abs(yColor)-Math.abs(xColor);

    return color(strength);
}

