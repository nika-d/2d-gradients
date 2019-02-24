import {makeGradient} from "./gradient2D.js";
import {makeGradientPolar, makeGradientCss} from "./gradient2D.js";

// TODO Code doubling optimieren
// TODO check scope für alles
// TODO Test-Daten optimieren, bzw. Code dafür wiederbenutzen
// TODO API-Beschreibung
// TODO alle vars und lets rpüfen, bzw. zu let machen
// TODO alle " zu ' machen
// TODO prettier anwenden

// DataTypes: distinct, continuous
// Graphs:
// Pie
// proportional Bar - distinct/continuous
// Time-Bar - distinct/continuous
// Bar-Chart (with proportional/horizontal bars for distinct/continuous moods)
// Scatter-Graph

// fake 5 minutes


makeGradient('#chart1aa');
makeGradientPolar('#chart1a');
makeGradientCss('#chart1b');
