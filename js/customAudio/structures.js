
// Range class
class Range {
  constructor(value = 0.5, min = 0, max = 1) {
    this.value = value;
    this.min = min;
    this.max = max;

    this.noRange = max === 0 && min === 0;
  }

  get() { return this.value; }
  getMin() { return this.min; }
  getMax() { return this.max; }
  getNew() {
    if (this.noRange) return this.value;

    this.value = toNewRange(0, 1, this.min, this.max, Math.random());
    return this.value;
  }
}


// Location class
class LocationRange {
  constructor(x = new Range(), y = new Range()) {
    this.x = x;
    this.y = y;
  }

  get() { return [this.x.get(), this.y.get()]; }
  getNew() { return [this.x.getNew(), this.y.getNew()]; }
}

const LocationRangeFactory = (xValue = 0.5, yValue = 0.5, xMin = 0, xMax = 0, yMin = 0, yMax = 0) => {
  return new LocationRange(new Range(xValue, xMin, xMax), new Range(yValue, yMin, yMax));
};


// Colour class
class ColourRange {
  constructor(h = new Range(), s = new Range(), v = new Range()) {
    this.h = h;
    this.s = s;
    this.v = v;
  }

  get() { return [this.h.get(), this.s.get(), this.v.get()]; }
  getNew() { return [this.h.getNew(), this.s.getNew(), this.v.getNew()]; }

  getRgb() {
    const getValue = this.get();
    return HSVtoRGB(getValue[0], getValue[1], getValue[2]);
  }
  getNewRgb() {
    const getNewValue = this.getNew();
    return HSVtoRGB(getNewValue[0], getNewValue[1], getNewValue[2]);
  }
}

const ColourRangeFactory = (
  hValue = 0.5, hMin = 0, hMax = 0,
  sValue = 1, vValue = 1,
  sMin = 0, sMax = 0,
  vMin = 0, vMax = 0
) => {
  return new ColourRange(
    new Range(hValue, hMin, hMax),
    new Range(sValue, sMin, sMax),
    new Range(vValue, vMin, vMax),
  );
};


// Rotation class
class RotationRange {
  constructor(rotation = new Range(0, 0, 0)) {
    this.rotation = rotation;
  }

  get() { return this.rotation.get(); }
  getNew() { return this.rotation.getNew(); }
}

const RotationRangeFactory = (value = 90, min = 0, max = 0) => {
  return new RotationRange(new Range(value, min, max));
};


// Velocity scale class
class VelocityScaleRange {
  constructor(scale = new Range()) {
    this.scale = scale;
  }

  get() { return this.scale.get(); }
  getNew() { return this.scale.getNew(); }
}

const VelocityScaleFactory = (value = 1, min = 0, max = 0) => {
  return new VelocityScaleRange(new Range(value, min, max));
};


// Simple band
class SimpleBand {
  constructor(colour = new ColourRange(), velocity = new VelocityScaleRange()) {
    this.colour = colour;
    this.velocity = velocity;
  }
}


// Band class
class Band extends SimpleBand {
  constructor(
    colour = new ColourRange(), velocity = new VelocityScaleRange(),
    location = new LocationRange(), rotation = new RotationRange(),
    layers = []
  ) {
    super(colour, velocity);
    this.location = location;
    this.rotation = rotation;
    this.layers = layers;
  }
}

