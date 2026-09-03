# tests/

Validación automatizada del **flujo de postulación que se prueba con usuarios**
(caso de la familia Muñoz González, `docs/investigacion/caso_estudio_prueba_usabilidad_postulacion.md`).

## Cómo se corre

```bash
npm test
```

Usa el **runner nativo de Node** (`node --test`) — **no** hay Vitest, Jest ni
ninguna dependencia de test (regla de `CLAUDE.md`: no agregar frameworks de test).

## Archivos

| Archivo | Rol |
|---|---|
| `flujo-postulacion.test.js` | Los tests. Ejercita `src/utils/asignacion.js` con `src/data/colegios.js` reproduciendo el `perfilCompleto` que arma `PostulacionPage.jsx`. |
| `setup.mjs` | Registra el hook de resolución (se pasa con `--import`). |
| `resolve-extensionless.mjs` | Hook que completa la extensión de los imports relativos (`../data/colegios` → `.js`), como hace Vite. Solo para los tests; no interviene en `dev`/`build`. |

## Qué cubre

- **Datos del caso:** los 6 colegios, su demanda y su `casoPrioridades`.
- **Paso 1:** `nivelPrioridadEnColegio` con y sin condición SEP (`prioritario`).
- **Paso 2:** probabilidad estimada por colegio para la familia del caso.
- **Paso 3:** resultado de `calcularResultado` con la lista en orden de tabla y
  con "Colegio San Martín" en primer lugar (escenario del **falso riesgo
  estratégico**: ponerlo primero no baja su probabilidad).
- **Regla de asignación:** gana el primer colegio con probabilidad ≥ 65.
- **Núcleo protegido:** la tabla `probAsignacion` y sus valores no cambiaron.

## Si un test falla

Los tests describen el comportamiento esperado del caso de estudio y del núcleo
protegido (`asignacion.js`). Un fallo casi siempre significa que un cambio de
código movió una probabilidad, un nivel de prioridad o el umbral 65 — revisar
antes de "arreglar el test".
