import { useCallback, useEffect, useState } from 'react';
import {
  completeOneTime,
  incrementProgress,
  resetProgress,
  updateById,
} from '../lib/progress';

/**
 * Dostęp do „Moich osiągnięć” (localStorage: myAchievements).
 *
 * UWAGA — rozwiązanie tymczasowe: gdy @dsw56089 wrzuci wspólny Context danych
 * (funkcja 1), wystarczy zamienić ZAWARTOŚĆ tego pliku na odczyt z Contextu.
 * Strony i komponenty modułu używają tylko tego hooka, więc nic poza tym
 * plikiem nie trzeba będzie zmieniać.
 */

export const STORAGE_KEY = 'myAchievements';

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(items) {
  try {
    const json = JSON.stringify(items);
    if (localStorage.getItem(STORAGE_KEY) !== json) {
      localStorage.setItem(STORAGE_KEY, json);
    }
  } catch {
    // pełny lub zablokowany localStorage — aplikacja działa dalej w pamięci
  }
}

export function useMyAchievements() {
  const [achievements, setAchievements] = useState(readStorage);

  // zapis po każdej zmianie
  useEffect(() => {
    writeStorage(achievements);
  }, [achievements]);

  // synchronizacja między kartami przeglądarki
  useEffect(() => {
    function onStorage(event) {
      if (event.key === STORAGE_KEY) setAchievements(readStorage());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const increment = useCallback(
    (id) =>
      setAchievements((list) =>
        updateById(list, id, (a) => incrementProgress(a)),
      ),
    [],
  );

  const complete = useCallback(
    (id) =>
      setAchievements((list) =>
        updateById(list, id, (a) => completeOneTime(a)),
      ),
    [],
  );

  const reset = useCallback(
    (id) => setAchievements((list) => updateById(list, id, resetProgress)),
    [],
  );

  return { achievements, setAchievements, increment, complete, reset };
}
