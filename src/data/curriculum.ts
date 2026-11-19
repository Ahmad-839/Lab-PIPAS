import type { DerivedQuantityType } from '../types';

export interface Zona1ObjectInfo {
  id: 'penggaris' | 'timbangan' | 'stopwatch' | 'termometer' | 'gelas_ukur';
  name: string;
  quantityName: string;
  quantitySymbol: string;
  siUnit: string;
  unitSymbol: string;
  commonUnit: string;
  explanation: string;
  realLifeExample: string;
  measurementTip: string;
}

export const ZONA1_OBJECTS: Zona1ObjectInfo[] = [
  {
    id: 'penggaris',
    name: 'Penggaris Baja 30 cm',
    quantityName: 'Panjang',
    quantitySymbol: 'l / s',
    siUnit: 'meter',
    unitSymbol: 'm',
    commonUnit: 'centimeter (cm) & milimeter (mm)',
    explanation:
      'Penggaris digunakan untuk mengukur besaran Panjang, yaitu jarak antara dua titik. Skala terkecil penggaris standar adalah 1 mm atau 0,1 cm.',
    realLifeExample:
      'Mengukur panjang meja bengkel SMK, lebar papan tulis, atau panjang potongan kabel instalasi.',
    measurementTip: 'Posisikan mata tegak lurus terhadap skala untuk menghindari kesalahan paralaks.',
  },
  {
    id: 'timbangan',
    name: 'Timbangan Laboratorium',
    quantityName: 'Massa',
    quantitySymbol: 'm',
    siUnit: 'kilogram',
    unitSymbol: 'kg',
    commonUnit: 'gram (g) & miligram (mg)',
    explanation:
      'Timbangan atau neraca mengukur besaran Massa, yaitu banyaknya materi yang terkandung dalam suatu benda (berbeda dengan berat yang dipengaruhi gravitasi).',
    realLifeExample:
      'Menimbang beras 5 kg di kantin, menimbang bahan kimia di lab, atau menimbang komponen logam.',
    measurementTip: 'Pastikan penunjuk menunjukkan angka nol (kalibrasi/tare) sebelum meletakkan benda.',
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch Digital',
    quantityName: 'Waktu',
    quantitySymbol: 't',
    siUnit: 'sekon',
    unitSymbol: 's',
    commonUnit: 'jam, menit, & milisekon (ms)',
    explanation:
      'Stopwatch mengukur besaran Waktu, yaitu selang atau durasi berlangsungnya suatu kejadian dari awal hingga akhir.',
    realLifeExample:
      'Menghitung waktu perjalanan ke sekolah, mencatat waktu lari 100 m, atau durasi reaksi kimia.',
    measurementTip: 'Tekan tombol Mulai dan Berhenti tepat saat peristiwa dimulai dan berakhir.',
  },
  {
    id: 'termometer',
    name: 'Termometer Laboratorium',
    quantityName: 'Suhu',
    quantitySymbol: 'T',
    siUnit: 'kelvin',
    unitSymbol: 'K',
    commonUnit: 'derajat Celsius (°C) & Fahrenheit (°F)',
    explanation:
      'Termometer mengukur besaran Suhu, yaitu ukuran derajat panas atau dinginnya suatu benda atau ruangan.',
    realLifeExample:
      'Mengukur suhu air mendidih (100 °C), suhu tubuh siswa, atau suhu mesin pendingin ruangan.',
    measurementTip: 'Tunggu hingga raksa atau angka digital stabil sebelum membaca suhu akhir.',
  },
  {
    id: 'gelas_ukur',
    name: 'Gelas Ukur 500 mL',
    quantityName: 'Volume',
    quantitySymbol: 'V',
    siUnit: 'meter kubik',
    unitSymbol: 'm³',
    commonUnit: 'liter (L) & mililiter (mL)',
    explanation:
      'Gelas ukur mengukur besaran Volume (besaran turunan dari panjang³), yaitu seberapa banyak ruang yang ditempati zat cair.',
    realLifeExample:
      'Mengukur volume air mineral 600 mL, takaran oli mesin motor di bengkel otomotif, atau larutan praktikum.',
    measurementTip: 'Baca skala tepat pada bagian cekungan bawah permukaan cairan (meniskus cekung).',
  },
];

export interface ConceptTabItem {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  comparisonRows?: { aspek: string; left: string; right: string }[];
  leftHeader?: string;
  rightHeader?: string;
}

export const ZONA1_CONCEPTS: ConceptTabItem[] = [
  {
    id: 'pengertian',
    title: 'Besaran, Satuan & Pengukuran',
    summary:
      'Dalam sains dan teknik SMK, setiap hasil pengamatan harus dinyatakan secara objektif menggunakan angka dan satuan.',
    keyPoints: [
      'Besaran adalah segala sesuatu yang dapat diukur, memiliki nilai angka, dan dinyatakan dengan satuan (contoh: panjang meja = 1,2 m).',
      'Satuan adalah pembanding standar yang digunakan dalam pengukuran (contoh: meter, kilogram, sekon).',
      'Pengukuran adalah kegiatan membandingkan suatu besaran yang diukur dengan besaran sejenis yang ditetapkan sebagai satuan.',
    ],
  },
  {
    id: 'perbedaan',
    title: 'Perbedaan Besaran & Satuan',
    summary:
      'Banyak siswa tertukar antara nama besaran dan satuannya. Contoh: "Panjang" adalah besaran, sedangkan "meter" adalah satuannya.',
    keyPoints: [
      'Contoh kalimat: "Massa karung beras itu adalah 10 kilogram." -> Massa = Besaran, 10 = Nilai, kilogram = Satuan.',
      'Satu besaran dapat memiliki beberapa satuan berbeda (misalnya Panjang bisa memakai m, cm, km, atau inci).',
    ],
    leftHeader: 'Besaran (Apa yang diukur)',
    rightHeader: 'Satuan (Pembandingnya)',
    comparisonRows: [
      { aspek: 'Panjang Meja 120 cm', left: 'Panjang', right: 'centimeter (cm)' },
      { aspek: 'Massa Beras 5 kg', left: 'Massa', right: 'kilogram (kg)' },
      { aspek: 'Waktu Perjalanan 15 menit', left: 'Waktu', right: 'menit' },
      { aspek: 'Suhu Air 80 °C', left: 'Suhu', right: 'derajat Celsius (°C)' },
    ],
  },
  {
    id: 'pokok_turunan',
    title: 'Besaran Pokok vs Turunan',
    summary:
      'Berdasarkan cara mendapatkannya, besaran dibagi menjadi Besaran Pokok dan Besaran Turunan.',
    keyPoints: [
      'Besaran Pokok adalah besaran utama yang satuannya telah ditetapkan terlebih dahulu secara internasional dan tidak diturunkan dari besaran lain (ada 7 besaran pokok SI).',
      'Besaran Turunan adalah besaran yang diturunkan atau dibentuk dari kombinasi beberapa besaran pokok (contoh: Luas = panjang × lebar, Kecepatan = jarak ÷ waktu).',
    ],
    leftHeader: 'Besaran Pokok',
    rightHeader: 'Besaran Turunan',
    comparisonRows: [
      { aspek: 'Asal', left: 'Berdiri sendiri (dasar)', right: 'Kombinasi besaran pokok' },
      { aspek: 'Jumlah', left: 'Hanya 7 di sistem SI', right: 'Sangat banyak (Luas, Gaya, dll.)' },
      { aspek: 'Contoh', left: 'Panjang (m), Massa (kg), Waktu (s)', right: 'Kecepatan (m/s), Massa Jenis (kg/m³)' },
    ],
  },
  {
    id: 'si',
    title: 'Satuan Baku, Tidak Baku & SI',
    summary:
      'Agar hasil pengukuran di bengkel SMK Indonesia sama dengan standar pabrik di Jepang atau Eropa, digunakan Sistem Satuan Internasional (SI).',
    keyPoints: [
      'Satuan Tidak Baku: hasil pengukuran berbeda-beda tiap orang (contoh: jengkal tangan, hasta, depa, langkah kaki).',
      'Satuan Baku: hasil pengukuran selalu tetap dan diakui secara resmi (contoh: meter, kilogram, sekon, liter).',
      'Sistem Internasional (SI) atau MKS (Meter-Kilogram-Sekon) ditetapkan oleh konferensi CGPM agar komunikasi ilmiah dan industri seragam di seluruh dunia.',
    ],
  },
];

export interface BaseQuantityInfo {
  id: string;
  name: string;
  symbol: string;
  siUnit: string;
  unitSymbol: string;
  tools: string[];
  dailyExample: string;
  definition: string;
  animType: 'length' | 'mass' | 'time' | 'temp' | 'current' | 'mole' | 'light';
}

export const BASE_QUANTITIES: BaseQuantityInfo[] = [
  {
    id: 'panjang',
    name: 'Panjang',
    symbol: 'l',
    siUnit: 'meter',
    unitSymbol: 'm',
    tools: ['Mistar / Penggaris', 'Meteran Gulung', 'Jangka Sorong', 'Mikrometer Sekrup'],
    dailyExample: 'Mengukur panjang meja praktikum (1,5 m) atau diameter baut dengan jangka sorong.',
    definition: 'Menyatakan jarak antara dua titik dalam ruang.',
    animType: 'length',
  },
  {
    id: 'massa',
    name: 'Massa',
    symbol: 'm',
    siUnit: 'kilogram',
    unitSymbol: 'kg',
    tools: ['Neraca Ohaus', 'Timbangan Digital', 'Neraca Analitik'],
    dailyExample: 'Menimbang beras 5 kg atau mengukur massa pelat aluminium sebelum praktikum.',
    definition: 'Menyatakan jumlah materi yang terkandung di dalam suatu benda.',
    animType: 'mass',
  },
  {
    id: 'waktu',
    name: 'Waktu',
    symbol: 't',
    siUnit: 'sekon',
    unitSymbol: 's',
    tools: ['Stopwatch', 'Jam Digital', 'Jam Atom'],
    dailyExample: 'Mengukur waktu perjalanan siswa ke sekolah atau durasi pengisian baterai.',
    definition: 'Selang antara dua kejadian atau durasi berlangsungnya proses.',
    animType: 'time',
  },
  {
    id: 'suhu',
    name: 'Suhu Termodinamik',
    symbol: 'T',
    siUnit: 'kelvin',
    unitSymbol: 'K',
    tools: ['Termometer Raksa', 'Termometer Digital', 'Termokopel'],
    dailyExample: 'Mengukur suhu air mendidih (100 °C = 373,15 K) atau suhu solder listrik.',
    definition: 'Ukuran derajat panas atau energi kinetik rata-rata partikel suatu zat.',
    animType: 'temp',
  },
  {
    id: 'arus',
    name: 'Kuat Arus Listrik',
    symbol: 'I',
    siUnit: 'ampere',
    unitSymbol: 'A',
    tools: ['Amperemeter', 'Multimeter / AVO Meter', 'Tang Ampere'],
    dailyExample: 'Mengukur arus pengisian charger laptop (2 A) atau rangkaian instalasi listrik SMK.',
    definition: 'Banyaknya muatan listrik yang mengalir melalui penghantar tiap satu sekon.',
    animType: 'current',
  },
  {
    id: 'jumlah_zat',
    name: 'Jumlah Zat',
    symbol: 'n',
    siUnit: 'mol',
    unitSymbol: 'mol',
    tools: ['Dihitung dari massa & massa molar (n = m / Mr) menggunakan Neraca Analitik'],
    dailyExample: 'Menghitung jumlah partikel larutan garam atau pereaksi dalam laboratorium kimia SMK.',
    definition: 'Menyatakan banyaknya entitas elementer (atom, molekul, atau ion) dalam suatu zat.',
    animType: 'mole',
  },
  {
    id: 'intensitas',
    name: 'Intensitas Cahaya',
    symbol: 'Iv',
    siUnit: 'kandela',
    unitSymbol: 'cd',
    tools: ['Lux Meter / Fotometer'],
    dailyExample: 'Mengukur terangnya lampu ruang kelas atau lampu utama sepeda motor di bengkel.',
    definition: 'Daya pancar cahaya suatu sumber ke arah tertentu yang tertangkap mata.',
    animType: 'light',
  },
];

export interface DerivedQuantityMeta {
  type: DerivedQuantityType;
  name: string;
  symbol: string;
  unit: string;
  formula: string;
  inputALabel: string;
  inputAUnit: string;
  defaultA: number;
  minA: number;
  maxA: number;
  stepA: number;
  inputBLabel: string;
  inputBUnit: string;
  defaultB: number;
  minB: number;
  maxB: number;
  stepB: number;
  inputCLabel?: string;
  inputCUnit?: string;
  defaultC?: number;
  minC?: number;
  maxC?: number;
  stepC?: number;
  realExample: string;
}

export const DERIVED_QUANTITIES_META: DerivedQuantityMeta[] = [
  {
    type: 'luas',
    name: 'Luas',
    symbol: 'L / A',
    unit: 'm²',
    formula: 'Luas = panjang × lebar',
    inputALabel: 'Panjang (p)',
    inputAUnit: 'm',
    defaultA: 4,
    minA: 0.5,
    maxA: 20,
    stepA: 0.5,
    inputBLabel: 'Lebar (l)',
    inputBUnit: 'm',
    defaultB: 2.5,
    minB: 0.5,
    maxB: 20,
    stepB: 0.5,
    realExample: 'Menghitung luas permukaan meja kerja atau luas lantai ruang bengkel SMK.',
  },
  {
    type: 'volume',
    name: 'Volume Balok',
    symbol: 'V',
    unit: 'm³',
    formula: 'Volume = panjang × lebar × tinggi',
    inputALabel: 'Panjang (p)',
    inputAUnit: 'm',
    defaultA: 2,
    minA: 0.5,
    maxA: 10,
    stepA: 0.5,
    inputBLabel: 'Lebar (l)',
    inputBUnit: 'm',
    defaultB: 1.5,
    minB: 0.5,
    maxB: 10,
    stepB: 0.5,
    inputCLabel: 'Tinggi (t)',
    inputCUnit: 'm',
    defaultC: 1,
    minC: 0.5,
    maxC: 10,
    stepC: 0.5,
    realExample: 'Menghitung daya tampung bak penampung air praktikum atau peti komponen.',
  },
  {
    type: 'kecepatan',
    name: 'Kecepatan',
    symbol: 'v',
    unit: 'm/s',
    formula: 'Kecepatan = jarak ÷ waktu',
    inputALabel: 'Jarak Tempuh (s)',
    inputAUnit: 'm',
    defaultA: 120,
    minA: 10,
    maxA: 1000,
    stepA: 10,
    inputBLabel: 'Waktu Tempuh (t)',
    inputBUnit: 's',
    defaultB: 15,
    minB: 1,
    maxB: 120,
    stepB: 1,
    realExample: 'Menghitung laju sepeda motor saat melintasi jalan raya menuju sekolah.',
  },
  {
    type: 'percepatan',
    name: 'Percepatan',
    symbol: 'a',
    unit: 'm/s²',
    formula: 'Percepatan = perubahan kecepatan ÷ waktu',
    inputALabel: 'Perubahan Kecepatan (Δv)',
    inputAUnit: 'm/s',
    defaultA: 18,
    minA: 1,
    maxA: 60,
    stepA: 1,
    inputBLabel: 'Selang Waktu (t)',
    inputBUnit: 's',
    defaultB: 6,
    minB: 1,
    maxB: 30,
    stepB: 1,
    realExample: 'Menghitung kemampuan akselerasi kendaraan dari diam hingga melaju kencang.',
  },
  {
    type: 'gaya',
    name: 'Gaya',
    symbol: 'F',
    unit: 'N',
    formula: 'Gaya = massa × percepatan',
    inputALabel: 'Massa Benda (m)',
    inputAUnit: 'kg',
    defaultA: 12,
    minA: 1,
    maxA: 100,
    stepA: 1,
    inputBLabel: 'Percepatan (a)',
    inputBUnit: 'm/s²',
    defaultB: 3,
    minB: 0.5,
    maxB: 20,
    stepB: 0.5,
    realExample: 'Gaya dorong yang dibutuhkan teknisi untuk menggerakkan peti peralatan.',
  },
  {
    type: 'massa_jenis',
    name: 'Massa Jenis',
    symbol: 'ρ',
    unit: 'kg/m³',
    formula: 'Massa Jenis = massa ÷ volume',
    inputALabel: 'Massa Benda (m)',
    inputAUnit: 'kg',
    defaultA: 500,
    minA: 50,
    maxA: 3000,
    stepA: 50,
    inputBLabel: 'Volume (V)',
    inputBUnit: 'm³',
    defaultB: 0.5,
    minB: 0.1,
    maxB: 3,
    stepB: 0.1,
    realExample: 'Menentukan apakah balok material akan tenggelam atau mengapung di air (ρ air = 1000 kg/m³).',
  },
  {
    type: 'tekanan',
    name: 'Tekanan',
    symbol: 'P',
    unit: 'Pa',
    formula: 'Tekanan = gaya ÷ luas bidang',
    inputALabel: 'Gaya Tekan (F)',
    inputAUnit: 'N',
    defaultA: 400,
    minA: 20,
    maxA: 2000,
    stepA: 20,
    inputBLabel: 'Luas Bidang Tekan (A)',
    inputBUnit: 'm²',
    defaultB: 2,
    minB: 0.2,
    maxB: 10,
    stepB: 0.2,
    realExample: 'Tekanan dongkrak hidrolik atau tekanan kaki meja pada lantai bengkel.',
  },
];

export interface QuizQuestion {
  id: number;
  type: 'pg' | 'tf' | 'calc';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export const FINAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  // 10 Pilihan Ganda
  {
    id: 1,
    type: 'pg',
    topic: 'Konsep Besaran & Satuan',
    question: 'Dalam kalimat "Panjang kabel listrik di bengkel adalah 15 meter", manakah yang merupakan besaran?',
    options: ['15', 'meter', 'Panjang', 'Kabel listrik'],
    correctIndex: 2,
    explanation: 'Panjang adalah besaran (sesuatu yang diukur), 15 adalah nilai angka, dan meter adalah satuannya.',
  },
  {
    id: 2,
    type: 'pg',
    topic: 'Satuan Baku & Tidak Baku',
    question: 'Berikut ini yang termasuk contoh satuan tidak baku adalah...',
    options: ['Kilogram', 'Jengkal', 'Sekon', 'Meter'],
    correctIndex: 1,
    explanation: 'Jengkal adalah satuan tidak baku karena panjang telapak tangan setiap orang berbeda-beda.',
  },
  {
    id: 3,
    type: 'pg',
    topic: 'Besaran Pokok SI',
    question: 'Pasangan besaran pokok dan satuan SI yang paling tepat adalah...',
    options: [
      'Suhu — derajat Celsius (°C)',
      'Massa — gram (g)',
      'Kuat arus listrik — ampere (A)',
      'Kecepatan — meter/sekon (m/s)',
    ],
    correctIndex: 2,
    explanation: 'Satuan SI suhu adalah kelvin (K), massa adalah kilogram (kg), kuat arus listrik adalah ampere (A), dan kecepatan adalah besaran turunan.',
  },
  {
    id: 4,
    type: 'pg',
    topic: 'Alat Ukur Ketelitian Tinggi',
    question: 'Alat ukur yang paling tepat digunakan untuk mengukur ketebalan selembar pelat logam tipis dengan ketelitian 0,01 mm adalah...',
    options: ['Penggaris kayu', 'Meteran gulung', 'Jangka sorong', 'Mikrometer sekrup'],
    correctIndex: 3,
    explanation: 'Mikrometer sekrup memiliki ketelitian 0,01 mm, lebih teliti daripada jangka sorong (0,1 mm) maupun penggaris (1 mm).',
  },
  {
    id: 5,
    type: 'pg',
    topic: 'Besaran Pokok',
    question: 'Di antara kelompok besaran berikut, manakah yang seluruhnya termasuk Besaran Pokok?',
    options: [
      'Panjang, Massa, Luas',
      'Waktu, Suhu, Kuat Arus Listrik',
      'Volume, Massa, Waktu',
      'Gaya, Tekanan, Panjang',
    ],
    correctIndex: 1,
    explanation: 'Waktu, Suhu, dan Kuat Arus Listrik semuanya termasuk dalam 7 Besaran Pokok SI.',
  },
  {
    id: 6,
    type: 'pg',
    topic: 'Besaran Turunan',
    question: 'Besaran Gaya (F = m × a) memiliki satuan Newton (N). Dalam satuan besaran pokok SI, Newton setara dengan...',
    options: ['kg·m/s', 'kg·m/s²', 'kg/m³', 'm²/s'],
    correctIndex: 1,
    explanation: 'Massa (kg) dikalikan Percepatan (m/s²) menghasilkan satuan kg·m/s² yang disebut Newton (N).',
  },
  {
    id: 7,
    type: 'pg',
    topic: 'Pembacaan Jangka Sorong',
    question: 'Saat mengukur diameter luar pipa menggunakan jangka sorong (ketelitian 0,01 cm), skala utama menunjukkan 3,2 cm dan garis ke-6 skala nonius berimpit lurus dengan skala utama. Hasil pengukurannya adalah...',
    options: ['3,26 cm', '3,80 cm', '3,06 cm', '3,62 cm'],
    correctIndex: 0,
    explanation: 'Hasil = Skala Utama + (Skala Nonius × 0,01 cm) = 3,2 cm + (6 × 0,01 cm) = 3,26 cm.',
  },
  {
    id: 8,
    type: 'pg',
    topic: 'Pembacaan Mikrometer Sekrup',
    question: 'Hasil pembacaan mikrometer sekrup menunjukkan skala utama 4,5 mm dan skala putar (thimble) tepat pada angka 18. Ketebalan benda adalah...',
    options: ['4,18 mm', '4,68 mm', '5,18 mm', '6,30 mm'],
    correctIndex: 1,
    explanation: 'Hasil = 4,5 mm + (18 × 0,01 mm) = 4,50 + 0,18 = 4,68 mm.',
  },
  {
    id: 9,
    type: 'pg',
    topic: 'Pengukuran Volume',
    question: 'Untuk membaca volume air pada gelas ukur secara akurat, posisi mata harus sejajar dengan...',
    options: ['Bagian atas dinding gelas', 'Cekungan bawah permukaan air (meniskus)', 'Dasar meja praktikum', 'Angka nol di bawah'],
    correctIndex: 1,
    explanation: 'Air membentuk meniskus cekung di dalam gelas ukur; pembacaan yang benar adalah sejajar dengan dasar cekungan meniskus.',
  },
  {
    id: 10,
    type: 'pg',
    topic: 'Intensitas & Jumlah Zat',
    question: 'Satuan SI untuk besaran pokok Jumlah Zat dan Intensitas Cahaya berturut-turut adalah...',
    options: ['gram dan lux', 'mol dan kandela', 'liter dan watt', 'newton dan kelvin'],
    correctIndex: 1,
    explanation: 'Jumlah zat bersatuan mol (mol) dan intensitas cahaya bersatuan kandela (cd).',
  },

  // 5 Benar atau Salah
  {
    id: 11,
    type: 'tf',
    topic: 'Konsep Besaran',
    question: 'BENAR atau SALAH: Besaran pokok "Suhu" memiliki satuan Sistem Internasional (SI) yaitu derajat Celsius (°C).',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
    explanation: 'SALAH. Satuan SI resmi untuk suhu termodinamik adalah kelvin (K), bukan derajat Celsius.',
  },
  {
    id: 12,
    type: 'tf',
    topic: 'Besaran Turunan',
    question: 'BENAR atau SALAH: Luas dan Volume keduanya diturunkan hanya dari satu jenis besaran pokok, yaitu Panjang.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. Luas = Panjang × Lebar (m²) dan Volume = Panjang × Lebar × Tinggi (m³), keduanya berasal dari besaran pokok Panjang.',
  },
  {
    id: 13,
    type: 'tf',
    topic: 'Konversi Volume',
    question: 'BENAR atau SALAH: Volume 1 liter air sama persis dengan 1 dm³ atau 1.000 mL.',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. 1 liter = 1 dm³ = 1.000 cm³ = 1.000 mL.',
  },
  {
    id: 14,
    type: 'tf',
    topic: 'Alat Ukur Waktu',
    question: 'BENAR atau SALAH: Neraca atau timbangan digital digunakan untuk mengukur besaran berat dalam satuan Newton.',
    options: ['Benar', 'Salah'],
    correctIndex: 1,
    explanation: 'SALAH. Timbangan/neraca mengukur besaran Massa dalam satuan gram atau kilogram (kg). Alat pengukur gaya/berat adalah dinamometer.',
  },
  {
    id: 15,
    type: 'tf',
    topic: 'Konversi Suhu',
    question: 'BENAR atau SALAH: Suhu 27 °C jika dikonversi ke satuan Kelvin bernilai 300,15 K (atau sekitar 300 K).',
    options: ['Benar', 'Salah'],
    correctIndex: 0,
    explanation: 'BENAR. T(K) = T(°C) + 273,15 = 27 + 273,15 = 300,15 K.',
  },

  // 5 Soal Hitungan
  {
    id: 16,
    type: 'calc',
    topic: 'Konversi Panjang & Massa',
    question: 'Sebatang besi di bengkel las memiliki panjang 2,4 m dan massa 3.500 g. Dalam satuan cm dan kg, panjang serta massa besi tersebut adalah...',
    options: ['24 cm dan 35 kg', '240 cm dan 3,5 kg', '2.400 cm dan 0,35 kg', '240 cm dan 35 kg'],
    correctIndex: 1,
    explanation: '2,4 m × 100 = 240 cm (turun 2 tangga). 3.500 g ÷ 1.000 = 3,5 kg (naik 3 tangga).',
  },
  {
    id: 17,
    type: 'calc',
    topic: 'Hitung Kecepatan',
    question: 'Seorang siswa SMK mengendarai sepeda motor menempuh jarak 1,8 km dalam waktu 2 menit. Berapa kecepatan rata-ratanya dalam satuan SI (m/s)?',
    options: ['15 m/s', '30 m/s', '900 m/s', '10 m/s'],
    correctIndex: 0,
    explanation: 'Jarak s = 1,8 km = 1.800 m. Waktu t = 2 menit = 120 s. Kecepatan v = 1.800 ÷ 120 = 15 m/s.',
  },
  {
    id: 18,
    type: 'calc',
    topic: 'Hitung Massa Jenis',
    question: 'Sebuah balok logam bermassa 4 kg memiliki volume 0,0005 m³. Berapakah massa jenis (ρ = m / V) logam tersebut?',
    options: ['2.000 kg/m³', '800 kg/m³', '8.000 kg/m³', '4.000 kg/m³'],
    correctIndex: 2,
    explanation: 'ρ = m ÷ V = 4 kg ÷ 0,0005 m³ = 8.000 kg/m³.',
  },
  {
    id: 19,
    type: 'calc',
    topic: 'Hitung Gaya & Tekanan',
    question: 'Sebuah peti bermassa 20 kg didorong dengan percepatan 2 m/s² di atas luas bidang kontak 0,5 m². Berapakah gaya dorong (F) dan tekanan (P) yang dihasilkan?',
    options: ['F = 40 N dan P = 80 Pa', 'F = 10 N dan P = 20 Pa', 'F = 40 N dan P = 20 Pa', 'F = 20 N dan P = 40 Pa'],
    correctIndex: 0,
    explanation: 'Gaya F = m × a = 20 × 2 = 40 N. Tekanan P = F ÷ A = 40 ÷ 0,5 = 80 Pa.',
  },
  {
    id: 20,
    type: 'calc',
    topic: 'Pengukuran Penggaris',
    question: 'Sebuah pensil diukur dengan penggaris. Ujung kiri pensil diletakkan tepat pada skala 2,5 cm, dan ujung kanannya berada di skala 11,8 cm. Panjang pensil sebenarnya adalah...',
    options: ['14,3 cm', '9,3 cm', '8,3 cm', '11,8 cm'],
    correctIndex: 1,
    explanation: 'Panjang benda = Skala akhir - Skala awal = 11,8 cm - 2,5 cm = 9,3 cm.',
  },
];
