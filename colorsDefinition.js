import {continuousColorForEmotion} from "./colors.js";

let redGreenScale = d3.scaleLinear().domain([-1, 0, 1]).range(['#BEE986', '#FFFFFF', '#DA7DA4']);
let orangeBlueScale = d3.scaleLinear().domain([-1, 0, 1]).range(['#618DA2', '#FFFFFF', '#FFCD93']);

let sqrt2= Math.sqrt(2);

function getAvailableSpace(parentNode)                           // TODO this is a helper function for all charts
{
    let space = 40; //px , default value

    let height = d3.style(parentNode, 'height');
    let width = d3.style(parentNode, 'width');
    let currentSpace = Math.max(
        parseFloat(height.substr(0, height.length-2)),
        parseFloat(width.substr(0, width.length-2)) );
    if (currentSpace > space )
        space = currentSpace;


    // div flex item
    // 1) malt die elemente -> default
    // 2) stretcht / flowt die elemente -> callback zum resize einfügen?
    // Beispiel: container soll 80% der breite haben, dann soll auch der plot auf 80% geresized werden.
    // Beispiel: container soll 80% der Breite haben und zwei plots enthalten, die dann beide gleich breit geflowt
    //           werden.

    return space;
}

const ColorsTest = {

    drawColorScales: function (CENTER, totalSpace) {

        let xScale = d3.scaleLinear().domain([-1, 1]).range([-totalSpace / 2, totalSpace / 2]);
        let yScale = d3.scaleLinear().domain([-1, 1]).range([totalSpace / 2, -totalSpace / 2]);
        let sizeScale = d3.scaleLinear().domain([0, 3]).range([0, 1.5 * totalSpace]);

        let spotSize = 0.05;
        let scaledSpotSize = sizeScale(spotSize);

        let colorScalesSteps = [];
        let limit = Math.round(1 / spotSize);

        for (let i = -limit; i <= limit; i++) {
            colorScalesSteps.push({x: 0, y: i * spotSize});
        }

        function axisColor(y, color) {
            let scale = d3.scaleLinear().domain([-1, 1]).range(['#FFFFFF', color]);
            return scale(Math.abs(y));
        };

        let redGreenAxis = colorScalesSteps.map((s) => {
            return {
                x: xScale(s.x),
                y: yScale(s.y),
                color: axisColor(s.y, redGreenScale(s.y))
            }
        });
        let orangeBlueAxis = colorScalesSteps.map((s) => {
            return {
                x: xScale(s.x),
                y: yScale(s.y),
                color: axisColor(s.y, orangeBlueScale(s.y))
            };
        });


        function drawColorAxis(axis, rotation) {
            CENTER.append('g')
                .attr('transform', 'scale(' + sqrt2 + ',' + sqrt2 + ') rotate(' + rotation + ')')
                .selectAll('rect')
                .data(axis)
                .enter()
                .append('rect')
                .attr('x', (s) => s.x - scaledSpotSize / 2)
                .attr('y', (s) => s.y - scaledSpotSize / 2)
                .attr('width', scaledSpotSize)
                .attr('height', scaledSpotSize)
                .attr('fill', (s) => s.color);
        }


        drawColorAxis(redGreenAxis, -45);
        drawColorAxis(orangeBlueAxis, 45);


        let spotCoords = [{x: 1, y: 1},
            {x: -1, y: 1},
            {x: -1, y: -1},
            {x: 1, y: -1}];


    },


    colorTest: function (CENTER, totalSpace) { // TODO color Test woanders hin extrahieren

        let xScale = d3.scaleLinear().domain([-1, 1]).range([-totalSpace / 2, totalSpace / 2]);
        let yScale = d3.scaleLinear().domain([-1, 1]).range([totalSpace / 2, -totalSpace / 2]);
        let sizeScale = d3.scaleLinear().domain([0, 3]).range([0, 1.5 * totalSpace]);

        CENTER.append('g').call(d3.axisBottom(xScale));
        CENTER.append('g').call(d3.axisLeft(yScale));

        this.drawColorScales(CENTER, totalSpace);

        let testCircleOrangeMedium = CENTER.append('circle')
            .attr('cx', xScale(0.5))
            .attr('cy', yScale(0.5))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(0.5, 0.5));

        let a = CENTER.append('circle')
            .attr('cx', xScale(0.75))
            .attr('cy', yScale(0.25))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(0.75, 0.25));

        let b = CENTER.append('circle')
            .attr('cx', xScale(0.2))
            .attr('cy', yScale(0.6))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(0.2, 0.6));

        let c = CENTER.append('circle')
            .attr('cx', xScale(0.5))
            .attr('cy', yScale(1.0))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(0.5, 1.0));

        let d = CENTER.append('circle')
            .attr('cx', xScale(0.5))
            .attr('cy', yScale(-0.6))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(0.5, -0.6));

        let e = CENTER.append('circle')
            .attr('cx', xScale(0.2))
            .attr('cy', yScale(-0.3))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(0.2, -0.3));

        let f = CENTER.append('circle')
            .attr('cx', xScale(-0.5))
            .attr('cy', yScale(-0.1))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(-0.5, -0.1));

        let g = CENTER.append('circle')
            .attr('cx', xScale(-0.8))
            .attr('cy', yScale(-1.0))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(-0.8, -1.0));

        let h = CENTER.append('circle')
            .attr('cx', xScale(-0.4))
            .attr('cy', yScale(0.7))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(-0.4, 0.7));

        let i = CENTER.append('circle')
            .attr('cx', xScale(-0.9))
            .attr('cy', yScale(0.3))
            .attr('r', 4)
            .attr('fill', continuousColorForEmotion(-0.9, 0.3));


    },

    plotColorsTestIntoG(gElement, size) {
        let totalSpace = size;
        let CENTER = gElement.append('g').attr('transform', 'translate(' + totalSpace / 2 + ',' + totalSpace / 2 + ')');

        this.colorTest(CENTER, totalSpace);
    },

    plotColorsTest: function (DOMelementId) {

        let container = d3.select(DOMelementId);
        let totalSpace = getAvailableSpace(container.node());

        let CENTER = container.append('svg')
            .attr('width', totalSpace)
            .attr('height', totalSpace)
            .append('g')
            .attr('transform', 'translate(' + totalSpace / 2 + ',' + totalSpace / 2 + ')');

        this.colorTest(CENTER, totalSpace);
    }
};

export default ColorsTest;