

const splatBand = (array = [], volume = 0.5) => {
  if (array.length === 0) return;

  const safeVolume = Math.max(Math.min(volume, 3), 10);

  array.forEach(val => {
    const location = val.location.getNew();
    const colour = val.colour.getNewRgb();
    const velocity = val.velocity.getNew() * safeVolume * 40;
    const rotation = val.rotation.getNew();

    const xRotation = Math.cos(D2R(rotation));
    const yRotation = Math.sin(D2R(rotation));

    splat(location[0], location[1], xRotation * velocity, yRotation * velocity, colour);

    // Splat each layer
    if (val.layers.length !== 0) {
      val.layers.forEach((layer, i) => {
        const layerColour = layer.colour.getNewRgb();
        const layerVelocity = layer.velocity.getNew() * safeVolume * 40;

        const layerX = calcLayerPos(location[0], xRotation, i);
        const layerY = calcLayerPos(location[1], yRotation, i);

        splat(layerX, layerY, xRotation * layerVelocity, yRotation * layerVelocity, layerColour);
      });
    }
  });
};

const bandVolume = (array = [0]) => {
  let sum = 0;
  array.forEach(val => sum += Math.min(val, 1));

  let max = 0;
  array.forEach(val => max = Math.max(val, max));

  const average = sum / array.length;
  return (max + average) / 2;
};



const calcTickAudio = (array = [], volume = 0, band = initDelta(), threshold = 0.33) => {
  if (array.length !== 0 && volume !== 0) {
    if (!band.last) return {last: volume, delta: volume};

    const newDelta = volume - band.last;
    const deltaDelta = newDelta - band.delta;

    if (deltaDelta > threshold) splatBand(array, volume);

    return {last: volume, delta: newDelta};
  }

  return 0;
};


const tickSimpleAudio = (audio = [0]) => {
  const bassVolume = bandVolume(audio.slice(0, 33));
  const midRangeVolume = bandVolume(audio.slice(33, 76));
  const highVolume = bandVolume(audio.slice(76, audio.length))

  simpleDeltas.bass = calcTickAudio(simpleBands.bassSplats, bassVolume, simpleDeltas.bass, 0.2);
  simpleDeltas.midRange = calcTickAudio(simpleBands.midRangeSplats, midRangeVolume, simpleDeltas.midRange, 0.15);
  simpleDeltas.high = calcTickAudio(simpleBands.highSplats, highVolume, simpleDeltas.high, 0.1);
};

const tickFullAudio = (audio = [0]) => {
  const subBassVolume = bandVolume(audio.slice(0, 5));
  const bassVolume = bandVolume(audio.slice(5, 15));
  const lowMidRangeVolume = bandVolume(audio.slice(15, 30));
  const midRangeVolume = bandVolume(audio.slice(30, 50));
  const upperMidRangeVolume = bandVolume(audio.slice(50, 75));
  const presenceVolume = bandVolume(audio.slice(75, 105));
  const brillianceVolume = bandVolume(audio.slice(105, audio.length));

  fullDeltas.subBass = calcTickAudio(fullBands.subSplats, subBassVolume, fullDeltas.subBass, 0.4);
  fullDeltas.bass = calcTickAudio(fullBands.bassSplats, bassVolume, fullDeltas.bass, 0.3);
  fullDeltas.lowMidRange = calcTickAudio(fullBands.lowMidRangeSplats, lowMidRangeVolume, fullDeltas.lowMidRange, 0.2);
  fullDeltas.midRange = calcTickAudio(fullBands.midRangeSplats, midRangeVolume, fullDeltas.midRange, 0.2);
  fullDeltas.upperMidRange = calcTickAudio(fullBands.upperMidRangeSplats, upperMidRangeVolume, fullDeltas.upperMidRange, 0.15);
  fullDeltas.presence = calcTickAudio(fullBands.presenceSplats, presenceVolume, fullDeltas.presence, 0.15);
  fullDeltas.brilliance = calcTickAudio(fullBands.brillianceSplats, brillianceVolume, fullDeltas.brilliance, 0.15);
};

const tickExceedingVolumeAudio = () => {
  splatBand(volumeBands.exceed, 5);
};



const tickAmbientVolumeAudio = () => {
  splatBand(volumeBands.ambient, 5);
};

const ambientAudioSplats = (newIsTickingAmbient = false) => {
  isTickingAmbientVolume = newIsTickingAmbient;

  if (!isTickingAmbientVolume) {
    clearTimeout(volumeAmbientThresholdTimeout);
    volumeAmbientThresholdTimeout = 0;
    return;
  }

  tickAmbientVolumeAudio();
  volumeAmbientThresholdTimeout = setTimeout(() => ambientAudioSplats(true), _ambientSplatInterval);
};



const tickAudio = (audio = [0]) => {
  if (_simpleBands) {
    tickSimpleAudio(audio);
  } else {
    tickFullAudio(audio);
  }
};