"""Genera le pagine di prova degli sfondi a partire da ../index.html.

Ogni prova è la pagina vera, con i percorsi corretti per la sottocartella, più i fogli di stile
e gli script della variante e una barra per passare da una prova all'altra.
Uso (dalla radice del progetto):  python prove/genera.py
Le prove sono temporanee: la cartella prove/ va eliminata dopo la scelta.
"""
from pathlib import Path

QUI = Path(__file__).parent
SORGENTE = QUI.parent / "index.html"

# (file, titolo, descrizione, css, js, classi del body)
VARIANTI = [
    ("1-grana", "Carta con grana (riferimento)",
     "Prima serie, la più apprezzata: campiture in sabbia calda tono su tono e grana di carta stampata.",
     ["1-grana.css"], [], ["con-grana"]),
    ("8-paesaggio", "Paesaggio a carta ritagliata",
     "L'apertura è un paesaggio di colline ritagliate con un sentiero verso una porta ad arco (lo studio); scorrendo il sole tramonta dietro le colline.",
     ["serie2.css", "8-paesaggio.css"], ["8-paesaggio.js"], ["con-grana"]),
    ("9-griglia", "Griglia a vista",
     "La pagina è un foglio di progetto: linee sottili fisse, apertura a mosaico di celle, foto che si compongono a tessere quando entrano nello schermo.",
     ["serie2.css", "9-griglia.css"], ["9-griglia.js"], ["con-grana"]),
    ("10-luce", "Luce dalla finestra",
     "Sul fondo cade l'ombra sfocata di una finestra e di una pianta, che si sposta lentissima; scorrendo la luce passa dal mattino al pomeriggio.",
     ["serie2.css", "10-luce.css"], ["10-luce.js"], ["con-grana"]),
    ("11-indice", "Indice",
     "Sotto il nome un grande indice delle sezioni; passando su una voce un'anteprima segue il mouse. Su telefono, miniature fisse.",
     ["serie2.css", "11-indice.css"], ["11-indice.js"], ["con-grana"]),
    ("12-riso", "Audace: risograph",
     "Stampa in due inchiostri (rosso mattone e ocra) su carta grezza: foto in bicromia a puntini, fuori registro, passaggi tra sezioni fatti di puntini che sfumano.",
     ["serie2.css", "12-riso.css"], ["12-riso.js"], ["con-grana"]),
]


def barra(corrente: str) -> str:
    voci = ['<a href="index.html">Prove</a>']
    for nome, titolo, *_ in VARIANTI:
        attivo = ' aria-current="page"' if nome == corrente else ""
        voci.append(f'<a href="{nome}.html" title="{titolo}"{attivo}>{nome.split("-")[0]}</a>')
    voci.append('<a href="../index.html">Sito</a>')
    return '  <nav class="prove-nav" aria-label="Prove di sfondo">' + "".join(voci) + "</nav>\n"


def genera_variante(html: str, nome: str, titolo: str, css: list, js: list, classi: list) -> str:
    for vecchio, nuovo in [
        ('href="styles.css"', 'href="../styles.css"'),
        ('src="script.js"', 'src="../script.js"'),
        ('"assets/', '"../assets/'),
        ('"dummy-photo.jpg"', '"../dummy-photo.jpg"'),
        ('"privacy.html"', '"../privacy.html"'),
    ]:
        html = html.replace(vecchio, nuovo)
    html = html.replace("<title>", f"<title>Prova {nome.split('-')[0]} · {titolo} · ", 1)
    extra = '  <link rel="stylesheet" href="prove.css">\n'
    extra += "".join(f'  <link rel="stylesheet" href="{f}">\n' for f in css)
    extra += "".join(f'  <script src="{f}" defer></script>\n' for f in js)
    html = html.replace("</head>", extra + "</head>", 1)
    if classi:
        html = html.replace("<body>", f'<body class="{" ".join(classi)}">', 1)
    return html.replace("</body>", barra(nome) + "</body>", 1)


def genera_indice() -> str:
    voci = "\n".join(
        f'      <li><a href="{nome}.html"><strong>{nome.split("-")[0]} · {titolo}</strong></a><br>{descr}</li>'
        for nome, titolo, descr, *_ in VARIANTI
    )
    return f"""<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Prove di sfondo</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="prove.css">
  <style>
    .elenco {{ padding-block: 3rem 6rem; max-width: 44rem; }}
    .elenco h1 {{ font-size: clamp(2.2rem, 1.6rem + 2.4vw, 3.4rem); font-weight: 300; margin-bottom: 1rem; }}
    .elenco ol {{ list-style: none; padding: 0; margin-top: 2.5rem; display: grid; gap: 1.5rem; }}
    .elenco strong {{ font-family: var(--serif); font-weight: 500; font-size: 1.25rem; }}
  </style>
</head>
<body>
  <main class="wrap elenco">
    <h1>Prove di sfondo</h1>
    <p>Seconda serie di prototipi (8–12), più la prova 1 come riferimento. I contenuti sono identici: cambia il trattamento visivo. Conviene guardarli sia da computer sia da telefono, scorrendo tutta la pagina.</p>
    <ol>
{voci}
    </ol>
    <p class="small" style="margin-top:2.5rem"><a href="../index.html">Torna al sito attuale</a></p>
  </main>
</body>
</html>
"""


def main() -> None:
    html = SORGENTE.read_text(encoding="utf-8")
    for nome, titolo, _descr, css, js, classi in VARIANTI:
        (QUI / f"{nome}.html").write_text(genera_variante(html, nome, titolo, css, js, classi), encoding="utf-8", newline="\n")
    (QUI / "index.html").write_text(genera_indice(), encoding="utf-8", newline="\n")
    print(f"Generate {len(VARIANTI)} prove + indice in {QUI}")


if __name__ == "__main__":
    main()
