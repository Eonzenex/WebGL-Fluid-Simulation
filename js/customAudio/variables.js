
let _audioSplatType = 0;
let _simpleBands = false;
let _volumeExceedThreshold = 0.8;
let _volumeAmbientThreshold = 0.1;
let _ambientSplatInterval = 3000;

let volumeAmbientThresholdTimeout = 0;
let isTickingAmbientVolume = false;


// Cyberpunk haze
// let simpleBands = {
//   bassSplats: [
//     new Band(ColourRangeFactory(0.75, 0.7, 0.75), VelocityScaleFactory(0.85), LocationRangeFactory(0.4, 0.5), RotationRangeFactory(180)),
//     new Band(ColourRangeFactory(0.75, 0.7, 0.75), VelocityScaleFactory(0.85), LocationRangeFactory(0.6, 0.5), RotationRangeFactory(0))
//   ],
//   midRangeSplats: [
//     new Band(ColourRangeFactory(0.55, 0.82, 0.88), VelocityScaleFactory(0.5), LocationRangeFactory(0.5, 0.4), RotationRangeFactory(-90)),
//     new Band(ColourRangeFactory(0.55, 0.82, 0.88), VelocityScaleFactory(0.5), LocationRangeFactory(0.5, 0.6), RotationRangeFactory(90)),
//   ],
//   highSplats: [
//     new Band(ColourRangeFactory(0.6, 0.57, 0.63), VelocityScaleFactory(0.25), LocationRangeFactory(0.1, 0.1, 0.1, 0.4, 0.1, 0.4), RotationRangeFactory(0, 0, 360)),
//     new Band(ColourRangeFactory(0.6, 0.57, 0.63), VelocityScaleFactory(0.25), LocationRangeFactory(0.1, 0.1, 0.1, 0.4, 0.6, 0.9), RotationRangeFactory(0, 0, 360)),
//     new Band(ColourRangeFactory(0.6, 0.57, 0.63), VelocityScaleFactory(0.25), LocationRangeFactory(0.1, 0.1, 0.6, 0.9, 0.1, 0.4), RotationRangeFactory(0, 0, 360)),
//     new Band(ColourRangeFactory(0.6, 0.57, 0.63), VelocityScaleFactory(0.25), LocationRangeFactory(0.1, 0.1, 0.6, 0.9, 0.6, 0.9), RotationRangeFactory(0, 0, 360)),
//   ],
// };

// Berserker rage
let simpleBands = {
  bassSplats: [
    new Band(
      ColourRangeFactory(0.0, 0.0, 0.05),
      VelocityScaleFactory(0.85),
      LocationRangeFactory(0.4, 0.5),
      RotationRangeFactory(180),
      [
        new SimpleBand(ColourRangeFactory(0, 0, 0, 0.35), VelocityScaleFactory(0.85))
      ]
    ),
    new Band(
      ColourRangeFactory(0.0, 0.0, 0.05),
      VelocityScaleFactory(0.85),
      LocationRangeFactory(0.6, 0.5),
      RotationRangeFactory(0),
      [
        new SimpleBand(ColourRangeFactory(0, 0, 0, 0.35), VelocityScaleFactory(0.85))
      ]
    )
  ],
  midRangeSplats: [
    new Band(ColourRangeFactory(0.0, 0.0, 0.05, 1, 1), VelocityScaleFactory(0.5), LocationRangeFactory(0.5, 0.35), RotationRangeFactory(-90)),
    new Band(ColourRangeFactory(0.0, 0.0, 0.05, 1, 1), VelocityScaleFactory(0.5), LocationRangeFactory(0.5, 0.65), RotationRangeFactory(90)),
  ],
  highSplats: [
    new Band(ColourRangeFactory(0.0, 0.0, 0.05, 1, 0.75, 0, 0, 0.7, 0.8), VelocityScaleFactory(0.25), LocationRangeFactory(0.1, 0.1, 0.1, 0.4, 0.1, 0.4), RotationRangeFactory(0, 0, 360)),
    new Band(ColourRangeFactory(0.0, 0.0, 0.05, 1, 0.75, 0, 0, 0.7, 0.8), VelocityScaleFactory(0.25), LocationRangeFactory(0.1, 0.1, 0.1, 0.4, 0.6, 0.9), RotationRangeFactory(0, 0, 360)),
    new Band(ColourRangeFactory(0.0, 0.0, 0.05, 1, 0.75, 0, 0, 0.7, 0.8), VelocityScaleFactory(0.25), LocationRangeFactory(0.1, 0.1, 0.6, 0.9, 0.1, 0.4), RotationRangeFactory(0, 0, 360)),
    new Band(ColourRangeFactory(0.0, 0.0, 0.05, 1, 0.75, 0, 0, 0.7, 0.8), VelocityScaleFactory(0.25), LocationRangeFactory(0.1, 0.1, 0.6, 0.9, 0.6, 0.9), RotationRangeFactory(0, 0, 360))
  ],
};

let fullBands = {
  subSplats: [
    new Band(ColourRangeFactory(0.0, 0.0, 0.05), VelocityScaleFactory(0.66), LocationRangeFactory(0.1, 0.1), RotationRangeFactory(0)),
    new Band(ColourRangeFactory(0.0, 0.0, 0.05), VelocityScaleFactory(0.66), LocationRangeFactory(0.9, 0.1), RotationRangeFactory(180))
  ],
  bassSplats: [
    new Band(ColourRangeFactory(0.1, 0.1, 0.2), VelocityScaleFactory(0.4), LocationRangeFactory(0, 0.15), RotationRangeFactory(90)),
    new Band(ColourRangeFactory(0.1, 0.1, 0.2), VelocityScaleFactory(0.4), LocationRangeFactory(1, 0.15), RotationRangeFactory(90))
  ],
  lowMidRangeSplats: [
    new Band(ColourRangeFactory(0.65, 0.6, 0.7), VelocityScaleFactory(0.5), LocationRangeFactory(0.5, 0.45), RotationRangeFactory(-90))
  ],
  midRangeSplats: [
    new Band(ColourRangeFactory(0.55, 0.5, 0.6), VelocityScaleFactory(0.5), LocationRangeFactory(0.5, 0.55), RotationRangeFactory(90))
  ],
  upperMidRangeSplats: [
    new Band(ColourRangeFactory(0.6, 0.6, 0.7), VelocityScaleFactory(0.66), LocationRangeFactory(0.1, 0.9), RotationRangeFactory(0)),
    new Band(ColourRangeFactory(0.6, 0.6, 0.7), VelocityScaleFactory(0.66), LocationRangeFactory(0.9, 0.9), RotationRangeFactory(180)),
  ],
  presenceSplats: [
    new Band(ColourRangeFactory(0.7, 0.7, 0.8), VelocityScaleFactory(0.4), LocationRangeFactory(0, 0.85), RotationRangeFactory(-90)),
    new Band(ColourRangeFactory(0.7, 0.7, 0.8), VelocityScaleFactory(0.4), LocationRangeFactory(1, 0.85), RotationRangeFactory(-90))
  ],
  brillianceSplats: [
    new Band(ColourRangeFactory(0.8, 0.7, 0.9), VelocityScaleFactory(1), LocationRangeFactory(0, 0, 0.3, 0.7, 0, 1), RotationRangeFactory(0, 0, 360)),
    new Band(ColourRangeFactory(0.8, 0.7, 0.9), VelocityScaleFactory(1), LocationRangeFactory(0, 0, 0.3, 0.7, 0, 1), RotationRangeFactory(0, 0, 360))
  ],
};

// // Debug
// let simpleBands = {
//   bassSplats: [
//     new Band(
//       ColourRangeFactory(0.0),
//       VelocityScaleFactory(5.0),
//       LocationRangeFactory(0.25, 0.0),
//       RotationRangeFactory(90)
//     )
//   ],
//   midRangeSplats: [
//     new Band(
//         ColourRangeFactory(0.33),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.5, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
//   highSplats: [
//     new Band(
//         ColourRangeFactory(0.66),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.75, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
// };
//
// // Debug
// let fullBands = {
//   subSplats: [
//     new Band(
//         ColourRangeFactory(0.000),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.125, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
//   bassSplats: [
//     new Band(
//         ColourRangeFactory(0.125),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.250, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
//   lowMidRangeSplats: [
//     new Band(
//         ColourRangeFactory(0.250),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.375, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
//   midRangeSplats: [
//     new Band(
//         ColourRangeFactory(0.375),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.500, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
//   upperMidRangeSplats: [
//     new Band(
//         ColourRangeFactory(0.500),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.625, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
//   presenceSplats: [
//     new Band(
//         ColourRangeFactory(0.625),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.750, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
//   brillianceSplats: [
//     new Band(
//         ColourRangeFactory(0.750),
//         VelocityScaleFactory(5.0),
//         LocationRangeFactory(0.875, 0.0),
//         RotationRangeFactory(90)
//     )
//   ],
// };

let volumeBands = {
  exceed: [],
  ambient: [
    new Band(
      ColourRangeFactory(0, 0, 1), VelocityScaleFactory(0.33),
      LocationRangeFactory(0.1, 0.1, 0.1, 0.9, 0.1, 0.9),
      RotationRangeFactory(0, 0, 360),
      [
        new SimpleBand(ColourRangeFactory(0, 0, 1), VelocityScaleFactory(0.33)),
        new SimpleBand(ColourRangeFactory(0, 0, 1), VelocityScaleFactory(0.33))
      ]
    ),
    new Band(
      ColourRangeFactory(0, 0, 1), VelocityScaleFactory(0.33),
      LocationRangeFactory(0.1, 0.1, 0.1, 0.9, 0.1, 0.9),
      RotationRangeFactory(0, 0, 360),
      [
        new SimpleBand(ColourRangeFactory(0, 0, 1), VelocityScaleFactory(0.33)),
        new SimpleBand(ColourRangeFactory(0, 0, 1), VelocityScaleFactory(0.33))
      ]
    )
  ]
};


const initLastTick = () => { return {lastVolume: 0}; };

let simpleDeltas = {
  bass: initLastTick(),
  midRange: initLastTick(),
  high: initLastTick(),
};

let fullDeltas = {
  subBass: initLastTick(),
  bass: initLastTick(),
  lowMidRange: initLastTick(),
  midRange: initLastTick(),
  upperMidRange: initLastTick(),
  presence: initLastTick(),
  brilliance: initLastTick(),
};
