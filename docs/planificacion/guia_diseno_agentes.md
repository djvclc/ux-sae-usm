# Guía de diseño de los agentes del proyecto

**Fecha:** 2026-09-24 · **Alcance:** los subagentes de Claude Code definidos en `.claude/agents/` (`code-agent`, `writing-agent`, `bitacora-agent`) y cualquier agente que se agregue.

**Propósito:** dejar registrado qué se investigó sobre cómo diseñar agentes eficientes, qué principios se adoptaron para este repo y cómo se revisa si un agente cumple con ellos. Es la referencia para crear un agente nuevo o corregir uno existente.

---

## 1. Qué se investigó

| # | Fuente | Qué aporta |
|---|---|---|
| F1 | [Subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents) | Formato oficial de un subagente: campos del frontmatter, cómo se usa la `description` para delegar, aislamiento de contexto y memoria persistente |
| F2 | [Building effective agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents) | Patrones de flujo: encadenamiento de pasos (*prompt chaining*), evaluador-optimizador y orquestador-trabajadores |
| F3 | [Best practices for Claude Code subagents — PubNub](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/) | Escribir la definición como descripción de cargo, una sola responsabilidad, definición explícita de "terminado" |
| F4 | [CiteCheck (arXiv)](https://arxiv.org/html/2605.27700v1) y [WAC Clearinghouse — hallucinated references](https://wacclearinghouse.org/repository/collections/continuing-experiments/august-2025/ai-literacy/understanding-avoiding-hallucinated-references/) | Los modelos generan referencias verosímiles pero falsas (autor, año o título alterados, o artículos inexistentes); la defensa es verificar cada cita contra una fuente real |
| F5 | Experiencia propia del repo (2026-09-24) | Qué falló en la práctica con el `writing-agent` anterior (ver sec. 6) |

Algunas fuentes (p. ej. guías de flujo con LLM para memorias en Typst, arXiv directo) quedaron bloqueadas por el proxy de red de la sesión; lo que se registra aquí viene solo de las fuentes efectivamente leídas.

---

## 2. Hallazgos

### 2.1 Sobre la definición del agente (F1, F3)

- **El cuerpo del archivo es el *system prompt* del agente.** Se escribe como descripción de cargo, no como conversación: el rol en 1–3 frases al inicio y sin trasfondo innecesario.
- **Una sola responsabilidad por agente.** Los agentes especializados son más predecibles que uno que hace de todo.
- **Instrucciones concretas:** qué hacer, qué *no* hacer y qué ignorar.
- **Formato de salida explícito.** El agente principal recibe solo el resultado final del subagente, así que la forma de ese resultado importa.
- **`description` corta y con disparador.** Claude decide a quién delegar leyendo la `description`, así que debe decir *cuándo* usar el agente ("Usar para…", "Usar cuando…"), idealmente en menos de ~150 caracteres. Las `description` de todos los agentes suman al contexto de cada sesión.
- **Herramientas mínimas:** solo las que el agente necesita (campo `tools`).
- **Aislamiento de contexto.** Un subagente parte de cero: recibe su propia definición, el mensaje de la tarea, los `CLAUDE.md` y una foto del estado de git. **No** ve la conversación del agente principal. Todo lo que necesite saber tiene que estar en su definición, en un archivo que se le indique leer o en el mensaje de la tarea.
- **Memoria persistente opcional** (`memory: project` → `.claude/agent-memory/<nombre>/MEMORY.md`, se carga en cada invocación). Sirve para que el agente acumule aprendizajes entre sesiones.
- Otros campos disponibles: `model`, `permissionMode`, `skills`, `maxTurns`, `isolation: worktree`, `omitClaudeMd`.

### 2.2 Sobre el flujo de trabajo (F2)

- **Encadenar pasos** cuando la tarea se descompone en etapas fijas. El ejemplo que da Anthropic es justamente de escritura: esquema → comprobar que el esquema cumple criterios → escribir el documento a partir del esquema. Cada paso es más simple y el resultado, más preciso.
- **Evaluador-optimizador** cuando hay criterios de evaluación claros y la iteración mejora el resultado de forma medible. Aplicado a un solo agente: redactar, evaluar contra una lista fija, corregir y repetir.
- **Orquestador-trabajadores** solo cuando las subtareas no se pueden prever. No es el caso de ninguno de los agentes de este repo.

### 2.3 Sobre la escritura académica con LLM (F4)

- El riesgo más documentado son las **citas inventadas o alteradas**, que el modelo produce con apariencia legítima.
- La mitigación eficaz es **anclar cada afirmación a una fuente recuperable** y verificarla después, no "tener cuidado" al escribir.

---

## 3. Principios adoptados para los agentes de este repo

| # | Principio | Cómo se aplica |
|---|---|---|
| P1 | **Reglas estables en la definición; estado vivo fuera de ella.** | La definición no lleva cifras ni estados que cambian con el proyecto. Van en un archivo de estado que el agente lee al empezar y actualiza al terminar (sec. 4). |
| P2 | **Una responsabilidad y un territorio.** | Cada agente escribe en una sola carpeta o archivo; el resto lo lee (tabla de territorios de `CLAUDE.md`). |
| P3 | **`description` = cuándo usarlo.** | Corta, con "Usar para…" y con lo que *no* hace. |
| P4 | **Flujo en pasos fijos.** | Ubicar → juntar fuentes → hacer → autoevaluar → verificar → cerrar. |
| P5 | **Autoevaluación con lista de chequeo.** | Criterios explícitos, verificables y propios del dominio del agente. |
| P6 | **Verificación automática antes de declarar terminado.** | Cada agente tiene un comando que falla si algo está mal (`npm run lint/build/test`, `verificar_memoria.py`, `latexmk`). Nunca se afirma que algo pasa sin haberlo corrido. |
| P7 | **Nada sin fuente.** | Toda cifra o afirmación se rastrea a `docs/`, al código, a los tests o al `.bib`; si falta la fuente, queda como pendiente declarado. |
| P8 | **Salida corta y estructurada.** | Lista fija: qué cambió, resultado real de la verificación, pendientes y decisiones que le tocan al autor. Sin pegar el contenido producido. |
| P9 | **Nada de números escritos a mano que se puedan derivar.** | En LaTeX, `\label`/`\ref`; en el código, constantes y tests. Aplica a cualquier referencia que pueda desfasarse. |
| P10 | **Las decisiones del autor no las toma el agente.** | Se listan como ❓ en el archivo de estado y el agente trabaja alrededor de ellas. |

---

## 4. Dónde vive el estado de cada agente

| Agente | Definición (reglas estables) | Estado vivo (lo lee primero y lo actualiza al cerrar) | Verificación |
|---|---|---|---|
| `writing-agent` | `.claude/agents/writing-agent.md` | `proyecto-tesis/PLAN_REDACCION.md` | `python3 scripts/verificar_memoria.py` + `latexmk main.tex` |
| `code-agent` | `.claude/agents/code-agent.md` | `docs/CONTEXTO_CLAUDE_CODE.md` + `CLAUDE.md` "Estado del proyecto" | `npm run lint` + `npm run build` + `npm test` |
| `bitacora-agent` | `.claude/agents/bitacora-agent.md` | `docs/planificacion/bitacora_flujo_postulacion_y_resultado.md` (es a la vez su entregable y su estado) | re-correr lint/build/test antes de marcar ✅ |

**Por qué un archivo del repo y no `memory: project`:** el archivo de estado es visible para el autor, se versiona con git junto al trabajo que describe y sirve también a quien trabaje sin el agente. `memory: project` sigue siendo una opción para aprendizajes de estilo que no calzan en el archivo de estado; hoy no se usa.

---

## 5. Plantilla para un agente nuevo

```markdown
---
name: <nombre-en-minusculas>
description: <Qué hace en una frase>. Usar para <disparadores concretos>. No toca <territorio ajeno>.
tools: <solo las necesarias>
---

Eres <rol en 1–2 frases: qué produce y dónde>.

## Tu estado vive en `<ruta al archivo de estado>`
Léelo primero. Si contradice a esta definición, manda el archivo de estado; si contradice
al código o a docs/, mandan ellos (corrige el estado).

## Reglas no negociables
1. <no inventar / fuente obligatoria>
2. <territorio: dónde escribe y qué solo lee>
3. <lo que no decide: decisiones del autor>

## Flujo
1. Ubicar  2. Fuentes  3. Hacer  4. Autoevaluar (lista)  5. Verificar (comandos)  6. Cerrar (actualizar estado)

## Salida al terminar
Lista fija de 4–5 puntos. Sin pegar el contenido producido.
```

---

## 6. Lección aprendida: el `writing-agent` anterior (2026-09-24)

Antes del rediseño, la definición del `writing-agent` tenía 934 palabras, la mitad de ellas estado del proyecto ("Enfoque actual", tabla de estado de capítulos, cifras canónicas). En la práctica pasó esto:

1. **El estado quedó desactualizado.** La definición seguía diciendo "87/87 puntos, 22 categorías" como cifra vigente, cuando desde el 2026-09-08 la cifra correcta es "98 aplicables, la totalidad abordada a nivel de código". También marcaba como pendientes la reescritura del simulador y la corrección del caso sin SEP en el Cap. 3, que ya estaban hechas. Un agente que obedece su definición habría reintroducido la cifra errónea. → **P1.**
2. **Las referencias escritas a mano ocultaron un error estructural.** El Resumen era `\chapter` numerado, así que todo el PDF quedaba corrido en un capítulo (Metodología salía como Cap. 4 y la validación como Sección 4.4), mientras el texto decía "Capítulo 3" y "Sección 3.5". Como las referencias estaban escritas a mano, la compilación no avisaba nada. → **P6, P9.**
3. **No había cómo verificar sin LaTeX.** El entorno no tenía LaTeX, así que "compila" quedaba siempre como pendiente. Se agregó un verificador estático y se documentó cómo instalar TeX Live. → **P6.**

---

## 7. Lista de chequeo para revisar un agente

- [ ] La `description` dice cuándo usarlo y qué no toca, en ~1–2 frases.
- [ ] El rol está en las primeras 1–3 frases.
- [ ] No hay cifras, conteos ni estados de avance en la definición (van al archivo de estado).
- [ ] Declara su archivo de estado y la regla de precedencia (estado > definición; código/docs > estado).
- [ ] Territorio explícito: dónde escribe y qué solo lee.
- [ ] Flujo en pasos, con un paso de autoevaluación con criterios concretos.
- [ ] Comandos de verificación reales, con la regla "no afirmar lo que no se corrió".
- [ ] Formato de salida fijo.
- [ ] `tools` mínimas.
- [ ] Lo que corresponde decidir al autor queda fuera de lo que el agente resuelve.

---

## 8. Estado de los agentes frente a esta guía (auditoría 2026-09-24)

| Agente | Cumple | Desviaciones encontradas |
|---|---|---|
| `writing-agent` | ✅ Rediseñado el 2026-09-24 según esta guía | — |
| `code-agent` | 🟡 Parcial | (a) Tiene estado dentro de la definición y está desactualizado: dice "100 % (87/87 aplicables, 22 categorías)" y "conteo X/87" (vigente: 98 aplicables, sin porcentaje agregado) y "14 tests" (hoy son 16). (b) El paso 3 del flujo valida solo con lint + build y omite `npm test`, que sí aparece en su sección de validación. (c) La `description` no tiene un disparador "Usar cuando…" explícito (aceptable: dice "Usar para cualquier tarea de código"). (d) Sin lista de autoevaluación ni formato de salida fijo más allá de "Resume:". |
| `bitacora-agent` | 🟡 Parcial | (a) Dice "14 tests" (hoy son 16). (b) Por lo demás cumple: un solo entregable, fuentes verificadas contra `investigacion_ux_guide_ai_systems.md`, regla de no marcar ✅ sin correr los comandos y cierre con resumen fijo. |

**Recomendación:** aplicar P1 a `code-agent` y `bitacora-agent`, sacando cifras y conteos de la definición y apuntando a `CLAUDE.md` / `CONTEXTO_CLAUDE_CODE.md` / `plan_mejora_sae.md` como fuente. Corregir el flujo de `code-agent` para que incluya `npm test`. Pendiente de aprobación del autor.

---

## 9. Mantención de esta guía

- Cuando se cree, rediseñe o audite un agente, actualizar la sec. 8 con la fecha.
- Si se adopta una práctica nueva (p. ej. `memory: project`, `maxTurns`, un verificador nuevo), agregarla a la sec. 3 o 4 con la fuente que la respalda.
- Registrar solo lo efectivamente aplicado y verificado, igual que en el resto de los archivos de contexto del repo.
