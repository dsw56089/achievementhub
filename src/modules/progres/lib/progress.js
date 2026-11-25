/**
 * Logika modułu „Progres” (funkcje 5 i 6).
 *
 * Wszystkie funkcje są CZYSTE: nie mutują argumentów, a gdy nic się nie zmienia,
 * zwracają ten sam obiekt / tę samą tablicę (React nie robi wtedy zbędnego renderu).
 *
 * Kształt osiągnięcia (wspólny dla całej aplikacji):
 * {
 *   id: string,
 *   gameId: string,
 *   title: string,
 *   description?: string,
 *   type: "licznik" | "jednorazowe",
 *   target: number,          // licznik: >= 1, jednorazowe: 1
 *   progress: number,        // 0..target
 *   unlockedAt: string|null  // ISO 8601, ustawiane dokładnie raz
 * }
 */

export const TYPE = Object.freeze({
  COUNTER: 'licznik',
  ONE_TIME: 'jednorazowe',
});

export const STATUS = Object.freeze({
  ALL: 'wszystkie',
  IN_PROGRESS: 'w-toku',
  UNLOCKED: 'zdobyte',
});

/* ------------------------------------------------------------------ */
/* Pojedyncze osiągnięcie                                              */
/* ------------------------------------------------------------------ */

export function isUnlocked(achievement) {
  return Boolean(achievement.unlockedAt);
}

/** Cel: dla jednorazowych zawsze 1, dla licznika liczba całkowita >= 1. */
export function getTarget(achievement) {
  if (achievement.type === TYPE.ONE_TIME) return 1;
  const target = Math.floor(Number(achievement.target));
  return Number.isFinite(target) && target >= 1 ? target : 1;
}

/** Postęp przycięty do przedziału 0..target (odporny na śmieciowe dane). */
export function getProgress(achievement) {
  const progress = Math.floor(Number(achievement.progress));
  if (!Number.isFinite(progress) || progress < 0) return 0;
  return Math.min(progress, getTarget(achievement));
}

/** Procent 0–100 (zaokrąglony). */
export function getPercent(achievement) {
  return Math.round((getProgress(achievement) / getTarget(achievement)) * 100);
}

function toIso(now) {
  return (now instanceof Date ? now : new Date(now)).toISOString();
}

/**
 * „+1” przy osiągnięciu licznikowym.
 * - nie wychodzi poza target,
 * - ustawia unlockedAt tylko w momencie osiągnięcia celu,
 * - zdobytego osiągnięcia już nie rusza (unlockedAt zostaje z pierwszego razu).
 */
export function incrementProgress(achievement, step = 1, now = new Date()) {
  if (achievement.type !== TYPE.COUNTER || isUnlocked(achievement)) {
    return achievement;
  }
  const delta = Math.floor(step);
  if (!Number.isFinite(delta) || delta < 1) return achievement;

  const target = getTarget(achievement);
  const progress = Math.min(target, getProgress(achievement) + delta);

  return {
    ...achievement,
    progress,
    unlockedAt: progress >= target ? toIso(now) : null,
  };
}

/** Odhaczenie osiągnięcia jednorazowego. */
export function completeOneTime(achievement, now = new Date()) {
  if (achievement.type !== TYPE.ONE_TIME || isUnlocked(achievement)) {
    return achievement;
  }
  return { ...achievement, progress: 1, unlockedAt: toIso(now) };
}

/** Jawne wycofanie postępu (np. przycisk „Cofnij” po pomyłce). */
export function resetProgress(achievement) {
  if (getProgress(achievement) === 0 && !isUnlocked(achievement)) {
    return achievement;
  }
  return { ...achievement, progress: 0, unlockedAt: null };
}

/* ------------------------------------------------------------------ */
/* Listy: aktualizacja i filtrowanie                                   */
/* ------------------------------------------------------------------ */

/** Podmienia jeden element po id. Zwraca tę samą tablicę, jeśli nic się nie zmieniło. */
export function updateById(list, id, updater) {
  let changed = false;
  const next = list.map((item) => {
    if (item.id !== id) return item;
    const updated = updater(item);
    if (updated !== item) changed = true;
    return updated;
  });
  return changed ? next : list;
}

export function filterByStatus(list, status) {
  switch (status) {
    case STATUS.UNLOCKED:
      return list.filter(isUnlocked);
    case STATUS.IN_PROGRESS:
      return list.filter((a) => !isUnlocked(a));
    default:
      return list;
  }
}

export function countByStatus(list) {
  const unlocked = list.filter(isUnlocked).length;
  return { all: list.length, inProgress: list.length - unlocked, unlocked };
}

/* ------------------------------------------------------------------ */
/* Profil (funkcja 6)                                                  */
/* ------------------------------------------------------------------ */

export function indexGamesById(games) {
  return Object.fromEntries(games.map((game) => [String(game.id), game]));
}

/** Nazwa gry do wyświetlenia; fallback, gdy gry nie ma w games.json. */
export function gameLabel(gamesById, gameId) {
  return gamesById[String(gameId)]?.name ?? `Nieznana gra (${gameId})`;
}

function percentOf(part, total) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

/** Ogółem: ile osiągnięć zdobyto z wszystkich posiadanych. */
export function overallStats(achievements) {
  const { all, unlocked } = countByStatus(achievements);
  return { total: all, unlocked, percent: percentOf(unlocked, all) };
}

/**
 * % ukończenia per gra = zdobyte / wszystkie posiadane osiągnięcia danej gry.
 * Zwraca tylko gry, w których użytkownik ma co najmniej jedno osiągnięcie.
 * Sortowanie: najwyższy % na górze, potem alfabetycznie.
 */
export function completionByGame(achievements, games) {
  const gamesById = indexGamesById(games);
  const groups = new Map();

  for (const achievement of achievements) {
    const key = String(achievement.gameId);
    const group = groups.get(key) ?? { total: 0, unlocked: 0 };
    group.total += 1;
    if (isUnlocked(achievement)) group.unlocked += 1;
    groups.set(key, group);
  }

  return [...groups.entries()]
    .map(([gameId, { total, unlocked }]) => ({
      gameId,
      name: gameLabel(gamesById, gameId),
      cover: gamesById[gameId]?.cover ?? null,
      total,
      unlocked,
      percent: percentOf(unlocked, total),
    }))
    .sort((a, b) => b.percent - a.percent || a.name.localeCompare(b.name, 'pl'));
}

/** Ostatnio zdobyte, od najnowszych. */
export function recentlyUnlocked(achievements, limit = 5) {
  return achievements
    .filter(isUnlocked)
    .slice()
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, limit);
}
