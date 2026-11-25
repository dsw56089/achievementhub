import { useEffect, useMemo, useState } from 'react';
import { indexGamesById } from '../lib/progress';

/**
 * Lista gier z public/data/games.json (id, name, cover).
 *
 * Rozwiązanie tymczasowe, tak jak useMyAchievements: gdy wspólny Context
 * (funkcja 1) będzie już udostępniał gry, podmień zawartość tego pliku.
 */
export function useGames() {
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}data/games.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        setGames(Array.isArray(data) ? data : []);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const gamesById = useMemo(() => indexGamesById(games), [games]);

  return { games, gamesById, status };
}
