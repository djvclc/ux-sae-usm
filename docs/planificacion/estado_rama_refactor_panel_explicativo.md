# Estado de la rama `refactor/panel-explicativo`

> Documento de traspaso para retomar el trabajo desde otro computador (o en una
> sesión nueva de Claude Code) **sin re-explorar el repo**. Actualizado al
> **2026-10-08**. Detalle técnico de cada cambio en `docs/CONTEXTO_CLAUDE_CODE.md`
> §66–§92; estado general del proyecto en `CLAUDE.md` → "Estado del proyecto".
>
> Ojo: la memoria local de Claude Code (`~/.claude/…`) **no viaja con el repo**.
> El contexto que sí viaja es: `CLAUDE.md`, `docs/CONTEXTO_CLAUDE_CODE.md`, este
> archivo y los agentes en `.claude/agents/`.

## 1. Qué es esta rama

Refactor de layout pedido en la reunión con la profesora guía del **2026-10-01**:
en `/postulacion` y `/seguimiento`, a la izquierda el **flujo** y a la derecha un
**panel "Te explicamos"** que explica el momento en que está la familia (p. ej.,
con la lista armada: qué implica el orden de los colegios).

- **Base:** `main` en el commit `d281078`, etiquetado **`pre-refactor-panel`**
  (versión de respaldo anterior al refactor).
- **Estado:** todos los cambios están commiteados y subidos a
  `origin/refactor/panel-explicativo`. **Aún no está integrada a `main`** — la
  integración queda pendiente de la aprobación del autor/profesora.
- **Validación del último commit de código:** `npm run lint` (0/0),
  `npm run build` OK, `npm test` 16/16. Verificado en navegador (condiciones A y B).

### Volver a la versión anterior al refactor

```bash
git checkout pre-refactor-panel
```

## 2. Cómo levantar el proyecto en otro computador

```bash
git clone https://github.com/djvclc/ux-sae-usm.git
```

```bash
cd ux-sae-usm
```

```bash
git checkout refactor/panel-explicativo
```

```bash
cd sae-react
```

```bash
npm install
```

```bash
npm run dev
```

Se abre en `http://localhost:5173`. Usado en desarrollo con **Node v24.19.0 /
npm 11.17.0**. En Claude Code (app de escritorio) el servidor se levanta con la
configuración `.claude/launch.json` (nombre `sae-react`).

Validación antes de commitear: `npm run lint`, `npm run build` y `npm test`
(runner nativo de Node, sin dependencias de test).

Para la prueba de usabilidad: en `/postulacion` → "Herramientas de la prueba de
usabilidad" están "Cargar familia Muñoz González", "Limpiar y empezar de cero" y
el interruptor **A · Con explicaciones / B · Sin explicaciones**.

## 3. Cómo quedó la interfaz (resumen)

**Arquitectura del panel** — `sae-react/src/components/PanelExplicativo.jsx`:
- `LayoutConPanel`: grilla flujo (≈58 %) | panel (≈42 %, mín. 380 px), página
  hasta 1600 px. En la **condición B no hay panel** y el flujo ocupa todo el ancho.
- `PanelExplicativo`: encabezado "TE EXPLICAMOS" + título del momento. **Un solo
  scroll** en toda la página (pedido de la profesora, 2026-10-07): el panel no
  tiene scroll propio; queda fijo bajo el menú **solo si cabe en pantalla**, si
  no, se desplaza con la página.
- `PanelSeccion`: secciones numeradas (1, 2, 3…; las alertas llevan "!"),
  recuadros destacados (`tono="principal"` azul / `"alerta"` naranja), resaltador
  en las frases en negrita. Sin emojis.

**Regla de reparto:** las **explicaciones** van al panel; los **avisos del SAE
real** (perder el cupo actual, lista corta, comprobante, reenvío) van en el flujo.
Excepción decidida por el autor: el aviso "Postula solo si necesitas cambiar de
colegio" va primero en el panel "Antes de empezar" (en B, dentro del flujo).

**Momentos del panel en `/postulacion`** (`momento` en `PostulacionPage.jsx`):

| Momento | Título | Contenido |
|---|---|---|
| `ingreso` | Antes de empezar | Aviso "Postula solo si…" (alerta) · ¿Por qué ingresar con ClaveÚnica? |
| `familia` | Elegir a quién postular | Quien no postula, no cambia de colegio · ¿En bloque o por separado? (4 pasos + "Ten en cuenta") |
| `datos` | Revisar los datos | (pantalla de corrección) de dónde salen los datos, nivel, domicilio |
| `agregar` | Armar tu lista | ¿Cuántos colegios? · El orden importa · ¿Cómo se decide tu resultado? (prioridades en desplegable) |
| `lista` | Tu lista y su orden | **¿Qué hace el orden de tu lista?** (en vivo) · qué significa el % · conteo hacia 6 · prioridades |
| `revisar` | Antes de enviar | Al enviar · ¿Qué pasa después de enviar? |
| `enviado` | Después de enviar | ¿Qué hacer ahora? · Próximas fechas |

`/seguimiento`: panel "Tu resultado, explicado" (¿Por qué te asignaron este
colegio? con tabla + explicación + paso a paso · ¿Qué significa no quedar en tu
primera opción? · Qué sigue ahora).

**Otros cambios de la rama** (detalle en `CONTEXTO_CLAUDE_CODE.md`):
- Menú superior: 7 enlaces (6 en B). "Calendario" se fusionó con "El proceso"
  (`/calendario` redirige a `/proceso`); "Comparar" salió del menú y se abre
  desde el buscador y la ficha (`/comparador?con=<id>` preselecciona); "Mi
  postulación" y "Mis datos" agrupados a la derecha; página activa subrayada (§83).
- Botón "Postular" del menú reinicia el flujo (§67). "← Atrás" del paso 2 y
  "Editar" del paso 3 vuelven a "Tu grupo familiar" sin perder la lista (§78).
- Un solo término para avanzar: **"Continuar"** (§68, §77); botón del paso 3 =
  **"Confirmar"** (§80); modal "Confirma tu postulación" rediseñado (§81).
- Se eliminaron: botón Tutorial ON/OFF (§71), "Estás en" redundante (§72; el
  control de tamaño de texto quedó arriba a la izquierda), aviso "Ingresaste con
  ClaveÚnica" (§76), "Cancelar mi postulación" (§88), ejemplo "Colegio A, B y C"
  de "En bloque" (§92).
- Estado de cada hijo/a como etiqueta y no como botón (§69); barra de acciones
  de `/seguimiento` ordenada (§89).
- **No se tocaron** `asignacion.js`, `simulacionSae.js` ni `colegios.js`:
  el caso canónico sigue siendo San Martín 1.º ≈26 % → Los Andes 2.ª ≈99 %, igual
  en A y B.

## 4. Pendientes conocidos

1. **Integrar la rama a `main`** cuando se apruebe (no hay conflictos: `main` no
   avanzó desde la base). `main` local tenía 5 commits sin subir a GitHub antes
   del refactor; al integrar, subir también `main`.
2. **Documentos de la prueba** que todavía describen la interfaz anterior:
   caso de estudio §6 (recuadros que ahora están en el panel), guion v4,
   inventario F3 (`docs/planificacion/f3_modo_control_inventario.md`: "¿Cómo se
   decide tu resultado?" ya no es inicial, §73) y PDF de material. El instrumento
   v7 (`docs/investigacion/instrucciones_prueba_usabilidad.md`) es una propuesta
   pendiente de validar con la profesora.
3. **Bitácora** (`docs/planificacion/bitacora_flujo_postulacion_y_resultado.md`,
   agente `bitacora-agent`) sin las entradas del refactor.
4. **Memoria (Cap. 3)**: actualizar si se describe la interfaz (agente
   `writing-agent`; LaTeX no estaba instalado en el entorno de desarrollo).
5. Ejemplos del modal "?" de cada prioridad (`PRIORIDADES_INFO.*.ejemplo`) citan
   92 % / 28 % / 65 % / 60 %, cifras del simulador anterior al Bloque R; el caso
   actual da 99 % / 26 %.
6. **Móvil (375 px) no se trabajó** en el refactor por decisión del autor; bajo
   ~960 px el panel se apila debajo del flujo.
7. `CalendarioPage.jsx` quedó sin ruta (se conserva el archivo).
8. Los `.tex` 00/01/02 aparecen modificados en algunos equipos solo por fin de
   línea (CRLF/LF); no tienen cambios de contenido.

## 5. Historial de la rama (resumen)

| Fecha | Cambio | CONTEXTO |
|---|---|---|
| 2026-10-02 | Layout flujo + panel; B sin panel; `OrdenListaExplicacion`; `PrioridadModal` único | §66 |
| 2026-10-05 | Espaciado, "Te explicamos", panel más ancho, barra lateral fija, "Continuar", Postular reinicia, sin Tutorial, sin "Estás en", sin emojis, aviso al inicio, menú limpio, modal de envío, atención visual | §66–§87 |
| 2026-10-06 | Sin "Cancelar mi postulación", acciones ordenadas, tabla del panel sin desborde | §88–§90 |
| 2026-10-07 | Un solo scroll (profesora guía) | §91 |
| 2026-10-08 | Sin el ejemplo de "En bloque"; instrumento de la prueba v7 (docs); este documento | §92 |
