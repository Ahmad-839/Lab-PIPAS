import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDerivedQuantity,
  computeMicrometerReading,
  computeRulerReading,
  computeVernierReading,
  convertUnit,
  isNumericAnswerCorrect,
  parseLocaleNumber,
} from './physicsMath';

test('parseLocaleNumber handles both dot and comma decimal inputs', () => {
  assert.equal(parseLocaleNumber('12,45'), 12.45);
  assert.equal(parseLocaleNumber('12.45'), 12.45);
  assert.equal(parseLocaleNumber('  0,08 '), 0.08);
  assert.equal(parseLocaleNumber('abc'), null);
  assert.equal(parseLocaleNumber(''), null);
});

test('computeVernierReading produces exact 0.1 mm / 0.01 cm readings without drift', () => {
  const r1 = computeVernierReading(24.7);
  assert.equal(r1.mainScaleMm, 24);
  assert.equal(r1.vernierTick, 7);
  assert.equal(r1.totalMm, 24.7);
  assert.equal(r1.totalCm, 2.47);
  assert.equal(r1.formattedCm, '2,47');

  const r2 = computeVernierReading(0);
  assert.equal(r2.totalCm, 0);
  assert.equal(r2.vernierTick, 0);
});

test('computeMicrometerReading produces exact 0.01 mm readings', () => {
  const m1 = computeMicrometerReading(5.78);
  assert.equal(m1.mainScaleMm, 5.5);
  assert.equal(m1.thimbleTick, 28);
  assert.equal(m1.totalMm, 5.78);
  assert.equal(m1.formattedMm, '5,78');

  const m2 = computeMicrometerReading(3.25);
  assert.equal(m2.mainScaleMm, 3.0);
  assert.equal(m2.thimbleTick, 25);
});

test('computeRulerReading computes difference between start and end cm', () => {
  const r = computeRulerReading(2.3, 8.7);
  assert.equal(r.lengthCm, 6.4);
  assert.equal(r.lengthMm, 64);
});

test('isNumericAnswerCorrect checks tolerance with comma decimals', () => {
  assert.equal(isNumericAnswerCorrect('2,47', 2.47), true);
  assert.equal(isNumericAnswerCorrect('2.48', 2.47, 0.015), true);
  assert.equal(isNumericAnswerCorrect('2.60', 2.47, 0.015), false);
});

test('convertUnit accurately converts panjang, massa, waktu, volume, and suhu', () => {
  const len = convertUnit(2.5, 'panjang', 'km', 'm');
  assert.equal(len.valid, true);
  assert.equal(len.result, 2500);

  const mass = convertUnit(750, 'massa', 'g', 'kg');
  assert.equal(mass.result, 0.75);

  const time = convertUnit(2, 'waktu', 'jam', 'sekon');
  assert.equal(time.result, 7200);

  const vol = convertUnit(1.5, 'volume', 'm³', 'liter');
  assert.equal(vol.result, 1500);

  const tempK = convertUnit(27, 'suhu', '°C', 'K');
  assert.equal(tempK.result, 300.15);

  const tempF = convertUnit(100, 'suhu', '°C', '°F');
  assert.equal(tempF.result, 212);
});

test('calculateDerivedQuantity computes all 7 derived formulas and guards division by zero', () => {
  assert.equal(calculateDerivedQuantity('luas', { a: 5, b: 3 }).value, 15);
  assert.equal(calculateDerivedQuantity('volume', { a: 2, b: 3, c: 4 }).value, 24);
  assert.equal(calculateDerivedQuantity('kecepatan', { a: 120, b: 10 }).value, 12);
  assert.equal(calculateDerivedQuantity('percepatan', { a: 20, b: 4 }).value, 5);
  assert.equal(calculateDerivedQuantity('gaya', { a: 10, b: 2.5 }).value, 25);
  assert.equal(calculateDerivedQuantity('massa_jenis', { a: 800, b: 0.4 }).value, 2000);
  assert.equal(calculateDerivedQuantity('tekanan', { a: 500, b: 2 }).value, 250);

  const zeroTime = calculateDerivedQuantity('kecepatan', { a: 50, b: 0 });
  assert.equal(zeroTime.valid, false);
});
