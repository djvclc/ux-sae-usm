# sae-react — Prototipo de mejora UX del SAE

Aplicación React que prototipa una mejora de experiencia de usuario del Sistema de Admisión Escolar (SAE) del Mineduc Chile, con foco en transparencia algorítmica, accesibilidad y diseño mobile-first. Fundamentos, plan de mejora y trazabilidad: ver `../CLAUDE.md` y `../docs/`.

## Stack

React 19 · Vite 8 · React Router DOM 7 · Tailwind CSS v4 (config en `src/index.css` con `@theme`, sin `tailwind.config.js`) · shadcn/ui (base-nova) · Chart.js · lucide-react. JavaScript/JSX, sin TypeScript.

## Comandos

```bash
npm install       # primera vez
npm run dev       # servidor de desarrollo
npm run lint      # ESLint (validación obligatoria)
npm run build     # build de producción (validación obligatoria)
```

No hay suite de tests: la validación es lint + build + revisión manual.

## Estructura

- `src/pages/` — una página por ruta (Inicio, Algoritmo, Colegio, Comparador, Postulación, Seguimiento, etc.; internas: Cumplimiento, Roadmap, Notas).
- `src/components/` — Navbar, Footer, ChatAyuda, GuidedTour, SchoolIllustration, TextSizeBar; `ui/` (shadcn).
- `src/data/colegios.js` — catálogo ficticio de 6 colegios; `src/data/incisos.js` — matriz de cumplimiento.
- `src/utils/asignacion.js` — lógica del simulador de asignación (prioridades legales del SAE).
- `src/index.css` — todos los estilos (custom properties, mobile-first 375px).

Los comentarios usan códigos de trazabilidad `S<sección>-<inciso>` que remiten a `../docs/planificacion/plan_mejora_sae.md`.
