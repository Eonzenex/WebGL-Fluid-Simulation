

const splatBand = (array = [], volume = 0.5) => {
  if (array.length === 0) return;

  const safeVolume = ((1 + volume) * 100) * 4;

  array.forEach(val => {
    const location = val.location.getNew();
    const colour = val.colour.getNewRgb();
    const velocity = val.velocity.getNew() * safeVolume;
    const rotation = val.rotation.getNew();

    const xRotation = Math.cos(D2R(rotation));
    const yRotation = Math.sin(D2R(rotation));

    splat(location[0], location[1], xRotation * velocity, yRotation * velocity, colour);

    // Splat each layer
    if (val.layers.length !== 0) {
      val.layers.forEach((layer, i) => {
        const layerColour = layer.colour.getNewRgb();
        const layerVelocity = layer.velocity.getNew() * safeVolume;

        const layerX = calcLayerPos(location[0], xRotation, i);
        const layerY = calcLayerPos(location[1], yRotation, i);

        splat(layerX, layerY, xRotation * layerVelocity, yRotation * layerVelocity, layerColour);
      });
    }
  });
};

const bandVolume = (audio = [0]) => {
  const sum = audio.reduce((a, b) => (a + b));
  const average = sum / audio.length;
  const max = Math.max.apply(false, audio);

  return (average + max) / 2;
};



const calcTickAudio = (array = [], volume = 0, lastTick = initLastTick(), threshold = 0.05, minVolumeChange = 0.03) => {
  if (array.length !== 0 && volume !== 0) {

    if (volume - lastTick.lastVolume > minVolumeChange) {
      splatBand(array, volume);
    }

    return {lastVolume: volume};
  }

  return initLastTick();
};

const limitMaxToOne = (audio = [0]) => {
  const maxValue = Math.max.apply(false, audio);

  if (maxValue > 1) {
    const multiplier = 1 / maxValue;
    return audio.map(x => x * multiplier);
  }

  return audio;
};

const minFromPercent = (length = 1, percent = 0.03) => {
  return Math.max(Math.floor(length * percent), 1);
};

const tickSimpleAudio = (audio = [0]) => {
  /* Bass = 0% - 20% (20%)
   * Mid = 20% - 55% (35%)
   * Highs = 55% - 100% (45%) */

  const bassCutOff = Math.floor(audio.length * 0.2);
  const midCutOff = bassCutOff + Math.floor(audio.length * 0.35);

  // Get audio frequencies
  const overlap = Math.floor(audio.length * 0.05);
  let bassAudio = audio.slice(0, bassCutOff + overlap);
  let midAudio = audio.slice(bassCutOff - overlap, midCutOff + overlap);
  let highAudio = audio.slice(midCutOff - overlap, audio.length);

  // Limit max to 1
  bassAudio = limitMaxToOne(bassAudio);
  midAudio = limitMaxToOne(midAudio);
  highAudio = limitMaxToOne(highAudio);

  // Calculate band volume
  const bassVolume = bandVolume(bassAudio);
  const midRangeVolume = bandVolume(midAudio);
  const highVolume = bandVolume(highAudio);

  // Min volume change
  const bassMinVolumeChange = 7.5 / 1000;
  const midMinVolumeChange = 6.75 / 1000;
  const highMinVolumeChange = 5 / 1000;

  // Tick
  simpleDeltas.bass = calcTickAudio(simpleBands.bassSplats, bassVolume, simpleDeltas.bass, 0.1, bassMinVolumeChange);
  simpleDeltas.midRange = calcTickAudio(simpleBands.midRangeSplats, midRangeVolume, simpleDeltas.midRange, 0.075, midMinVolumeChange);
  simpleDeltas.high = calcTickAudio(simpleBands.highSplats, highVolume, simpleDeltas.high, 0.05, highMinVolumeChange);
};

const tickFullAudio = (audio = [0]) => {
  /* Sub-Bass = 0% - 3% (3%)
   * Bass = 3% - 11% (8%)
   * LowMid = 11% - 23% (12%)
   * Mid = 23% - 39% (16%)
   * UpperMid = 39% - 58% (19%)
   * Presence = 58% - 82% (24%)
   * Brilliance = 82% - 100% (18%)
   */

  const subBassCutOff = minFromPercent(audio.length, 0.03);
  const bassCutOff = subBassCutOff + minFromPercent(audio.length, 0.08);
  const lowMidCutOff = bassCutOff + minFromPercent(audio.length, 0.12);
  const midCutOff = lowMidCutOff + minFromPercent(audio.length, 0.16);
  const upperMidCutOff = midCutOff + minFromPercent(audio.length, 0.19);
  const presenceMidCutOff = upperMidCutOff + minFromPercent(audio.length, 0.24);
  const brillianceMidCutOff = presenceMidCutOff + minFromPercent(audio.length, 0.18);

  // Get audio frequencies
  const overlap = minFromPercent(audio.length, 0.03);
  let subBassAudio = audio.slice(0, subBassCutOff + overlap);
  let bassAudio = audio.slice(bassCutOff - overlap, lowMidCutOff + overlap);
  let lowMidAudio = audio.slice(lowMidCutOff - overlap, midCutOff + overlap);
  let midAudio = audio.slice(midCutOff - overlap, upperMidCutOff + overlap);
  let upperMidAudio = audio.slice(upperMidCutOff - overlap, presenceMidCutOff + overlap);
  let presenceAudio = audio.slice(presenceMidCutOff - overlap, brillianceMidCutOff + overlap);
  let brillianceAudio = audio.slice(brillianceMidCutOff - overlap, audio.length);

  // Limit max to 1
  subBassAudio = limitMaxToOne(subBassAudio);
  bassAudio = limitMaxToOne(bassAudio);
  lowMidAudio = limitMaxToOne(lowMidAudio);
  midAudio = limitMaxToOne(midAudio);
  upperMidAudio = limitMaxToOne(upperMidAudio);
  presenceAudio = limitMaxToOne(presenceAudio);
  brillianceAudio = limitMaxToOne(brillianceAudio);

  // Calculate band volume
  const subBassVolume = bandVolume(subBassAudio);
  const bassVolume = bandVolume(bassAudio);
  const lowMidVolume = bandVolume(lowMidAudio);
  const midVolume = bandVolume(midAudio);
  const upperMidVolume = bandVolume(upperMidAudio);
  const presenceVolume = bandVolume(presenceAudio);
  const brillianceVolume = bandVolume(brillianceAudio);

  // Min volume change
  const bassMinVolumeChange = 7.5 / 1000;
  const midMinVolumeChange = 6.75 / 1000;
  const highMinVolumeChange = 5 / 1000;

  // Tick
  fullDeltas.subBass = calcTickAudio(fullBands.subSplats, subBassVolume, fullDeltas.subBass, 0.1, bassMinVolumeChange);
  fullDeltas.bass = calcTickAudio(fullBands.bassSplats, bassVolume, fullDeltas.bass, 0.1, bassMinVolumeChange);
  fullDeltas.lowMidRange = calcTickAudio(fullBands.lowMidRangeSplats, lowMidVolume, fullDeltas.lowMidRange, 0.075, midMinVolumeChange);
  fullDeltas.midRange = calcTickAudio(fullBands.midRangeSplats, midVolume, fullDeltas.midRange, 0.075, midMinVolumeChange);
  fullDeltas.upperMidRange = calcTickAudio(fullBands.upperMidRangeSplats, upperMidVolume, fullDeltas.upperMidRange, 0.075, midMinVolumeChange);
  fullDeltas.presence = calcTickAudio(fullBands.presenceSplats, presenceVolume, fullDeltas.presence, 0.05, highMinVolumeChange);
  fullDeltas.brilliance = calcTickAudio(fullBands.brillianceSplats, brillianceVolume, fullDeltas.brilliance, 0.05, highMinVolumeChange);
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