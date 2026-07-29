# Configuración de latexmk para compilar main.tex con pdflatex (MiKTeX)
# y dejar toda la salida (pdf, aux, log, synctex, bbl, etc.) en build/.

$pdf_mode = 1;                 # genera PDF vía pdflatex
$postscript_mode = 0;
$dvi_mode = 0;

# Carpeta única de salida para archivos auxiliares y el PDF final.
$out_dir = 'build';
$aux_dir = 'build';

# Motor pdflatex con synctex habilitado para sincronización con el editor
# y modo no interactivo para que los errores no detengan la compilación.
$pdflatex = 'pdflatex -synctex=1 -interaction=nonstopmode -file-line-error %O %S';

# Fuerza a bibtex a ejecutarse cuando sea necesario (bibliografía con natbib).
$bibtex_use = 2;

# bibtex no busca .bib en subcarpetas si el nombre incluye una ruta con "/",
# así que en main.tex se referencia solo \bibliography{referencias} y aquí
# agregamos bibliografia/ al path de búsqueda de BibTeX. Se usa una ruta
# absoluta (basada en el directorio del proyecto, no en build/) porque
# latexmk cambia el directorio de trabajo a out_dir/aux_dir al invocar bibtex.
use Cwd;
ensure_path('BIBINPUTS', cwd() . '/bibliografia//');

# Limpieza: extensiones adicionales a borrar con `latexmk -c`
$clean_ext = 'synctex.gz synctex.gz(busy) run.xml bbl bcf fdb_latexmk';
