#!/usr/bin/env python3
"""Genera la versión web de lectura de la memoria (una sola página HTML).

Uso (desde proyecto-tesis/):
    latexmk main.tex                 # primero: los números de sección salen de build/main.aux
    python3 scripts/publicar_web.py  # escribe build/web/memoria.html

La página se publica como Artifact privado de claude.ai (ver PLAN_REDACCION.md,
"Versión web"). Requiere pandoc (apt-get install pandoc). El PDF sigue siendo
el documento oficial: esta versión es para leer el avance desde el celular.

Imágenes: las figuras apuntan a imagenes/... (relativo a proyecto-tesis/); al
publicar, se suben con el parámetro `files` del Artifact con esas mismas rutas.

Qué hace:
  1. Lee los números reales de \\label desde build/main.aux, para que
     "Sección 3.4" diga lo mismo que el PDF.
  2. Une los capítulos (en el orden de main.tex) y reemplaza cada \\ref por
     su número; antepone "Tabla N." a los captions con \\label{tab:...}.
  3. Convierte con pandoc (citas autor-año desde referencias.bib).
  4. Marca cada capítulo con su estado según PLAN_REDACCION.md
     (vigente / en revisión / esperando datos) y agrega fecha y commit.
"""
import html
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
AUX = RAIZ / "build" / "main.aux"
PLAN = RAIZ / "PLAN_REDACCION.md"
PLANTILLA = RAIZ / "scripts" / "web" / "plantilla.html"
SALIDA = RAIZ / "build" / "web" / "memoria.html"

# id del <h1> generado por pandoc → número de capítulo en PLAN_REDACCION.md
CAPITULOS = {
    "resumen": 0,
    "cap:introduccion": 1,
    "cap:marco": 2,
    "cap:metodologia": 3,
    "cap:propuesta": 4,
    "cap:resultados": 5,
    "cap:discusion": 6,
    "cap:conclusiones": 7,
}
ESTADOS = {
    "vigente": ("chip--vigente", "Vigente"),
    "revision": ("chip--revision", "En revisión"),
    "espera": ("chip--espera", "Espera datos"),
}


def run(cmd, **kw):
    return subprocess.run(cmd, cwd=RAIZ, check=True, capture_output=True, text=True, **kw).stdout


def etiquetas():
    if not AUX.exists():
        sys.exit("Falta build/main.aux: corre primero `latexmk main.tex`.")
    txt = AUX.read_text(encoding="utf-8", errors="replace")
    return dict(re.findall(r"\\newlabel\{([^}]+)\}\{\{([^}]*)\}", txt))


def capitulos_en_orden():
    main = (RAIZ / "main.tex").read_text(encoding="utf-8")
    return [RAIZ / f"{m}.tex" for m in re.findall(r"^\\input\{(capitulos/[^}]+)\}", main, re.M)]


def macro(nombre):
    main = (RAIZ / "main.tex").read_text(encoding="utf-8")
    m = re.search(r"\\newcommand\{\\" + nombre + r"\}\{(.*)\}", main)
    return m.group(1) if m else ""


def preparar_tex(labels):
    partes = []
    for cap in capitulos_en_orden():
        t = cap.read_text(encoding="utf-8")
        t = re.sub(r"\\addcontentsline\{[^}]*\}\{[^}]*\}\{[^}]*\}", "", t)
        # "Tabla N." delante del caption de cada tabla con etiqueta.
        def tabla(m):
            bloque = m.group(0)
            lab = re.search(r"\\label\{(tab:[^}]+)\}", bloque)
            if lab and lab.group(1) in labels:
                bloque = bloque.replace("\\caption{", f"\\caption{{Tabla {labels[lab.group(1)]}. ", 1)
            return bloque
        t = re.sub(r"\\begin\{table\}.*?\\end\{table\}", tabla, t, flags=re.S)
        # Figuras: "Figura N." delante del caption (el número sale del .aux).
        def figura(m):
            bloque = m.group(0)
            lab = re.search(r"\\label\{(fig:[^}]+)\}", bloque)
            if lab and lab.group(1) in labels:
                bloque = bloque.replace("\\caption{", f"\\caption{{Figura {labels[lab.group(1)]}. ", 1)
            return bloque
        t = re.sub(r"\\begin\{figure\}.*?\\end\{figure\}", figura, t, flags=re.S)
        # \ref → número del PDF, enlazado a su ancla.
        t = re.sub(
            r"\\ref\{([^}]+)\}",
            lambda m: f"\\hyperref[{m.group(1)}]{{{labels.get(m.group(1), '??')}}}",
            t,
        )
        partes.append(t)
    cuerpo = "\n\n".join(partes)
    return "\\documentclass{report}\n\\begin{document}\n" + cuerpo + "\n\\end{document}\n"


def estados_plan():
    """Estado por capítulo: ⏸ en el título → espera; alguna fila 🔄/🟡/❓ → revisión; si no, vigente."""
    txt = PLAN.read_text(encoding="utf-8")
    res = {}
    for m in re.finditer(r"^### Cap\. (\d) — (.*?)$(.*?)(?=^### |^## |\Z)", txt, re.M | re.S):
        n, titulo, cuerpo = int(m.group(1)), m.group(2), m.group(3)
        filas = [l for l in cuerpo.splitlines() if l.startswith("|")]
        if "⏸" in titulo:
            res[n] = "espera"
        elif any(s in l for l in filas for s in ("🔄", "🟡", "❓")):
            res[n] = "revision"
        else:
            res[n] = "vigente"
    return res


def chip(estado):
    clase, texto = ESTADOS[estado]
    return f'<span class="chip {clase}">{texto}</span>'


def meta():
    commit = run(["git", "rev-parse", "--short", "HEAD"]).strip()
    sucio = run(["git", "status", "--porcelain", "--", "."]).strip()
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M")
    extra = " + cambios sin commit" if sucio else ""
    return f"Actualizada {fecha} · commit {commit}{extra}"


def main():
    labels = etiquetas()
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    tmp = SALIDA.parent / "_memoria.tex"
    tmp.write_text(preparar_tex(labels), encoding="utf-8")

    titulo = macro("tituloTesis")
    autor = macro("autorTesis")
    salida_pandoc = run([
        "pandoc", str(tmp), "-f", "latex", "-t", "html5",
        "--template", str(PLANTILLA),
        "--top-level-division=chapter", "--number-sections",
        "--toc", "--toc-depth=2",
        "--citeproc", "--bibliography", "bibliografia/referencias.bib",
        "-M", "lang=es-CL", "-M", "link-citations=true",
        "-M", "reference-section-title=Referencias",
        "--mathml", "--wrap=none",
        "-V", f"titulo={titulo}", "-V", f"autor={autor}",
    ])
    tmp.unlink()

    estados = estados_plan()
    html_out = salida_pandoc

    # Chip de estado bajo cada título de capítulo + resumen en la franja superior.
    filas = []
    for ident, n in CAPITULOS.items():
        est = estados.get(n)
        if not est:
            continue
        patron = re.compile(r'(<h1[^>]*id="' + re.escape(ident) + r'"[^>]*>(.*?)</h1>)', re.S)
        m = patron.search(html_out)
        if not m:
            continue
        html_out = html_out.replace(m.group(1), m.group(1) + f'\n<div class="cap-cab">{chip(est)}</div>', 1)
        nombre = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        filas.append(f'<li><a href="#{html.escape(ident)}">{nombre}</a>{chip(est)}</li>')
    html_out = html_out.replace("<!--ESTADO_CAPS-->", "\n      ".join(filas))
    html_out = html_out.replace("<!--META-->", html.escape(meta()))

    # Texto alternativo de las capturas: la leyenda de su figura + posición.
    def alt(m):
        fig = m.group(0)
        cap = re.search(r"<figcaption>(.*?)</figcaption>", fig, re.S)
        texto = html.escape(re.sub(r"<[^>]+>", "", cap.group(1)).strip()) if cap else "Captura del prototipo"
        imgs = re.findall(r"<img [^>]*/>", fig)
        pos = ["izquierda", "derecha"] if len(imgs) == 2 else [""] * len(imgs)
        for img, lado in zip(imgs, pos):
            fig = fig.replace(img, img.replace("<img ", f'<img alt="Captura {lado}: {texto}" loading="lazy" ', 1), 1)
        return fig
    html_out = re.sub(r"<figure.*?</figure>", alt, html_out, flags=re.S)

    SALIDA.write_text(html_out, encoding="utf-8")
    print(f"OK → {SALIDA.relative_to(RAIZ)} ({SALIDA.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
