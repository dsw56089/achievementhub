import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STATUS,
  completeOneTime,
  completionByGame,
  countByStatus,
  filterByStatus,
  getPercent,
  getProgress,
  incrementProgress,
  overallStats,
  recentlyUnlocked,
  resetProgress,
  updateById,
} from './progress.js';

const T1 = new Date('2026-11-20T10:00:00.000Z');
const T2 = new Date('2026-11-21T10:00:00.000Z');
const T3 = new Date('2026-11-22T10:00:00.000Z');

const counter = (over = {}) =>
  Object.freeze({
    id: 'a1',
    gameId: 'g1',
    title: 'Wygraj 10 meczów',
    type: 'licznik',
    target: 10,
    progress: 0,
    unlockedAt: null,
    ...over,
  });

const oneTime = (over = {}) =>
  Object.freeze({
    id: 'a2',
    gameId: 'g1',
    title: 'Ukończ samouczek',
    type: 'jednorazowe',
    target: 1,
    progress: 0,
    unlockedAt: null,
    ...over,
  });

/* --- licznik ------------------------------------------------------ */

test('+1 zwiększa postęp i nie mutuje oryginału', () => {
  const before = counter({ progress: 3 });
  const after = incrementProgress(before, 1, T1);
  assert.equal(after.progress, 4);
  assert.equal(before.progress, 3);
  assert.notEqual(after, before);
  assert.equal(after.unlockedAt, null);
});

test('postęp zatrzymuje się na celu, unlockedAt ustawione w chwili osiągnięcia', () => {
  const after = incrementProgress(counter({ progress: 9 }), 5, T1);
  assert.equal(after.progress, 10);
  assert.equal(after.unlockedAt, T1.toISOString());
});

test('unlockedAt ustawiane dokładnie raz — kolejne kliknięcia nic nie zmieniają', () => {
  const unlocked = incrementProgress(counter({ progress: 9 }), 1, T1);
  const again = incrementProgress(unlocked, 1, T2);
  assert.equal(again, unlocked);
  assert.equal(again.unlockedAt, T1.toISOString());
  assert.equal(again.progress, 10);
});

test('licznik z progress == target, ale bez daty (zepsute dane), odblokowuje się', () => {
  const after = incrementProgress(counter({ progress: 10 }), 1, T1);
  assert.equal(after.unlockedAt, T1.toISOString());
});

test('niepoprawny krok jest ignorowany', () => {
  const a = counter({ progress: 2 });
  assert.equal(incrementProgress(a, 0, T1), a);
  assert.equal(incrementProgress(a, -3, T1), a);
  assert.equal(incrementProgress(a, NaN, T1), a);
});

test('incrementProgress ignoruje osiągnięcia jednorazowe', () => {
  const a = oneTime();
  assert.equal(incrementProgress(a, 1, T1), a);
});

test('śmieciowe dane: ujemny/tekstowy progress i target', () => {
  assert.equal(getProgress(counter({ progress: -4 })), 0);
  assert.equal(getProgress(counter({ progress: 'abc' })), 0);
  assert.equal(getProgress(counter({ progress: 99 })), 10);
  assert.equal(getPercent(counter({ target: 'x', progress: 1 })), 100);
});

test('procent postępu', () => {
  assert.equal(getPercent(counter({ progress: 3 })), 30);
  assert.equal(getPercent(counter({ progress: 10 })), 100);
});

/* --- jednorazowe -------------------------------------------------- */

test('odhaczenie ustawia progress=1 i datę, drugie odhaczenie nic nie zmienia', () => {
  const done = completeOneTime(oneTime(), T1);
  assert.equal(done.progress, 1);
  assert.equal(done.unlockedAt, T1.toISOString());
  assert.equal(completeOneTime(done, T2), done);
});

test('completeOneTime ignoruje liczniki', () => {
  const a = counter();
  assert.equal(completeOneTime(a, T1), a);
});

/* --- reset -------------------------------------------------------- */

test('reset zeruje postęp i datę; nic nie robi, gdy już zero', () => {
  const unlocked = incrementProgress(counter({ progress: 9 }), 1, T1);
  const reset = resetProgress(unlocked);
  assert.equal(reset.progress, 0);
  assert.equal(reset.unlockedAt, null);
  assert.equal(resetProgress(reset), reset);
});

test('po resecie nowe odblokowanie dostaje nową datę', () => {
  const unlocked = incrementProgress(counter({ progress: 9 }), 1, T1);
  const again = incrementProgress(resetProgress(unlocked), 10, T2);
  assert.equal(again.unlockedAt, T2.toISOString());
});

/* --- listy -------------------------------------------------------- */

test('updateById zmienia tylko wskazany element', () => {
  const list = [counter({ id: 'x' }), counter({ id: 'y' })];
  const next = updateById(list, 'y', (a) => incrementProgress(a, 1, T1));
  assert.equal(next[0], list[0]);
  assert.equal(next[1].progress, 1);
  assert.equal(list[1].progress, 0);
});

test('updateById zwraca tę samą tablicę, gdy nic się nie zmieniło', () => {
  const list = [oneTime({ id: 'x' })];
  assert.equal(updateById(list, 'x', (a) => incrementProgress(a)), list);
  assert.equal(updateById(list, 'brak', (a) => a), list);
});

test('filtrowanie i liczniki statusów', () => {
  const list = [
    counter({ id: '1' }),
    oneTime({ id: '2', progress: 1, unlockedAt: T1.toISOString() }),
    counter({ id: '3', progress: 4 }),
  ];
  assert.deepEqual(
    filterByStatus(list, STATUS.IN_PROGRESS).map((a) => a.id),
    ['1', '3'],
  );
  assert.deepEqual(
    filterByStatus(list, STATUS.UNLOCKED).map((a) => a.id),
    ['2'],
  );
  assert.equal(filterByStatus(list, STATUS.ALL), list);
  assert.deepEqual(countByStatus(list), { all: 3, inProgress: 2, unlocked: 1 });
});

/* --- profil ------------------------------------------------------- */

const games = [
  { id: 'g1', name: 'Rocket League', cover: '/c1.jpg' },
  { id: 'g2', name: 'Celeste', cover: '/c2.jpg' },
];

test('% ukończenia per gra, z sortowaniem i fallbackiem dla nieznanej gry', () => {
  const list = [
    oneTime({ id: '1', gameId: 'g1', progress: 1, unlockedAt: T1.toISOString() }),
    counter({ id: '2', gameId: 'g1' }),
    oneTime({ id: '3', gameId: 'g2', progress: 1, unlockedAt: T2.toISOString() }),
    counter({ id: '4', gameId: 'g404' }),
  ];
  const result = completionByGame(list, games);

  assert.deepEqual(
    result.map((r) => [r.gameId, r.percent]),
    [
      ['g2', 100],
      ['g1', 50],
      ['g404', 0],
    ],
  );
  assert.equal(result[1].name, 'Rocket League');
  assert.equal(result[1].total, 2);
  assert.equal(result[1].unlocked, 1);
  assert.match(result[2].name, /Nieznana gra/);
  assert.equal(result[2].cover, null);
});

test('gameId liczbowy w osiągnięciu pasuje do id tekstowego w games.json', () => {
  const list = [oneTime({ gameId: 1 })];
  const result = completionByGame(list, [{ id: '1', name: 'Gra jeden' }]);
  assert.equal(result[0].name, 'Gra jeden');
});

test('puste dane nie dzielą przez zero', () => {
  assert.deepEqual(completionByGame([], games), []);
  assert.deepEqual(overallStats([]), { total: 0, unlocked: 0, percent: 0 });
});

test('statystyki ogółem', () => {
  const list = [
    oneTime({ id: '1', progress: 1, unlockedAt: T1.toISOString() }),
    counter({ id: '2' }),
    counter({ id: '3' }),
    counter({ id: '4' }),
  ];
  assert.deepEqual(overallStats(list), { total: 4, unlocked: 1, percent: 25 });
});

test('ostatnio zdobyte: od najnowszych, bez niezdobytych, z limitem', () => {
  const list = [
    oneTime({ id: 'old', progress: 1, unlockedAt: T1.toISOString() }),
    counter({ id: 'pending' }),
    oneTime({ id: 'new', progress: 1, unlockedAt: T3.toISOString() }),
    oneTime({ id: 'mid', progress: 1, unlockedAt: T2.toISOString() }),
  ];
  assert.deepEqual(
    recentlyUnlocked(list, 2).map((a) => a.id),
    ['new', 'mid'],
  );
  assert.deepEqual(
    recentlyUnlocked(list).map((a) => a.id),
    ['new', 'mid', 'old'],
  );
  // oryginalna kolejność listy bez zmian
  assert.equal(list[0].id, 'old');
});
