#!/usr/bin/env python3
"""Verificación estática de la memoria (sin necesidad de LaTeX instalado).

Uso (desde proyecto-tesis/):
    python3 scripts/verificar_memoria.py            # revisa todos los capítulos
    python3 scripts/verificar_memoria.py 03         # solo capítulos cuyo nombre contiene "03"

Chequeos:
  ERROR  (bloquean el cierre de una tarea de redacción)
    - \\cite{...} con clave inexistente en bibliografia/referencias.bib
    - \\ref{...} sin \\label correspondiente
    - \\label duplicado
    - llaves { } desbalanceadas por archivo
    - \\includegraphics que apunta a un archivo inexistente
    - entornos \\begin/\\end desbalanceados por archivo
    - datos que identifican el informe privado de calidad web (ver CONFIDENCIALES)
  AVISO  (el agente decide si corresponde corregir)
    - patrones obsoletos (cifras o términos superados; ver OBSOLETOS)
    - "tesis" en el cuerpo (la convención es "memoria")
    - porcentaje sin espacio fino (51\\% en vez de 51\\,\\%)
    - marcadores de pendiente (\\pendiente, TODO, XXX)
    - afirmaciones absolutas ("significativamente", "demostrado", "siempre"...)
    - referencias cruzadas escritas a mano ("Sección~3.5" en vez de \\ref)
  INFO
    - claves del .bib sin citar
    - palabras por capítulo

Sale con código 1 si hay algún ERROR.
"""
import re
import signal
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CAPS = RAIZ / "capitulos"
BIB = RAIZ / "bibliografia" / "referencias.bib"

# (regex, motivo). Cifras/términos superados que no deben reaparecer en el
# texto como vigentes. Una aparición puede ser legítima si se cita como
# historia (p. ej. la nota de conteo del Cap. 3): el agente lo juzga.
OBSOLETOS = [
    (r"87\s*/\s*87|87 de 87", "cifra histórica del plan; vigente: 98 aplicables, 'la totalidad ... a nivel de código'"),
    (r"62\s*/\s*62|72\s*/\s*72", "cifra intermedia del plan (junio/agosto)"),
    (r"probAsignacion|umbral (de asignación )?del? 65", "tabla/umbral eliminados en el Bloque R (sept. 2026)"),
    (r"\bN\s*=\s*8\b|ocho participantes", "prueba formativa N=8 superada por el estudio comparativo N≈30"),
    (r"once ítems", "instrumento Likert vigente: 13 ítems (C1–C5, F1–F5, J1–J3)"),
    (r"guardado visible de borrador", "borrador reanudable retirado (Bloque S5, 2026-09-06)"),
    (r"máximo de (tres|ocho) colegios", "el SAE no tiene tope (error E2)"),
]

# Afirmaciones absolutas o de certeza: aviso, no error. Pueden ser legítimas
# (p. ej. "siempre" describiendo la semilla fija del simulador); el agente o el
# revisor juzgan si la afirmación está respaldada por la fuente citada.
ABSOLUTAS = r"\b(significativamente|demostrad[oa]s?|demuestra[n]?|prueba de que|garantiza[n]?|sin duda|indudablemente|evidentemente|claramente|todos los estudios|toda la literatura|decenas de estudios)\b"

# Confidencialidad (decisión del autor, 2026-09-30): el informe de evaluación
# de calidad web del SAE es un documento privado. La memoria puede usar sus
# cifras y describir su instrumento, pero no identificarlo (autores, proyecto,
# institución, sigla del instrumento, cita) ni calificarlo de "no publicado".
# Cualquier coincidencia es ERROR.
CONFIDENCIALES = [
    (r"Fondecyt|1250492", "número/proyecto Fondecyt del informe"),
    (r"SISIB", "sigla del instrumento del informe"),
    (r"moralesvargas|Morales[- ]Vargas", "autoría o clave bib del informe"),
    (r"(diagn[óo]stico|evaluaci[óo]n|instrumento|informe)[^.]{0,80}Universidad de Chile", "institución del informe"),
    (r"no publicad|in[ée]dit|documento (privado|interno)", "no calificar el diagnóstico como no publicado"),
]

ENTORNOS_IGNORADOS = {"document"}


def leer(p):
    return p.read_text(encoding="utf-8")


def sin_comentarios(texto):
    # Quita comentarios LaTeX (% no escapado) línea a línea, conservando numeración.
    return "\n".join(re.sub(r"(?<!\\)%.*", "", l) for l in texto.split("\n"))


def claves_bib():
    return set(re.findall(r"@\w+\s*{\s*([^,\s]+)\s*,", leer(BIB)))


def main():
    filtro = sys.argv[1] if len(sys.argv) > 1 else ""
    archivos = sorted(CAPS.glob("*.tex"))
    todos = archivos + [RAIZ / "main.tex"]
    objetivo = [a for a in archivos if filtro in a.name]

    bib = claves_bib()
    citadas, labels, refs = {}, {}, []
    errores, avisos = [], []

    for arch in todos:
        crudo = leer(arch)
        texto = sin_comentarios(crudo)
        rel = arch.relative_to(RAIZ)
        for n, linea in enumerate(texto.split("\n"), 1):
            for grupo in re.findall(r"\\cite[a-zA-Z]*\*?(?:\[[^\]]*\])*{([^}]*)}", linea):
                for k in grupo.split(","):
                    citadas.setdefault(k.strip(), []).append(f"{rel}:{n}")
            for lab in re.findall(r"\\label{([^}]*)}", linea):
                labels.setdefault(lab, []).append(f"{rel}:{n}")
            for img in re.findall(r"\\includegraphics(?:\[[^\]]*\])?{([^}]*)}", linea):
                if not any((RAIZ / c).exists() for c in (img, f"imagenes/{img}", f"{img}.png", f"imagenes/{img}.png")):
                    errores.append(f"{rel}:{n}: figura inexistente «{img}»")
            for r_ in re.findall(r"\\(?:auto|eq|page)?ref{([^}]*)}", linea):
                refs.append((r_, f"{rel}:{n}"))

        if arch not in objetivo:
            continue

        if texto.count("{") - texto.count("\\{") != texto.count("}") - texto.count("\\}"):
            errores.append(f"{rel}: llaves desbalanceadas")
        pila = []
        for n, linea in enumerate(texto.split("\n"), 1):
            for tipo, env in re.findall(r"\\(begin|end){([^}]*)}", linea):
                if env in ENTORNOS_IGNORADOS:
                    continue
                if tipo == "begin":
                    pila.append((env, n))
                elif not pila or pila[-1][0] != env:
                    errores.append(f"{rel}:{n}: \\end{{{env}}} sin \\begin correspondiente")
                else:
                    pila.pop()
        for env, n in pila:
            errores.append(f"{rel}:{n}: \\begin{{{env}}} sin cerrar")

        for n, linea in enumerate(texto.split("\n"), 1):
            for patron, motivo in CONFIDENCIALES:
                m = re.search(patron, linea, re.I)
                if m:
                    errores.append(f"{rel}:{n}: CONFIDENCIAL «{m.group(0)}» — {motivo}")
            for patron, motivo in OBSOLETOS:
                if re.search(patron, linea, re.I):
                    m = re.search(patron, linea, re.I)
                    avisos.append(f"{rel}:{n}: obsoleto «{m.group(0)}» — {motivo}")
            if re.search(r"\btesis\b", linea) and "\\citet" not in linea and "Tesis" not in linea:
                avisos.append(f"{rel}:{n}: «tesis» en el cuerpo (convención: «memoria»)")
            if re.search(r"(Capítulos?|Secci[óo]n(es)?|Tabla|Figura)~\d", linea):
                avisos.append(f"{rel}:{n}: referencia escrita a mano (usar \\label/\\ref; los números se desfasan)")
            if re.search(r"\d\\%", linea):
                avisos.append(f"{rel}:{n}: porcentaje sin espacio fino (usar 51\\,\\%)")
            m = re.search(ABSOLUTAS, linea, re.I)
            if m:
                avisos.append(f"{rel}:{n}: afirmación absoluta «{m.group(0)}» — ¿la respalda la fuente?")
            if re.search(r"\\pendiente|\bTODO\b|\bXXX\b", crudo.split("\n")[n - 1]):
                avisos.append(f"{rel}:{n}: marcador de pendiente")

    for k, donde in sorted(citadas.items()):
        if k and k not in bib:
            errores.append(f"cita inexistente «{k}» en {', '.join(donde)}")
    for lab, donde in labels.items():
        if len(donde) > 1:
            errores.append(f"\\label duplicado «{lab}» en {', '.join(donde)}")
    for r_, donde in refs:
        if r_ not in labels:
            errores.append(f"{donde}: \\ref{{{r_}}} sin \\label")

    # Entradas del .bib con marcador VERIFICAR que se citan: el marcador se
    # imprime en la bibliografía del PDF (ver bibliografia_anotada.md, Bloque B).
    for m in re.finditer(r"@\w+\s*{\s*([^,\s]+)\s*,(.*?)\n}", leer(BIB), re.S):
        if "VERIFICAR" in m.group(2) and m.group(1) in citadas:
            avisos.append(f"bib «{m.group(1)}»: tiene marcador VERIFICAR y se cita — el marcador aparece en el PDF")
    print("== ERRORES ==" if errores else "== ERRORES: ninguno ==")
    for e in errores:
        print("  ✗", e)
    print("== AVISOS ==" if avisos else "== AVISOS: ninguno ==")
    for a in avisos:
        print("  !", a)
    sin_citar = sorted(bib - set(citadas))
    print(f"== INFO == {len(bib)} claves en el .bib, {len(sin_citar)} sin citar: {', '.join(sin_citar) or '—'}")
    for a in objetivo:
        palabras = len(re.sub(r"\\[a-zA-Z]+\*?|[{}\[\]]", " ", sin_comentarios(leer(a))).split())
        print(f"   {a.name}: ~{palabras} palabras")
    sys.exit(1 if errores else 0)


if __name__ == "__main__":
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)  # permite `| head` sin traza
    main()
