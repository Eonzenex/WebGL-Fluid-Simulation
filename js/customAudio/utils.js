

const D2R = (d = 0) => {
  // Degrees to Radians
  return d * (Math.PI / 180);
}


const toNewRange = (oldMin = 0, oldMax = 1, newMin = 5, newMax = 10, value = 0.5) => {
  const oldRange = oldMax - oldMin;
  const newRange = newMax - newMin;
  return (((value - oldMin) * newRange) / oldRange) + newMin;
};


const calcLayerPos = (basePosition = 0, rotation = 0, index = 0) => {
  return basePosition - (rotation / 3.14) * (0.15 * (index + 1));
};


const initDelta = () => { return {last: 0, delta: 0}; };
