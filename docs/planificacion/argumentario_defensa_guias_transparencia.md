# Argumentario para la reunión con la profesora guía

**Fecha:** 2026-09-10
**Para qué sirve:** cada decisión de diseño del prototipo explicada en lenguaje simple, con tres partes:

1. **Lo que te pueden preguntar** — la duda probable de la profesora.
2. **Qué respondés** — el argumento, en frases cortas.
3. **En qué te apoyás** — la fuente y qué dice realmente.
4. **Qué conviene reconocer** — el límite honesto (lo que la fuente *no* prueba). Decirlo suma credibilidad y es lo que justifica hacer el estudio.

---

## Las fuentes, en una línea cada una

- **Microsoft (HAX)** — 18 guías para diseñar sistemas automáticos, publicadas en un congreso científico (CHI 2019) y probadas con 49 diseñadores sobre 20 productos reales.
- **Google (PAIR)** — guía de Google sobre cómo explicar sistemas automáticos y generar una confianza "del tamaño justo".
- **Nielsen Norman Group (NN/g)** — consultora de referencia en usabilidad; recomendaciones sobre cómo redactar avisos y explicaciones.
- **Brookings** — centro de estudios de política pública de EE.UU.; analizó los sistemas de asignación escolar centralizada como el SAE.
- **Comunicación de riesgo** — estudios sobre cómo la gente entiende porcentajes y probabilidades, sobre todo quienes tienen menos manejo de números (Galesic 2009; Visschers 2009).
- **GOV.UK** — el sistema de diseño de los trámites del gobierno británico, hecho con pruebas de usuario, incluidas personas con baja alfabetización digital.
- **Correa et al. 2022** — el paper que describe cómo se diseñó el SAE chileno (revista *Operations Research*).
- **Arteaga et al. 2022** — estudio con datos reales de casi 49.000 familias del SAE chileno de 2020 (revista *Quarterly Journal of Economics*).

---

## Argumento 0 — "¿Por qué usás guías de inteligencia artificial si el algoritmo del SAE no es IA?"

**Lo que te pueden preguntar.** El SAE usa un algoritmo matemático fijo, no aprende ni predice como un modelo de IA. ¿Por qué aplicarle guías pensadas para IA?

**Qué respondés.** Porque el problema de fondo es el mismo: hay un sistema central que toma una decisión importante e irreversible por un año (en qué colegio queda un hijo), la familia no entiende cómo se llegó a ese resultado y no puede comprobarlo por su cuenta. Eso es lo que estas guías ayudan a resolver, más allá de si por dentro hay IA o no.

**En qué te apoyás.** Brookings estudió exactamente estos sistemas de asignación escolar y concluye que, por muy bien hecho que esté el algoritmo, su éxito depende de cómo las personas se relacionan con él.

**Qué conviene reconocer.** En la memoria hay que decirlo con cuidado: "las guías de Microsoft y Google se usaron como criterios de diseño de la interacción, adaptados a un sistema automático de asignación; no se afirma que el algoritmo del SAE sea inteligencia artificial".

---

## Bloque A — Por qué se muestran probabilidades

### Argumento 1 — "¿Por qué le muestran un porcentaje de probabilidad a la familia?"

**Lo que te pueden preguntar.** Mostrar "26 %" puede confundir o asustar. Además el resultado real todavía no existe. ¿Por qué no dejarlo fuera?

**Qué respondés.**
- La familia se hace una idea de sus posibilidades **igual**, con número o sin número. Si no le damos ningún dato, se hace una idea equivocada. El prototipo le da una estimación y, sobre todo, le muestra **con qué está hecha**: cuántas familias postularon el año pasado, cuántas vacantes hay, qué prioridad tiene ella en ese colegio.
- Hay evidencia chilena directa de que las familias **se creen con más chances de las que tienen**. En el estudio de Arteaga con casi 49.000 familias del SAE, en promedio creían tener un 76 % de posibilidades cuando en realidad rondaban el 44 %.
- En ese mismo estudio, **el 35 %** de las familias que no agregaron más colegios dijo que fue porque pensaban que igual quedarían en alguno de los que ya tenían. Mostrarles su riesgo real es lo que corrige esa idea.
- Cuando el SAE real probó mandar avisos personalizados de riesgo, **1 de cada 5 familias** agregó al menos un colegio y con eso bajó bastante su probabilidad de quedar sin ningún cupo.
- Ese mismo estudio muestra algo clave: los avisos **genéricos** ("agregá más colegios") casi no sirvieron. Lo que funcionó fue el aviso **con información concreta** de riesgo. Por eso el prototipo pone el porcentaje **colegio por colegio**, no un cartel general.

**En qué te apoyás.** Arteaga et al. 2022 (datos reales del SAE chileno). Y una guía de Google que dice que el objetivo de mostrar un número no es que la familia confíe ciegamente, sino que entienda hasta dónde creerle: que es una orientación, no una certeza.

**Qué conviene reconocer.**
- El número sale de una simulación por computador con supuestos que están documentados; **no es una probabilidad oficial del SAE**. En la memoria se llama "probabilidad estimada", nunca "confianza del sistema".
- Que mostrarlo como "26 de cada 100" se entienda mejor que "26 %" **en familias chilenas del SAE** todavía no está probado: es justo una de las cosas que mide tu estudio.

### Argumento 2 — "¿Cómo evitan que lo tomen como una promesa?"

**Qué respondés.** El porcentaje nunca aparece solo. Siempre va acompañado de: los datos con que se calculó, y una frase fija y visible que dice "esto es una simulación con datos del año pasado, no es tu resultado; el sistema lo calcula recién en octubre, y muchas familias creen tener más posibilidades de las que después resultan".

**En qué te apoyás.** Una guía de Microsoft dice que, cuando un sistema da una estimación, hay que dejar claro que es una estimación y de qué depende. La frase de advertencia, además, está redactada a partir del hallazgo de Arteaga sobre el exceso de optimismo de las familias.

### Argumento 12 — "¿Por qué también ponen etiquetas como 'Casi segura' o 'Resultado parejo'?"

**Qué respondés.** Porque un número exacto supone que la persona sabe interpretar probabilidades, y no todas lo hacen. Una etiqueta en palabras ayuda a leer el número correctamente. Hace poco corregimos un caso: un 50 % aparecía rotulado como "probabilidad baja", cuando en realidad es un "puede pasar o no". Etiquetarlo de menos empujaba a la familia a descartar ese colegio sin razón.

**En qué te apoyás.** La guía de Google recomienda probar, además del número, categorías en palabras y representaciones visuales.

---

## Bloque B — Por qué el orden de la lista se maneja así

### Argumento 3 — "El recuadro '¿Qué hace el orden de tu lista?' parece un pronóstico. ¿Existe en el SAE real?"

**Qué respondés.**
- No existe en el SAE real: es una ayuda que agregamos nosotros. Por eso **se oculta en el grupo de control** del estudio.
- Su función es mostrarle a la familia, **antes de que reordene la lista**, qué cambia y qué no cambia si mueve un colegio. Lo que cambia: en cuál de sus preferencias podría quedar. Lo que no cambia: la probabilidad de cada colegio por separado.
- Al principio estaba redactado como una predicción confiada ("es muy probable que quedes en X"). Lo reescribimos para que sea una **explicación de la regla**, no un pronóstico: primero explica la regla, y el colegio concreto queda en segundo plano.

**En qué te apoyás.** Una guía de Microsoft dice que, antes de que el usuario haga una acción, conviene mostrarle qué consecuencias tiene esa acción. La reescritura se hizo siguiendo la recomendación de Google de no inflar la confianza y el hallazgo de Arteaga sobre el exceso de optimismo.

### Argumento 4 — "Si un colegio es casi imposible, ¿no deberían avisarle que lo ponga más abajo?"

**Este es el punto central del caso de estudio.**

**Qué respondés.**
- **No.** El algoritmo del SAE está diseñado para que a la familia **siempre le convenga poner primero el colegio que más quiere**, aunque sea difícil entrar. Ponerlo más abajo no le mejora las chances en ningún otro colegio, y sí le puede hacer perder el que prefería.
- Mucha gente cree lo contrario: piensa que si un colegio es difícil, "conviene esconderlo más abajo para no gastar la oportunidad". Esa creencia es un error conocido y documentado en este tipo de sistemas.
- Lo que sí hay que hacer es **agregar colegios de respaldo más abajo en la lista**, sin tocar el que va primero. Eso es lo que el prototipo aconseja.

**En qué te apoyás.**
- El paper de Correa et al. que describe el diseño del SAE, y la teoría del algoritmo (Aceptación Diferida).
- Brookings, que describe este error de las familias como uno de los riesgos principales de estos sistemas.
- Arteaga et al.: cuando las familias chilenas reaccionaron a los avisos de riesgo, casi todas **agregaron** colegios de respaldo hacia abajo; casi ninguna movió su colegio preferido. O sea, el consejo "preferido primero + respaldos abajo" tiene respaldo con datos del propio SAE.

**Qué conviene reconocer (y contarlo como algo positivo).** Al revisar el prototipo con estas guías encontramos una contradicción real en el código: el paso 2 daba el consejo correcto y el paso 3 decía lo contrario ("considerá ponerlo más abajo"). Se detectó y se corrigió. Es un ejemplo de que la revisión con guías sirvió para encontrar un problema concreto.

---

## Bloque C — Por qué se explica el resultado

### Argumento 5 — "¿No basta con mostrarle a la familia el colegio que le tocó?"

**Qué respondés.**
- No, porque el resultado del caso es "no quedaste en tu primera opción". Sin una explicación, eso se lee como arbitrariedad ("me tocó", "es una tómbola").
- La explicación da la razón **real y concreta**: a ese colegio postularon más familias que los cupos que había, y la familia no tenía ahí ninguna prioridad (hermano, funcionario, exalumno) ni la reserva del 15 %. No es una frase genérica.
- El sitio tiene **dos tipos de explicación distintos y a propósito**: una general, de cómo funciona el sistema (la página `/algoritmo`), y una específica, de por qué a *esta* familia le pasó *esto* (la página de resultado). La segunda es la que de verdad despeja la confusión.
- La explicación cierra diciendo lo que el sistema **no puede** hacer: no crea cupos nuevos ni garantiza la primera opción cuando hay más familias que vacantes. Así la molestia de la familia apunta a la falta de cupos, no al algoritmo.

**En qué te apoyás.**
- Una guía de Microsoft: dejar claro por qué el sistema hizo lo que hizo, con la razón real.
- Una guía de Google: separar "cómo funciona el sistema" de "por qué pasó esto en tu caso".
- Brookings: conviene decir explícitamente qué cosas el sistema no puede resolver, para que la frustración no se transforme en desconfianza hacia el algoritmo.
- Correa et al.: los diseñadores del SAE eligieron este algoritmo, entre otras razones, **porque explicarle el resultado a una familia que quedó disconforme es más fácil** con él que con las alternativas. O sea, la explicación no es un agregado nuestro: es una propiedad que los propios diseñadores valoraron y que el prototipo lleva a la pantalla.

**Qué conviene reconocer.** Toda esta explicación existe **solo en el grupo A** del estudio; en el grupo de control solo se ve el colegio asignado. Si sirve o no lo miden las preguntas de comprensión y de justicia del cuestionario.

### Argumento 6 — "¿Por qué tanto cuidado con la palabra 'sorteo'?"

**Qué respondés.** Porque la familia objetivo ya ve el SAE como una "tómbola", y esa es justamente la percepción que el proyecto quiere cambiar. Usamos "sorteo" solo para describir el desempate entre familias que están en igualdad de condiciones, y siempre enmarcado como "todas con las mismas reglas", nunca como "te tocó" o "mala suerte". Tampoco decimos que el sistema "elige" o "decide": decimos que "aplica reglas sobre datos".

**En qué te apoyás.** Guías de Microsoft (que los avisos no suenen a juicio sobre la familia ni refuercen estigmas) y de NN/g (describir el proceso como aplicación de reglas, no como una decisión con voluntad propia).

---

## Bloque D — Por qué el sitio está armado así

### Argumento 7 — "La página `/algoritmo` es larguísima. ¿Sirve de algo?"

**Qué respondés.** Es la explicación general, para quien quiera entender el mecanismo a fondo. El flujo de postulación **no obliga** a leerla: está disponible aparte. Ciudades de EE.UU. con sistemas parecidos usan materiales así (algunas, videos animados); esta es la versión web.

**Qué conviene reconocer.** Que estos materiales **se usen** no significa que esté probado que mejoran la comprensión. Y sí, es mucho texto: la carga de lectura del flujo completo es un tema aparte, con opciones concretas en `docs/planificacion/carga_de_texto_flujo_postulacion.md`.

### Argumento 8 — "En la ficha del colegio, ¿por qué esa cuadrícula de 'X de cada 100'?"

**Qué respondés.** Para mostrar la probabilidad en el momento en que la familia está mirando ese colegio y decidiendo, no en otra pantalla. La cuadrícula (100 figuritas, algunas marcadas) es una forma de mostrar proporciones que se entiende sin saber de porcentajes.

**En qué te apoyás.** Una guía de Microsoft (información relevante en el momento de decidir) y estudios de comunicación de riesgo sobre estas cuadrículas.

**Qué conviene reconocer.** Esos estudios son del área de salud. Sirven para justificar que **probemos** esta forma visual, no para afirmar que funciona en familias del SAE.

### Argumento 9 — "¿Por qué esconden explicaciones detrás de botones y desplegables?"

**Qué respondés.** Para mostrar primero lo justo que la familia necesita para decidir, y dejar el detalle a un clic, para quien lo quiera. Así ninguna pantalla se convierte en una clase de matemáticas.

**En qué te apoyás.** Una guía de Google recomienda exactamente esto: explicaciones parciales y detalle disponible bajo demanda.

### Argumento 10 — "¿Por qué el flujo tiene barra de pasos, revisión antes de enviar y comprobante?"

**Qué respondés.** Son los patrones estándar de los trámites del gobierno británico, que están hechos con pruebas de usuario (incluidas personas con poco manejo digital): mostrar en qué paso vas, poder volver atrás sin perder lo escrito, revisar todo antes de confirmar, y entregar un comprobante con número, con "qué pasa después".

**Qué conviene reconocer.** Circulaba una cifra ("la barra de pasos reduce el abandono 20–25 %") que **no tiene una fuente seria**. No hay que citarla. El patrón en sí sí es buena práctica documentada.

### Argumento 11 — "¿Por qué no guardan la lista a medio hacer entre una visita y otra?"

**Qué respondés.** Guardar el borrador es buena práctica en trámites, y lo sacamos **a propósito**: en el estudio todos los participantes reciben la misma lista fija, y no queremos que quede estado de un participante para el siguiente. Es una exclusión decidida por método, no un descuido.

---

## Bloque E — Cómo defender la solidez de la evidencia

### Argumento 13 — "¿Esto está probado o es solo lo que dicen unas guías?"

**Qué respondés.** Hay distintos niveles, y conviene ser claro con cuál es cuál:

| Peso | Fuente | Qué sostiene |
|---|---|---|
| **Más fuerte, y del propio Chile** | Correa et al. 2022 | El SAE se diseñó teniendo en cuenta que el resultado fuera fácil de explicar a las familias. |
| **Más fuerte, y del propio Chile** | Arteaga et al. 2022 (≈49.000 familias) | Las familias del SAE se creen con más chances de las que tienen, y reaccionan bien a la información **personalizada** de riesgo (no a los avisos genéricos). |
| **Fuerte** | Microsoft (CHI 2019) | Criterios de interacción probados con 49 diseñadores sobre 20 productos. |
| **Fuerte** | Estudios de comunicación de riesgo | Cómo se entienden porcentajes y frecuencias con baja numeracidad (con la salvedad de que vienen del área médica). |
| **Guía profesional con investigación detrás** | Google, GOV.UK, Brookings | Confianza calibrada; explicación general vs. específica; patrones de trámite público; el error del "riesgo estratégico". |
| **Apoyo secundario** | NN/g | Redacción de avisos y explicaciones. Está pensada para chatbots, así que no sostiene sola una afirmación sobre familias del SAE. |
| **Descartar** | La cifra "20–25 % menos abandono"; un paper (arXiv 2408.12365) que se citaba mal como fuente de las cuadrículas | Sin fuente seria / mal atribuido. |

**Lo que todavía NO se puede afirmar (y hay que decirlo):**
- que la cuadrícula visual o el "26 de cada 100" mejoren la comprensión de las familias chilenas;
- que el prototipo aumente la confianza o la sensación de justicia;
- que explicar el resultado reduzca la idea de "tómbola".

Todo eso son **hipótesis**. El orden correcto es: la literatura fundamenta una decisión de diseño → se implementa → se prueba con usuarios → recién ahí hay evidencia propia. No: la literatura lo dice → entonces funciona.

---

## Bloque F — El diseño del estudio

### Argumento 14 — "¿Un solo caso no limita el estudio?"

**Qué respondés.**
- El contraste entre el grupo con explicación y el de control **solo tiene sentido si hay algo no obvio que explicar**. Por eso el caso elegido termina en "no quedaste en tu primera opción": ahí la explicación tiene algo que hacer. Si la familia quedara en su primera opción, no habría nada que aclarar.
- Que todos hagan **el mismo caso, con la misma lista y el mismo resultado** es una ventaja, no un problema: así la diferencia entre los dos grupos se puede atribuir a la capa de explicación y no a que a unos les fue mejor que a otros.
- Para medir la **sensación de justicia** es incluso mejor: todos están juzgando la justicia del *mismo* resultado.

**Qué conviene reconocer.** Que sea un solo caso limita cuánto se puede generalizar a otras situaciones. Eso ya está anotado como limitación en el documento del caso; se plantea como línea futura.

### Argumento 15 — Preguntas sueltas que pueden salir

- **"¿Por qué unas 30 personas?"** Es lo que indicó la profesora en la reunión anterior. Un estudio que compara dos grupos necesita más gente que uno formativo (el estudio previo del equipo usó 10 en un solo grupo). Como el número por grupo es chico (~15), el análisis usa pruebas estadísticas apropiadas para muestras pequeñas y se apoya en la descripción y en los tamaños del efecto, no en pruebas que exijan muchos datos.
- **"El moderador sabe qué versión le tocó a cada uno, ¿eso no sesga?"** Sí, es una limitación reconocida. Se controla leyendo un guion palabra por palabra, con las mismas tareas y preguntas en los dos grupos, y sin ayudar salvo bloqueo total.
- **"¿Por qué la familia del caso ya no es prioritaria (SEP)?"** Con esa condición, quedaba siempre en su primera opción y no había tensión que explicar. Se resolvió cambiando el caso (familia sin SEP y un colegio de alta demanda como primera opción), sin tocar el motor de cálculo.
- **"¿Y el PIE entra en el cálculo?"** Hoy se muestra como información y se aclara que no cambia el porcentaje. Meterlo al cálculo tocaría el núcleo del simulador; es una decisión pendiente, documentada.
- **"¿Necesitás comité de ética?"** El consentimiento informado ya está redactado; el caso es ficticio y no hay datos sensibles reales. Falta confirmar con la Dirección de la carrera si el trámite es exigible. No bloquea la aprobación del diseño.
