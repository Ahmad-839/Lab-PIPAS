import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLevelInfo,
  calculateOverallCompletion,
  calculateStars,
  createInitialProgress,
  evaluateUnlockedBadges,
  gradeQuizScore,
} from './gamification';

test('calculateLevelInfo maps XP to levels and titles properly', () => {
  const lv1 = calculateLevelInfo(0);
  assert.equal(lv1.level, 1);
  assert.equal(lv1.progressPercent, 0);

  const lv2 = calculateLevelInfo(180);
  assert.equal(lv2.level, 2);
  assert.equal(lv2.currentLevelXp, 30);
});

test('gradeQuizScore assigns exact Indonesian achievement categories', () => {
  assert.deepEqual(gradeQuizScore(18, 20), { score: 90, category: 'Ahli Pengukuran' });
  assert.deepEqual(gradeQuizScore(17, 20), { score: 85, category: 'Peneliti Muda' });
  assert.deepEqual(gradeQuizScore(14, 20), { score: 70, category: 'Penjelajah Sains' });
  assert.deepEqual(gradeQuizScore(12, 20), { score: 60, category: 'Perlu Berlatih Lagi' });
});

test('calculateStars assigns 0 to 3 stars accurately', () => {
  assert.equal(calculateStars(5, 5), 3);
  assert.equal(calculateStars(4, 5), 2);
  assert.equal(calculateStars(2, 5), 1);
  assert.equal(calculateStars(1, 5), 0);
});

test('evaluateUnlockedBadges unlocks badges when thresholds are met', () => {
  const p = createInitialProgress();
  p.zona1DiscoveredObjects = ['penggaris', 'timbangan', 'stopwatch', 'termometer', 'gelas_ukur'];
  p.zona1CompletedExperiment = true;
  p.zona2ExploredQuantities = ['panjang', 'massa', 'waktu', 'suhu', 'arus', 'jumlah_zat', 'intensitas'];
  p.zona3CompletedTools = ['penggaris', 'jangka_sorong', 'mikrometer', 'timbangan'];
  const badges = evaluateUnlockedBadges(p);
  assert.equal(badges.includes('master_besaran'), true);
  assert.equal(badges.includes('ahli_satuan_si'), true);
  assert.equal(badges.includes('detektif_pengukuran'), true);
  assert.equal(badges.includes('ilmuwan_muda'), false);
});

test('calculateOverallCompletion returns 0 initially and increases with progress', () => {
  const p = createInitialProgress();
  assert.equal(calculateOverallCompletion(p), 0);
  p.quizHistory.push({
    score: 95,
    correctCount: 19,
    totalQuestions: 20,
    category: 'Ahli Pengukuran',
    timeSpentSeconds: 180,
    completedAt: new Date().toISOString(),
  });
  assert.ok(calculateOverallCompletion(p) >= 14);
});
