# Turno

Portal de empleos operativos y de servicio (logística, retail, salud, atención a cliente) con match personalizado por **turno**, **tiempo de traslado** y **certificaciones/requisitos** — en vez de ordenar vacantes por relevancia textual o presupuesto de publicidad.

Prototipo de producto: cuatro pantallas (Inicio, Búsqueda, Detalle de vacante, Mis postulaciones) construidas en React + Tailwind, con estado de postulaciones/guardados persistido en `localStorage`.

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
