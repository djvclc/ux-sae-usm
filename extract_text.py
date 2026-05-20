import pypdf

reader = pypdf.PdfReader("Informe Evaluación de calidad web SAE (1).pdf")
# Páginas 36 a 43 (índices 35 a 42)
for i in range(35, 43):
    if i < len(reader.pages):
        page = reader.pages[i]
        print(f"--- PÁGINA {i+1} ---")
        print(page.extract_text())
