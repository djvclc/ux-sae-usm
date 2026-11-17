"""Crea RESPUESTAS_PRUEBA_SAE.xlsx: registro de las respuestas de los videos de la prueba.
Preguntas y categorías tomadas de docs/investigacion/guion_lectura_prueba.md,
docs/prueba_definitiva/fuentes/2_PLANILLA_RESPUESTAS.html y 5_PAUTA_CLASIFICACION.md."""
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter as L

SALIDA = sys.argv[1]
N = 40                      # filas de participantes (P01–P40)
F0 = 4                      # primera fila de participantes; la 3 es el ejemplo
F1 = F0 + N - 1

AZUL, AZUL_CL = '0057B7', 'E8F1FB'
F = lambda **k: Font(**{'name': 'Arial', 'size': 10, **k})
RELLENAR = PatternFill('solid', fgColor='FFF2CC')   # celdas para llenar
FORMULA = PatternFill('solid', fgColor='EDEDED')    # calculadas, no se tocan
CAB = PatternFill('solid', fgColor=AZUL)
borde = Border(*(Side(style='thin', color='B7C3D0'),) * 4)

wb = Workbook()

# ── Listas para los menús desplegables ──────────────────────────────
LISTAS = {
    'Version': ['A', 'B'],
    'SiNo': ['Sí', 'No'],
    'SiNoNose': ['Sí', 'No', 'No sé'],
    'Escala': [1, 2, 3, 4, 5, 6, 7, 'No aplica'],
    'Escala7': [1, 2, 3, 4, 5, 6, 7],
    'Prediccion': ['San Martín', 'Los Andes', 'En ninguno', 'No sé'],
    'Seguridad': ['Nada', 'Poco', 'Algo', 'Bastante', 'Totalmente'],
    'Esperaba': ['Sí', 'No', 'Más o menos'],
    'Cambio': ['Como estaba', 'Lo habría cambiado', 'No sé'],
    'Categoria': ['Correcta', 'Parcial', 'Incorrecta', 'No sabe'],
    'Registro': ['Completa', 'Incompleta', 'Sin registro'],
    'Dispositivo': ['Mouse', 'Touchpad', 'Otro'],
    'Revision': ['Pendiente', 'En curso', 'Lista'],
    'Motivo15': ['Esconder el preferido', 'Aviso de lista corta', 'Otra'],
}
ls = wb.active
ls.title = 'Listas'
rangos = {}
for c, (nombre, vals) in enumerate(LISTAS.items(), start=1):
    ls.cell(1, c, nombre).font = F(bold=True)
    for r, v in enumerate(vals, start=2):
        ls.cell(r, c, v).font = F()
    col = L(c)
    rangos[nombre] = f"Listas!${col}$2:${col}${len(vals) + 1}"
    ls.column_dimensions[col].width = 22


def hoja(titulo, subtitulo, columnas, ejemplo):
    """columnas: (encabezado, ancho, tipo) tipo = lista | texto | num | min | formula | id"""
    ws = wb.create_sheet(titulo)
    ws['A1'] = subtitulo
    ws['A1'].font = F(bold=True, color=AZUL, size=11)
    ws.row_dimensions[2].height = 62
    for c, (enc, ancho, tipo, *extra) in enumerate(columnas, start=1):
        col = L(c)
        cel = ws.cell(2, c, enc)
        cel.font = F(bold=True, color='FFFFFF')
        cel.fill = CAB
        cel.alignment = Alignment(wrap_text=True, vertical='center')
        cel.border = borde
        ws.column_dimensions[col].width = ancho
        if tipo == 'lista':
            dv = DataValidation(type='list', formula1='=' + rangos[extra[0]], allow_blank=True)
            dv.error = 'Elige una opción de la lista.'
            dv.errorTitle = 'Valor no válido'
            ws.add_data_validation(dv)
            dv.add(f'{col}{F0}:{col}{F1}')
        for r in range(F0, F1 + 1):
            celda = ws.cell(r, c)
            celda.font = F()
            celda.border = borde
            celda.alignment = Alignment(wrap_text=tipo == 'texto', vertical='top')
            if tipo == 'id':
                celda.value = f'P{r - F0 + 1:02d}'
                celda.font = F(bold=True)
            elif tipo == 'formula':
                celda.value = extra[0].replace('{r}', str(r))
                celda.fill = FORMULA
                celda.font = F(color='008000') if 'Sesiones!' in extra[0] else F()
            else:
                celda.fill = RELLENAR
                if tipo == 'min':
                    celda.number_format = '@'
        # Fila de ejemplo (3): gris e itálica; no entra en el resumen.
        e = ws.cell(3, c, ejemplo[c - 1])
        e.font = F(italic=True, color='7F7F7F')
        e.border = borde
        e.alignment = Alignment(wrap_text=True, vertical='top')
        if tipo == 'min':
            e.number_format = '@'
    ws.freeze_panes = 'B4'
    return ws


VERSION = '=IF(INDEX(Sesiones!$E$1:$E$200,MATCH($A{r},Sesiones!$A$1:$A$200,0))="","",INDEX(Sesiones!$E$1:$E$200,MATCH($A{r},Sesiones!$A$1:$A$200,0)))'

# ── Sesiones ────────────────────────────────────────────────────────
hoja('Sesiones', 'Una fila por participante. Esta hoja es la única que dice la versión (A/B).', [
    ('ID', 7, 'id'),
    ('Fecha', 11, 'min'),
    ('Hora inicio', 9, 'min'),
    ('Hora término', 9, 'min'),
    ('Versión', 8, 'lista', 'Version'),
    ('¿Postuló antes con el SAE?', 11, 'lista', 'SiNo'),
    ('Consentimiento firmado (incluye mouse)', 13, 'lista', 'SiNo'),
    ('Archivo del video', 26, 'texto'),
    ('Duración del video (min)', 10, 'num'),
    ('Código del registro del mouse', 22, 'texto'),
    ('Registro del mouse', 12, 'lista', 'Registro'),
    ('Dispositivo', 11, 'lista', 'Dispositivo'),
    ('¿Se usa en el análisis del mouse?', 11, 'lista', 'SiNo'),
    ('Motivo si no se usa', 24, 'texto'),
    ('Revisión del video', 11, 'lista', 'Revision'),
    ('Fecha de revisión', 11, 'min'),
    ('Notas de la sesión', 40, 'texto'),
], ['P00', '05/11/2026', '15:32', '16:08', 'A', 'No', 'Sí', 'P00_A_2026-11-05.mp4', 36,
    '20261105-1532-A-k3f9', 'Completa', 'Mouse', 'Sí', '', 'Lista', '07/11/2026', 'EJEMPLO: no se cuenta en el resumen.'])

# ── Respuestas ──────────────────────────────────────────────────────
hoja('Respuestas', 'Lo que la persona respondió, tal como lo dijo. Las preguntas abiertas van textuales.', [
    ('ID', 7, 'id'),
    ('Versión (se llena sola)', 9, 'formula', VERSION),
    ('1. Facilidad (1–7)', 9, 'lista', 'Escala'),
    ('2. Tiempo (1–7)', 9, 'lista', 'Escala'),
    ('3. Información de apoyo (1–7)', 10, 'lista', 'Escala'),
    ('Promedio ASQ (se calcula)', 10, 'formula', '=IF(COUNT(C{r}:E{r})=0,"",AVERAGE(C{r}:E{r}))'),
    ('4. ¿En qué colegio va a quedar Sofía?', 13, 'lista', 'Prediccion'),
    ('5. ¿Qué tan segura/o?', 11, 'lista', 'Seguridad'),
    ('6. ¿Por qué? (textual)', 40, 'texto'),
    ('Minuto de la pregunta 4 en el video', 10, 'min'),
    ('7. Confianza (1–7)', 9, 'lista', 'Escala7'),
    ('8. Justicia (1–7)', 9, 'lista', 'Escala7'),
    ('9. ¿Era lo que esperabas?', 11, 'lista', 'Esperaba'),
    ('9. Comentario', 28, 'texto'),
    ('10. ¿Por qué crees que pasó esto? (textual)', 40, 'texto'),
    ('11. ¿Por qué Sofía no quedó en San Martín? (textual)', 40, 'texto'),
    ('Minuto de la pregunta 11 en el video', 10, 'min'),
    ('12. Con Los Andes primero, ¿dónde habría quedado? ¿Por qué?', 40, 'texto'),
    ('12b. ¿Lo habrías dejado como estaba?', 13, 'lista', 'Cambio'),
    ('12b. Razón', 28, 'texto'),
    ('13. Sin Martina en Los Andes, ¿las mismas posibilidades? ¿Por qué?', 40, 'texto'),
    ('14. Otra familia sin vínculo en San Martín, ¿podría quedar? ¿De qué dependería?', 40, 'texto'),
    ('15. ¿Por qué querías cambiarlo? (solo si intentó)', 32, 'texto'),
    ('Comentarios al cierre', 32, 'texto'),
], ['P00', 'A', 6, 5, 7, None, 'Los Andes', 'Bastante',
    '"Porque en Los Andes está la hermana y eso le da prioridad; San Martín es muy pedido."', '18:40',
    6, 5, 'Sí', 'Ya me lo imaginaba por la hermana.',
    '"Porque Martina estudia en Los Andes y en San Martín había muchos postulando."',
    '"Porque eran más niños que cupos y no tenía ningún vínculo con ese colegio."', '22:15',
    '"En Los Andes igual, por la hermana; el orden no cambia nada."', 'Como estaba', 'Era el que más le gustaba.',
    '"No, tendría menos posibilidades porque perdería la prioridad de hermana."',
    '"Sí, si hay cupos; depende del sorteo y de cuántos postulen."', '', 'Le gustó el panel de explicaciones.'])

# El promedio del ejemplo se calcula igual que en las filas reales.
wb['Respuestas']['F3'] = '=IF(COUNT(C3:E3)=0,"",AVERAGE(C3:E3))'
for ws_n, col in (('Respuestas', 'F'),):
    for r in range(3, F1 + 1):
        wb[ws_n][f'{col}{r}'].number_format = '0.0'

# ── Observación de la postulación ───────────────────────────────────
hoja('Observación', 'Lo que hizo durante la postulación (sección 3 del guion), visto en el video.', [
    ('ID', 7, 'id'),
    ('Versión (se llena sola)', 9, 'formula', VERSION),
    ('Tiempo de la tarea (min, del inicio al envío)', 11, 'num'),
    ('¿Dudó al elegir "En bloque"?', 10, 'lista', 'SiNo'),
    ('Qué dijo (En bloque)', 26, 'texto'),
    ('¿Usó "Corregir" en "¿Confirmas estos datos?"?', 11, 'lista', 'SiNo'),
    ('¿Comentó "Lo que el sistema ya sabe"? Qué dijo', 26, 'texto'),
    ('¿Intentó cambiar el orden?', 10, 'lista', 'SiNo'),
    ('Qué dijo (orden)', 26, 'texto'),
    ('¿Agregó más colegios?', 10, 'lista', 'SiNo'),
    ('Cuáles y en qué lugar', 24, 'texto'),
    ('¿Por el aviso de lista corta?', 10, 'lista', 'SiNoNose'),
    ('Solo A: miró el panel en Familia', 9, 'lista', 'SiNo'),
    ('Solo A: miró el panel en Lista', 9, 'lista', 'SiNo'),
    ('Solo A: miró el panel en Enviar', 9, 'lista', 'SiNo'),
    ('Solo A: miró el panel en Resultado', 9, 'lista', 'SiNo'),
    ('Solo A: abrió "Ver cómo se revisó tu lista"', 10, 'lista', 'SiNo'),
    ('Frases de apoyo usadas (cuáles y dónde)', 28, 'texto'),
    ('N.º de pedidos de ayuda', 9, 'num'),
    ('Momentos de duda o confusión (pantalla y qué dijo)', 36, 'texto'),
    ('¿Salió del flujo después del resultado?', 10, 'lista', 'SiNo'),
], ['P00', 'A', 9.5, 'Sí', '"¿En bloque significa que quedan juntos sí o sí?"', 'No', '', 'No', '', 'Sí',
    'Simón Bolívar, 3.º', 'Sí', 'Sí', 'Sí', 'No', 'Sí', 'No', '"¿Tú qué crees?" en el paso 2', 1,
    'Tu lista: no sabía si el 26 % era malo.', 'No'])

# ── Mouse: lo que dice resumen.mjs de cada sesión ──────────────────
USAR = VERSION.replace('$E$1:$E$200', '$M$1:$M$200')
PANTALLAS = ['Tu familia', '¿Confirmas estos datos?', 'Lista vacía', 'Catálogo', 'Tu lista',
             'Revisa y envía', 'Confirma tu postulación', 'Postulación enviada', 'Resultado']
hoja('Mouse', 'Copia aquí lo que muestra "node resumen.mjs" para cada sesión: segundos por pantalla y clics.', [
    ('ID', 7, 'id'),
    ('Versión (se llena sola)', 9, 'formula', VERSION),
    ('¿Se usa? (de Sesiones)', 9, 'formula', USAR),
] + [(f'{p} (s)', 10, 'num') for p in PANTALLAS] + [
    ('Clics en total', 9, 'num'),
    ('¿Salió del flujo después del resultado?', 11, 'lista', 'SiNo'),
    ('Otras páginas visitadas (p. ej. /colegio)', 18, 'texto'),
    ('Avisos del resumen (⚠)', 34, 'texto'),
], ['P00', 'A', 'Sí', 25, 10, 5, 15, 40, 30, 5, 20, 60, 14, 'No', '', ''])
for c in 'BC':
    wb['Mouse'][f'{c}3'] = VERSION.replace('{r}', '3') if c == 'B' else USAR.replace('{r}', '3')

# ── Clasificación (sin la versión a la vista) ───────────────────────
PREG = [('4', 'Predicción'), ('6', 'Por qué (predicción)'), ('10', 'Por qué pasó'),
        ('11', 'Por qué no San Martín'), ('12', 'Los Andes primero'), ('13', 'Sin Martina'), ('14', 'Otra familia')]
cols_clas = [('ID', 7, 'id')]
for n, t in PREG:
    cols_clas.append((f'{n}. {t}', 12, 'lista', 'Categoria'))
cols_clas += [
    ('Ideas en 6/10/11 (D, V, S, O)', 12, 'texto'),
    ('12b o 15: señal de "esconder" el preferido', 12, 'lista', 'SiNo'),
    ('15. Motivo del cambio', 14, 'lista', 'Motivo15'),
    ('Clasificó (iniciales)', 9, 'texto'),
    ('Notas de clasificación', 32, 'texto'),
    ('Versión (oculta: solo para el resumen)', 9, 'formula', VERSION),
]
wc = hoja('Clasificación', 'Clasifica con la pauta (5_PAUTA_CLASIFICACION). La versión está oculta (columna N) para no influir.',
          cols_clas, ['P00', 'Correcta', 'Correcta', 'Correcta', 'Correcta', 'Correcta', 'Correcta', 'Correcta',
                      'V, D', 'No', '', 'DV', 'Ejemplo según la pauta.', 'A'])
wc.column_dimensions['N'].hidden = True

# ── Copia ciega: para la segunda persona ────────────────────────────
TXT = {'6': 'I', '10': 'O', '11': 'P', '12': 'R', '13': 'U', '14': 'V'}  # columnas en Respuestas
cols_ciega = [('ID', 7, 'id'),
              ('4. Predicción (respuesta)', 13, 'formula', '=IF(Respuestas!G{r}="","",Respuestas!G{r})')]
for n, col in TXT.items():
    cols_ciega.append((f'{n}. Respuesta (textual)', 34, 'formula', f'=IF(Respuestas!{col}{{r}}="","",Respuestas!{col}{{r}})'))
for n, t in PREG:
    cols_ciega.append((f'{n}. Categoría (2.ª persona)', 12, 'lista', 'Categoria'))
hoja('Copia ciega', 'Para la 2.ª persona: copia esta hoja "solo valores" a un archivo nuevo. Ella llena las categorías; luego pégalas aquí (columnas I–O).',
     cols_ciega, ['P00', 'Los Andes', '(texto de la 6)', '(texto de la 10)', '(texto de la 11)', '(texto de la 12)',
                  '(texto de la 13)', '(texto de la 14)', 'Correcta', 'Correcta', 'Parcial', 'Correcta', 'Correcta',
                  'Correcta', 'Correcta'])
# En el ejemplo, las respuestas vienen del ejemplo de "Respuestas".
for c, col in zip('BCDEFGH', ['G'] + list(TXT.values())):
    wb['Copia ciega'][f'{c}3'] = f'=Respuestas!{col}3'

# ── Resumen por versión ─────────────────────────────────────────────
rs = wb.create_sheet('Resumen')
rs['A1'] = 'Resumen por versión (se calcula solo; la fila de ejemplo P00 no se cuenta)'
rs['A1'].font = F(bold=True, color=AZUL, size=11)
rs.column_dimensions['A'].width = 52
for col in 'BCD':
    rs.column_dimensions[col].width = 14
fila = [3]


def titulo(t):
    r = fila[0]
    rs.cell(r, 1, t).font = F(bold=True, color='FFFFFF')
    for c, enc in enumerate(['', 'A', 'B'], start=1):
        celda = rs.cell(r, c)
        celda.fill = CAB
        if enc:
            celda.value = enc
            celda.font = F(bold=True, color='FFFFFF')
            celda.alignment = Alignment(horizontal='center')
    fila[0] += 1


def linea(texto, formula_v, fmt='0'):
    r = fila[0]
    rs.cell(r, 1, texto).font = F()
    for c, v in ((2, 'A'), (3, 'B')):
        celda = rs.cell(r, c, formula_v(v))
        celda.font = F()
        celda.number_format = fmt
        celda.alignment = Alignment(horizontal='center')
        celda.border = borde
    rs.cell(r, 1).border = borde
    fila[0] += 1


rng = lambda hoja_, col: f"'{hoja_}'!${col}${F0}:${col}${F1}" if ' ' in hoja_ else f"{hoja_}!${col}${F0}:${col}${F1}"
VS, VR, VC = rng('Sesiones', 'E'), rng('Respuestas', 'B'), rng('Clasificación', 'N')

titulo('Participantes')
linea('Sesiones registradas', lambda v: f'=COUNTIF({VS},"{v}")')
linea('Ya había postulado con el SAE (Sí)', lambda v: f'=COUNTIFS({VS},"{v}",{rng("Sesiones", "F")},"Sí")')
linea('Registro del mouse completo', lambda v: f'=COUNTIFS({VS},"{v}",{rng("Sesiones", "K")},"Completa")')
fila[0] += 1

titulo('Escalas 1–7 (promedio; más alto = mejor)')
for t, col in (('1. Facilidad', 'C'), ('2. Tiempo', 'D'), ('3. Información de apoyo', 'E'),
               ('Promedio ASQ', 'F'), ('7. Confianza', 'K'), ('8. Justicia', 'L')):
    linea(t, lambda v, col=col: f'=IFERROR(AVERAGEIFS({rng("Respuestas", col)},{VR},"{v}"),"")', '0.0')
linea('Personas con al menos una escala respondida', lambda v: f'=COUNTIFS({VR},"{v}",{rng("Respuestas", "F")},">0")')
fila[0] += 1

titulo('Registro del mouse (segundos promedio por pantalla; solo sesiones que se usan)')
VM, UM = rng('Mouse', 'B'), rng('Mouse', 'C')
linea('Sesiones que se usan en el análisis del mouse', lambda v: f'=COUNTIFS({VM},"{v}",{UM},"Sí")')
for i, p in enumerate(PANTALLAS):
    col = L(4 + i)
    linea(p, lambda v, col=col: f'=IFERROR(AVERAGEIFS({rng("Mouse", col)},{VM},"{v}",{UM},"Sí"),"")', '0')
linea('Clics en total (promedio)', lambda v: f'=IFERROR(AVERAGEIFS({rng("Mouse", "M")},{VM},"{v}",{UM},"Sí"),"")', '0')
linea('Salió del flujo después del resultado', lambda v: f'=COUNTIFS({VM},"{v}",{rng("Mouse", "N")},"Sí")')
fila[0] += 1

titulo('4. Predicción (cuántas personas)')
for op in LISTAS['Prediccion']:
    linea(op, lambda v, op=op: f'=COUNTIFS({VR},"{v}",{rng("Respuestas", "G")},"{op}")')
fila[0] += 1

titulo('9. ¿Era lo que esperabas?')
for op in LISTAS['Esperaba']:
    linea(op, lambda v, op=op: f'=COUNTIFS({VR},"{v}",{rng("Respuestas", "M")},"{op}")')
fila[0] += 1

titulo('12b. ¿Lo habrías dejado como estaba?')
for op in LISTAS['Cambio']:
    linea(op, lambda v, op=op: f'=COUNTIFS({VR},"{v}",{rng("Respuestas", "S")},"{op}")')
linea('Señal de "esconder" el preferido (12b o 15)', lambda v: f'=COUNTIFS({VC},"{v}",{rng("Clasificación", "J")},"Sí")')
fila[0] += 1

for i, (n, t) in enumerate(PREG):
    col = L(2 + i)
    titulo(f'{n}. {t} — clasificación')
    for cat in LISTAS['Categoria']:
        linea(cat, lambda v, cat=cat, col=col: f'=COUNTIFS({VC},"{v}",{rng("Clasificación", col)},"{cat}")')
    fila[0] += 1

r = fila[0]
rs.cell(r, 1, 'Acuerdo con la 2.ª persona (antes de conversar)').font = F(bold=True, color='FFFFFF')
for c in (1, 2):
    rs.cell(r, c).fill = CAB
rs.cell(r, 2, '% coincidencia').font = F(bold=True, color='FFFFFF')
fila[0] += 1
for i, (n, t) in enumerate(PREG):
    a, b = rng('Clasificación', L(2 + i)), rng('Copia ciega', L(9 + i))
    rr = fila[0]
    rs.cell(rr, 1, f'{n}. {t}').font = F()
    celda = rs.cell(rr, 2, f'=IFERROR(SUMPRODUCT(({a}<>"")*({b}<>"")*({a}={b}))/SUMPRODUCT(({a}<>"")*({b}<>"")),"")')
    celda.number_format = '0%'
    celda.font = F()
    celda.alignment = Alignment(horizontal='center')
    rs.cell(rr, 1).border = borde
    celda.border = borde
    fila[0] += 1
fila[0] += 1
rs.cell(fila[0], 1, 'Medianas y pruebas (U de Mann-Whitney, tamaño de efecto) se calculan aparte, según el plan de análisis del Cap. 3.').font = F(italic=True, color='7F7F7F')

# ── Cómo usar (primera hoja) ────────────────────────────────────────
cu = wb.create_sheet('Cómo usar', 0)
cu.column_dimensions['A'].width = 115
texto = [
    ('RESPUESTAS DE LA PRUEBA DE USABILIDAD SAE — registro desde los videos', 'h'),
    ('Una fila por participante (P01–P40), con el mismo ID en todas las hojas. La fila 3 de cada hoja es un EJEMPLO (gris): muestra el formato y no se cuenta.', ''),
    ('', ''),
    ('Colores', 'h2'),
    ('Amarillo = la llenas tú (muchas tienen menú desplegable).   Gris = se calcula sola, no la toques.   Texto verde = viene de la hoja "Sesiones".', ''),
    ('', ''),
    ('Nombres de archivos (mismo ID en todo, nunca el nombre)', 'h2'),
    ('Video: P01_A_2026-11-05.mp4   ·   Registro del mouse: P01_20261105-1532-A-k3f9.zip   ·   Planilla en papel: P01.pdf', ''),
    ('', ''),
    ('Orden de trabajo por video', 'h2'),
    ('1. Sesiones: fecha, horas, versión, experiencia previa, archivo del video y estado del registro del mouse (del resumen).', ''),
    ('2. Respuestas: mira desde la sección 4 del guion ("Terminaste la postulación…") hasta el cierre. Anota las abiertas TEXTUALES, entre comillas, y el minuto de las preguntas 4 y 11.', ''),
    ('   La planilla en papel de esa sesión sirve de guía: el video es para completar y corregir lo que alcanzaste a anotar.', ''),
    ('3. Mouse: descomprime los registros en scripts\\mapa-calor\\datos, corre "node resumen.mjs" y copia sus números en la hoja "Mouse".', ''),
    ('4. Observación: la postulación (sección 3). Si vas corto de tiempo, déjala para el final: parte de esto también lo muestra el registro del mouse.', ''),
    ('5. Clasificación: hazla en otra pasada, cuando tengas varias sesiones, con 5_PAUTA_CLASIFICACION a la vista. La versión está oculta en esa hoja para no influir.', ''),
    ('', ''),
    ('Criterios de exclusión del análisis del mouse — escríbelos ANTES de mirar los mapas (celdas amarillas de abajo)', 'h2'),
    ('@CRITERIO 1: (ej.) No usó mouse ni touchpad.', ''),
    ('@CRITERIO 2: (ej.) Sin datos en "Tu lista" y en "Resultado".', ''),
    ('@CRITERIO 3:', ''),
    ('Las sesiones excluidas del mouse siguen valiendo para el resto del estudio (respuestas, escalas, clasificación).', ''),
    ('', ''),
    ('Segunda persona (clasificación ciega)', 'h2'),
    ('a) En "Copia ciega", selecciona todo, copia y pega en un archivo nuevo con "Pegar solo valores". Ese archivo no muestra la versión ni nombres.', ''),
    ('b) La 2.ª persona llena las categorías (columnas I–O) con la misma pauta, sin conversar contigo.', ''),
    ('c) Pega sus categorías de vuelta en las columnas I–O de "Copia ciega". El "Resumen" calcula el % de coincidencia; después conversan las diferencias y corriges "Clasificación".', ''),
    ('   Trabaja solo con este archivo: la grabación la ve solo el autor (lo dice el consentimiento).', ''),
    ('', ''),
    ('Claves de la pauta', 'h2'),
    ('Categorías: Correcta · Parcial · Incorrecta · No sabe.   Ideas: D = Demanda (más familias que cupos) · V = Vínculo (hermana en Los Andes, nada en San Martín) · S = Sorteo · O = Orden (no cambia las posibilidades).', ''),
    ('Si dice algo correcto y algo incorrecto a la vez, vale la idea incorrecta (Parcial).', ''),
    ('', ''),
    ('Privacidad', 'h2'),
    ('Este archivo con respuestas va en tu Drive privado, NUNCA en el repositorio (es público). Sin nombres: solo el ID. La relación ID ↔ nombre queda solo en los consentimientos.', ''),
]
for i, (t, tipo) in enumerate(texto, start=1):
    editable = t.startswith('@')
    c = cu.cell(i, 1, t[1:] if editable else t)
    if editable:
        c.fill = RELLENAR
    c.alignment = Alignment(wrap_text=True, vertical='top')
    c.font = F(bold=True, size=13, color=AZUL) if tipo == 'h' else F(bold=True, color=AZUL) if tipo == 'h2' else F()
leyenda = len(texto) + 2
for j, (fill, txt) in enumerate(((RELLENAR, 'Ejemplo de celda para llenar'), (FORMULA, 'Ejemplo de celda calculada'))):
    c = cu.cell(leyenda + j, 1, txt)
    c.fill = fill
    c.font = F()

wb.move_sheet('Listas', offset=len(wb.sheetnames))
wb['Listas'].sheet_state = 'visible'
wb.active = 0
wb.save(SALIDA)
print('ok', SALIDA)
