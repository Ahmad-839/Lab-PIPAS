import type { DerivedQuantityType, UnitCategory } from '../types';

export interface VernierReading {
  tenthsMm: number;
  mainScaleMm: number;
  mainScaleCm: number;
  vernierTick: number; // 0..9 (each = 0.1 mm = 0.01 cm)
  totalMm: number;
  totalCm: number;
  formattedMm: string;
  formattedCm: string;
}

export interface MicrometerReading {
  hundredthsMm: number;
  mainScaleMm: number; // multiples of 0.5 mm
  thimbleTick: number; // 0..49 (each = 0.01 mm)
  totalMm: number;
  formattedMm: string;
}

export interface RulerReading {
  startCm: number;
  endCm: number;
  lengthCm: number;
  lengthMm: number;
  formattedCm: string;
  formattedMm: string;
}

export interface ConversionOutput {
  valid: boolean;
  result: number;
  formattedResult: string;
  steps: string[];
  factorText: string;
  error?: string;
}

export interface DerivedCalcOutput {
  valid: boolean;
  value: number;
  formattedValue: string;
  unit: string;
  formulaText: string;
  steps: string[];
  baseDerivation: string;
  error?: string;
}

/**
 * Parse student numeric input that may use Indonesian comma ',' or dot '.'
 */
export function parseLocaleNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, '').replace(',', '.');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Format number cleanly in Indonesian-friendly decimal format without trailing noise
 */
export function formatCleanNumber(num: number, maxDecimals = 4): string {
  if (!Number.isFinite(num)) return '0';
  const rounded = Number(num.toFixed(maxDecimals));
  return rounded.toString().replace('.', ',');
}

/**
 * Vernier caliper (Jangka Sorong) with 0.1 mm (0.01 cm) precision
 */
export function computeVernierReading(mmInput: number): VernierReading {
  const clamped = Math.max(0, Math.min(120, mmInput));
  const tenthsMm = Math.round(clamped * 10);
  const mainScaleMm = Math.floor(tenthsMm / 10);
  const vernierTick = tenthsMm % 10;
  const totalMm = tenthsMm / 10;
  const totalCm = tenthsMm / 100;
  return {
    tenthsMm,
    mainScaleMm,
    mainScaleCm: mainScaleMm / 10,
    vernierTick,
    totalMm,
    totalCm,
    formattedMm: totalMm.toFixed(1).replace('.', ','),
    formattedCm: totalCm.toFixed(2).replace('.', ','),
  };
}

/**
 * Micrometer screw gauge (Mikrometer Sekrup) with 0.01 mm precision (range 0.00 - 25.00 mm)
 */
export function computeMicrometerReading(mmInput: number): MicrometerReading {
  const clamped = Math.max(0, Math.min(25, mmInput));
  const hundredthsMm = Math.round(clamped * 100);
  const mainScaleHalfCount = Math.floor(hundredthsMm / 50);
  const mainScaleMm = mainScaleHalfCount * 0.5;
  const thimbleTick = hundredthsMm % 50;
  const totalMm = hundredthsMm / 100;
  return {
    hundredthsMm,
    mainScaleMm,
    thimbleTick,
    totalMm,
    formattedMm: totalMm.toFixed(2).replace('.', ','),
  };
}

/**
 * Ruler reading (Penggaris) with 0.1 cm (1 mm) precision
 */
export function computeRulerReading(startCmInput: number, endCmInput: number): RulerReading {
  const startTenths = Math.round(Math.max(0, Math.min(15, startCmInput)) * 10);
  const endTenths = Math.round(Math.max(0, Math.min(15, endCmInput)) * 10);
  const minT = Math.min(startTenths, endTenths);
  const maxT = Math.max(startTenths, endTenths);
  const diffTenths = maxT - minT;
  return {
    startCm: minT / 10,
    endCm: maxT / 10,
    lengthCm: diffTenths / 10,
    lengthMm: diffTenths,
    formattedCm: (diffTenths / 10).toFixed(1).replace('.', ','),
    formattedMm: String(diffTenths),
  };
}

/**
 * Check if a student's numeric answer matches expected within tolerance
 */
export function isNumericAnswerCorrect(
  studentInput: string,
  expectedValue: number,
  tolerance = 0.015
): boolean {
  const parsed = parseLocaleNumber(studentInput);
  if (parsed === null) return false;
  return Math.abs(parsed - expectedValue) <= tolerance;
}

const LENGTH_FACTORS_TO_M: Record<string, number> = {
  km: 1000,
  hm: 100,
  dam: 10,
  m: 1,
  dm: 0.1,
  cm: 0.01,
  mm: 0.001,
};

const MASS_FACTORS_TO_G: Record<string, number> = {
  kg: 1000,
  hg: 100,
  dag: 10,
  g: 1,
  dg: 0.1,
  cg: 0.01,
  mg: 0.001,
};

const TIME_FACTORS_TO_S: Record<string, number> = {
  jam: 3600,
  menit: 60,
  sekon: 1,
};

const VOLUME_FACTORS_TO_L: Record<string, number> = {
  'm³': 1000,
  'dm³': 1,
  liter: 1,
  'cm³': 0.001,
  mL: 0.001,
};

export const UNIT_LISTS: Record<UnitCategory, string[]> = {
  panjang: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'],
  massa: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'],
  waktu: ['jam', 'menit', 'sekon'],
  volume: ['m³', 'dm³', 'liter', 'cm³', 'mL'],
  suhu: ['°C', 'K', '°F'],
};

export function convertUnit(
  value: number,
  category: UnitCategory,
  fromUnit: string,
  toUnit: string
): ConversionOutput {
  if (!Number.isFinite(value)) {
    return {
      valid: false,
      result: 0,
      formattedResult: '0',
      steps: [],
      factorText: '',
      error: 'Masukkan angka yang valid.',
    };
  }

  if (fromUnit === toUnit) {
    return {
      valid: true,
      result: value,
      formattedResult: formatCleanNumber(value, 6),
      steps: [`Satuan asal dan tujuan sama (${fromUnit}), sehingga nilainya tetap ${formatCleanNumber(value, 6)} ${toUnit}.`],
      factorText: '× 1',
    };
  }

  if (category === 'suhu') {
    let celsius = value;
    const steps: string[] = [];
    if (fromUnit === '°C') {
      celsius = value;
    } else if (fromUnit === 'K') {
      celsius = value - 273.15;
      steps.push(`1. Ubah Kelvin ke Celsius: ${formatCleanNumber(value)} - 273,15 = ${formatCleanNumber(celsius)} °C`);
    } else if (fromUnit === '°F') {
      celsius = ((value - 32) * 5) / 9;
      steps.push(`1. Ubah Fahrenheit ke Celsius: (${formatCleanNumber(value)} - 32) × 5/9 = ${formatCleanNumber(celsius)} °C`);
    } else {
      return { valid: false, result: 0, formattedResult: '0', steps: [], factorText: '', error: 'Satuan suhu tidak dikenali.' };
    }

    let finalVal = celsius;
    if (toUnit === '°C') {
      finalVal = celsius;
    } else if (toUnit === 'K') {
      finalVal = celsius + 273.15;
      steps.push(`${steps.length + 1}. Ubah Celsius ke Kelvin: ${formatCleanNumber(celsius)} + 273,15 = ${formatCleanNumber(finalVal)} K`);
    } else if (toUnit === '°F') {
      finalVal = (celsius * 9) / 5 + 32;
      steps.push(`${steps.length + 1}. Ubah Celsius ke Fahrenheit: (${formatCleanNumber(celsius)} × 9/5) + 32 = ${formatCleanNumber(finalVal)} °F`);
    } else {
      return { valid: false, result: 0, formattedResult: '0', steps: [], factorText: '', error: 'Satuan suhu tujuan tidak dikenali.' };
    }

    return {
      valid: true,
      result: Number(finalVal.toFixed(6)),
      formattedResult: formatCleanNumber(finalVal, 4),
      steps,
      factorText: 'Rumus termodinamika',
    };
  }

  const tableMap: Record<Exclude<UnitCategory, 'suhu'>, Record<string, number>> = {
    panjang: LENGTH_FACTORS_TO_M,
    massa: MASS_FACTORS_TO_G,
    waktu: TIME_FACTORS_TO_S,
    volume: VOLUME_FACTORS_TO_L,
  };

  const factors = tableMap[category];
  const fromFactor = factors[fromUnit];
  const toFactor = factors[toUnit];
  if (fromFactor === undefined || toFactor === undefined) {
    return { valid: false, result: 0, formattedResult: '0', steps: [], factorText: '', error: 'Satuan tidak valid.' };
  }

  const ratio = fromFactor / toFactor;
  const result = value * ratio;
  const ratioClean = formatCleanNumber(ratio, 8);
  const steps: string[] = [];

  if (category === 'panjang' || category === 'massa') {
    const list = UNIT_LISTS[category];
    const idxFrom = list.indexOf(fromUnit);
    const idxTo = list.indexOf(toUnit);
    const diff = idxTo - idxFrom;
    if (diff > 0) {
      steps.push(`1. Dari ${fromUnit} ke ${toUnit} turun ${diff} tangga pada tangga satuan.`);
      steps.push(`2. Setiap turun 1 tangga dikalikan 10, jadi dikalikan 10^${diff} = ${formatCleanNumber(Math.pow(10, diff), 0)}.`);
      steps.push(`3. Hitungan: ${formatCleanNumber(value)} × ${formatCleanNumber(Math.pow(10, diff), 0)} = ${formatCleanNumber(result, 6)} ${toUnit}.`);
    } else {
      const up = Math.abs(diff);
      steps.push(`1. Dari ${fromUnit} ke ${toUnit} naik ${up} tangga pada tangga satuan.`);
      steps.push(`2. Setiap naik 1 tangga dibagi 10, jadi dibagi 10^${up} = ${formatCleanNumber(Math.pow(10, up), 0)}.`);
      steps.push(`3. Hitungan: ${formatCleanNumber(value)} ÷ ${formatCleanNumber(Math.pow(10, up), 0)} = ${formatCleanNumber(result, 6)} ${toUnit}.`);
    }
  } else {
    steps.push(`1. Faktor konversi: 1 ${fromUnit} = ${ratioClean} ${toUnit}.`);
    steps.push(`2. Hitungan: ${formatCleanNumber(value)} × ${ratioClean} = ${formatCleanNumber(result, 6)} ${toUnit}.`);
  }

  return {
    valid: true,
    result: Number(result.toFixed(8)),
    formattedResult: formatCleanNumber(result, 6),
    steps,
    factorText: ratio >= 1 ? `× ${ratioClean}` : `÷ ${formatCleanNumber(1 / ratio, 6)}`,
  };
}

export interface DerivedInputs {
  a: number;
  b: number;
  c?: number;
}

export function calculateDerivedQuantity(
  type: DerivedQuantityType,
  inputs: DerivedInputs
): DerivedCalcOutput {
  const { a, b, c = 1 } = inputs;
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    return {
      valid: false,
      value: 0,
      formattedValue: '0',
      unit: '',
      formulaText: '',
      steps: [],
      baseDerivation: '',
      error: 'Input harus berupa angka yang valid.',
    };
  }

  switch (type) {
    case 'luas': {
      const val = a * b;
      return {
        valid: true,
        value: val,
        formattedValue: formatCleanNumber(val, 4),
        unit: 'm²',
        formulaText: 'L = p × l',
        steps: [
          `Panjang (p) = ${formatCleanNumber(a)} m`,
          `Lebar (l) = ${formatCleanNumber(b)} m`,
          `L = ${formatCleanNumber(a)} m × ${formatCleanNumber(b)} m = ${formatCleanNumber(val, 4)} m²`,
        ],
        baseDerivation: 'm × m = m² (kombinasi besaran pokok Panjang × Panjang)',
      };
    }
    case 'volume': {
      const val = a * b * c;
      return {
        valid: true,
        value: val,
        formattedValue: formatCleanNumber(val, 4),
        unit: 'm³',
        formulaText: 'V = p × l × t',
        steps: [
          `Panjang = ${formatCleanNumber(a)} m, Lebar = ${formatCleanNumber(b)} m, Tinggi = ${formatCleanNumber(c)} m`,
          `V = ${formatCleanNumber(a)} × ${formatCleanNumber(b)} × ${formatCleanNumber(c)} = ${formatCleanNumber(val, 4)} m³`,
        ],
        baseDerivation: 'm × m × m = m³ (kombinasi besaran pokok Panjang³)',
      };
    }
    case 'kecepatan': {
      if (b <= 0) {
        return {
          valid: false,
          value: 0,
          formattedValue: '0',
          unit: 'm/s',
          formulaText: 'v = s / t',
          steps: [],
          baseDerivation: 'm / s',
          error: 'Waktu tempuh (t) harus lebih besar dari 0 sekon.',
        };
      }
      const val = a / b;
      return {
        valid: true,
        value: val,
        formattedValue: formatCleanNumber(val, 4),
        unit: 'm/s',
        formulaText: 'v = s / t',
        steps: [
          `Jarak tempuh (s) = ${formatCleanNumber(a)} m`,
          `Waktu tempuh (t) = ${formatCleanNumber(b)} s`,
          `v = ${formatCleanNumber(a)} m ÷ ${formatCleanNumber(b)} s = ${formatCleanNumber(val, 4)} m/s`,
        ],
        baseDerivation: 'Panjang (m) ÷ Waktu (s) = m/s',
      };
    }
    case 'percepatan': {
      if (b <= 0) {
        return {
          valid: false,
          value: 0,
          formattedValue: '0',
          unit: 'm/s²',
          formulaText: 'a = Δv / t',
          steps: [],
          baseDerivation: '(m/s) / s = m/s²',
          error: 'Selang waktu (t) harus lebih besar dari 0 sekon.',
        };
      }
      const val = a / b;
      return {
        valid: true,
        value: val,
        formattedValue: formatCleanNumber(val, 4),
        unit: 'm/s²',
        formulaText: 'a = Δv / t',
        steps: [
          `Perubahan kecepatan (Δv) = ${formatCleanNumber(a)} m/s`,
          `Selang waktu (t) = ${formatCleanNumber(b)} s`,
          `a = ${formatCleanNumber(a)} ÷ ${formatCleanNumber(b)} = ${formatCleanNumber(val, 4)} m/s²`,
        ],
        baseDerivation: 'Panjang (m) ÷ Waktu² (s²) = m/s²',
      };
    }
    case 'gaya': {
      const val = a * b;
      return {
        valid: true,
        value: val,
        formattedValue: formatCleanNumber(val, 4),
        unit: 'N',
        formulaText: 'F = m × a',
        steps: [
          `Massa benda (m) = ${formatCleanNumber(a)} kg`,
          `Percepatan (a) = ${formatCleanNumber(b)} m/s²`,
          `F = ${formatCleanNumber(a)} kg × ${formatCleanNumber(b)} m/s² = ${formatCleanNumber(val, 4)} N`,
        ],
        baseDerivation: 'Massa (kg) × Panjang (m) ÷ Waktu² (s²) = kg·m/s² (Newton)',
      };
    }
    case 'massa_jenis': {
      if (b <= 0) {
        return {
          valid: false,
          value: 0,
          formattedValue: '0',
          unit: 'kg/m³',
          formulaText: 'ρ = m / V',
          steps: [],
          baseDerivation: 'kg / m³',
          error: 'Volume benda (V) harus lebih besar dari 0 m³.',
        };
      }
      const val = a / b;
      return {
        valid: true,
        value: val,
        formattedValue: formatCleanNumber(val, 4),
        unit: 'kg/m³',
        formulaText: 'ρ = m / V',
        steps: [
          `Massa benda (m) = ${formatCleanNumber(a)} kg`,
          `Volume benda (V) = ${formatCleanNumber(b)} m³`,
          `ρ = ${formatCleanNumber(a)} kg ÷ ${formatCleanNumber(b)} m³ = ${formatCleanNumber(val, 4)} kg/m³`,
        ],
        baseDerivation: 'Massa (kg) ÷ Panjang³ (m³) = kg/m³',
      };
    }
    case 'tekanan': {
      if (b <= 0) {
        return {
          valid: false,
          value: 0,
          formattedValue: '0',
          unit: 'Pa',
          formulaText: 'P = F / A',
          steps: [],
          baseDerivation: 'kg / (m·s²)',
          error: 'Luas bidang tekan (A) harus lebih besar dari 0 m².',
        };
      }
      const val = a / b;
      return {
        valid: true,
        value: val,
        formattedValue: formatCleanNumber(val, 4),
        unit: 'Pa',
        formulaText: 'P = F / A',
        steps: [
          `Gaya tekan (F) = ${formatCleanNumber(a)} N`,
          `Luas bidang tekan (A) = ${formatCleanNumber(b)} m²`,
          `P = ${formatCleanNumber(a)} N ÷ ${formatCleanNumber(b)} m² = ${formatCleanNumber(val, 4)} Pa`,
        ],
        baseDerivation: 'Massa (kg) ÷ [Panjang (m) × Waktu² (s²)] = N/m² (Pascal)',
      };
    }
  }
}
