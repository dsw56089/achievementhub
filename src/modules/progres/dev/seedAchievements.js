/**
 * Dane przykładowe tylko do testowania lokalnie (przycisk widoczny wyłącznie
 * w trybie dev, gdy lista jest pusta). Dopóki kreator (funkcja 3) nie działa,
 * to najprostszy sposób, żeby zobaczyć /moje i /profil.
 *
 * gameId musi pasować do id w public/data/games.json — jeśli Twój mock ma
 * inne id, popraw je tutaj (albo użyj dev/games.sample.json).
 */
export const SEED_ACHIEVEMENTS = [
  {
    id: 'seed-1',
    gameId: 'g1',
    title: 'Wygraj 10 meczów',
    description: 'Zwycięstwa w trybie rankingowym.',
    type: 'licznik',
    target: 10,
    progress: 3,
    unlockedAt: null,
  },
  {
    id: 'seed-2',
    gameId: 'g1',
    title: 'Ukończ samouczek',
    description: '',
    type: 'jednorazowe',
    target: 1,
    progress: 1,
    unlockedAt: '2026-11-20T10:00:00.000Z',
  },
  {
    id: 'seed-3',
    gameId: 'g2',
    title: 'Zbierz 5 truskawek',
    description: '',
    type: 'licznik',
    target: 5,
    progress: 5,
    unlockedAt: '2026-11-22T18:30:00.000Z',
  },
  {
    id: 'seed-4',
    gameId: 'g2',
    title: 'Pokonaj bossa bez śmierci',
    description: '',
    type: 'jednorazowe',
    target: 1,
    progress: 0,
    unlockedAt: null,
  },
];
