/**
 * Color manipulation functions below are adapted from
 * https://github.com/d3/d3-color.
 */
const Xn = 0.95047;
const Yn = 1;
const Zn = 1.08883;
const t0 = 4 / 29;
const t1 = 6 / 29;
const t2 = 3 * t1 * t1;
const t3 = t1 * t1 * t1;
const twoPi = 2 * Math.PI;

export function rgb2xyz(x: number): number {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

export function xyz2rgb(x: number): number {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

export function xyz2lab(t: number): number {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

export function lab2xyz(t: number): number {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

/**
 * Convert an RGB pixel into an HCL pixel.
 * @param {Array<number>} pixel A pixel in RGB space.
 * @return {Array<number>} A pixel in HCL space.
 */
export function rgb2hcl(rgb: [number, number, number]): [number, number, number] {
  const red = rgb2xyz(rgb[0]);
  const green = rgb2xyz(rgb[1]);
  const blue = rgb2xyz(rgb[2]);

  const x = xyz2lab((0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / Xn);
  const y = xyz2lab((0.2126729 * red + 0.7151522 * green + 0.072175 * blue) / Yn);
  const z = xyz2lab((0.0193339 * red + 0.119192 * green + 0.9503041 * blue) / Zn);

  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a);

  if (h < 0) {
    h += twoPi;
  }

  return [h, c, l];
}

/**
 * Convert an HCL pixel into an RGB pixel.
 * @param {Array<number>} pixel A pixel in HCL space.
 * @return {Array<number>} A pixel in RGB space.
 */
export function hcl2rgb(hcl: [number, number, number]): [number, number, number] {
  const [h, c, l] = hcl;
  const a = Math.cos(h) * c;
  const b = Math.sin(h) * c;

  let y = (l + 16) / 116;
  let x = isNaN(a) ? y : y + a / 500;
  let z = isNaN(b) ? y : y - b / 200;

  y = Yn * lab2xyz(y);
  x = Xn * lab2xyz(x);
  z = Zn * lab2xyz(z);

  return [
    xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z),
    xyz2rgb(-0.969266 * x + 1.8760108 * y + 0.041556 * z),
    xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
  ];
}

export interface ColorManipulationOptions {
  hue?: number,
  chroma?: number,
  lightness?: number
}

export function colorManipulation(color: [number, number, number], options: ColorManipulationOptions = {}): [number, number, number] {
  const defaultOptions: ColorManipulationOptions = {
    hue: 0,
    chroma: 100,
    lightness: 100
  };
  const { hue, chroma, lightness } = Object.assign(defaultOptions, options);

  const hcl = rgb2hcl(color);

  let h = hcl[0] + (Math.PI * hue!) / 180;
  if (h < 0) {
    h += twoPi;
  } else if (h > twoPi) {
    h -= twoPi;
  }
  hcl[0] = h;

  hcl[1] *= chroma! / 100;
  hcl[2] *= lightness! / 100;

  return hcl2rgb(hcl);
}

export function greyscale(color: [number, number, number], chroma: number = 0): [number, number, number] {
  return colorManipulation(color, { chroma });
}
