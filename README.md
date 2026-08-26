# Turno

Herramienta personal de búsqueda de empleo de Laura Bedoya (UX/UI Designer). Reúne vacantes **reales** de diseño, curadas a mano por Claude (sin conexión automática a portales de empleo — Adzuna no cubre Colombia, y las APIs gratis sin registro como Remotive/Arbeitnow resultaron demasiado pobres en datos), comparadas contra su experiencia real y su stack.

Cuatro pantallas (Inicio, Búsqueda, Detalle de vacante, Mis postulaciones) construidas en React + Tailwind. "Postular" abre la publicación original de cada empresa; el sitio solo lleva el registro local (`localStorage`) de a qué aplicó y en qué estado va cada proceso.

Para agregar vacantes nuevas, pídele a Claude que busque y actualice `src/data/jobs.js`.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router (HashRouter, para servir bien en GitHub Pages)

## Desarrollo

```
npm install
npm run dev
```

## Deploy

```
npm run deploy
```

Publica `dist/` a la rama `gh-pages` vía el paquete [`gh-pages`](https://www.npmjs.com/package/gh-pages).
