# Achievement Hub

Aplikacja frontendowa oparta o React, Vite i React Router. Dane demonstracyjne są przechowywane lokalnie, a stan zdobytych i pobranych osiągnięć zapisuje się w `localStorage`.

## Skład zespołu

Rafał Polański | numer albumu: 56089 | login GitHub: dsw56089
Igor Białkowski | numer albumu: 55974 | login GitHub: IgiBial
Aleksandra Gottfried | numer albumu: 56003 | login GitHub: alexander-spruce
Krzysztof Glazna | numer albumu: 45318  | login Github: Dsw45318

## Uruchomienie

Wymagany Node.js 18+.

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem pokazanym przez Vite (domyślnie http://localhost:5173).

## Build produkcyjny

```bash
npm run build
npm run preview
```

## Struktura

- `src/App.jsx` — routing.
- `src/components/Layout.jsx` — wspólny layout i nawigacja.
- `src/context/AppContext.jsx` — wspólny stan aplikacji i zapis lokalny.
- `src/data/mockData.js` — przykładowe gry i osiągnięcia.
- `src/pages/Games.jsx` — katalog gier z wyszukiwaniem i filtrowaniem.
- `src/pages/GameDetails.jsx` — szczegóły gry, progres i osiągnięcia.
- `src/pages/Discover.jsx` — przegląd osiągnięć społeczności.

## Ważne

Przyciski oznaczania osiągnięć i pobierania działają na danych mockowych. „Pobranie” oznacza dodanie osiągnięcia do lokalnej kolekcji — integracja z platformami gier i rzeczywiste pliki do pobrania nie są jeszcze podłączone.


## Przypięte osiągnięcia
Na stronie gry użyj przycisku „Przypnij” przy wybranym osiągnięciu. Wszystkie przypięte pozycje znajdziesz w zakładce „Przypięte”. Z tej listy możesz je oznaczać jako zdobyte lub odpinać. Dane są zapisywane lokalnie w przeglądarce. Wcześniej zapisane pozycje z kolekcji „Pobrane” zostaną przeniesione do „Przypiętych” przy pierwszym odczycie danych.

## Trasy

`/gry`, `/gry/:id`, `/odkrywaj`, `/przypiete`, `/moje` (progres), `/profil`, `/nowe` (kreator), `/edytuj/:id`.

## Testy

`npm test` — testy logiki modułu Progres (`src/modules/progres/lib`).
