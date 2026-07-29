# João Felipe Photos — Portfólio Fotográfico Responsivo

Este repositório contém a reformulação completa do portfólio oficial do fotógrafo **João Felipe**, com acervo fotográfico de moda, editorial, retratos autorais, campanhas publicitárias e eventos corporativos.

---

## 📁 Estrutura de Pastas e Arquivos

```
Joao/
├── index.html                 # Página principal (HTML5 semântico com SEO)
├── css/
│   └── styles.css             # Estilos em Vanilla CSS (Dark/Light Mode & Layout)
├── js/
│   ├── app.js                 # Lógica da galeria, filtros, lightbox e formulário
│   └── portfolio_data.js      # Catálogo com 460 fotografias extraídas
├── data/
│   ├── design_tokens.json     # Tokens de design extraídos (Cores, Fontes)
│   ├── site_structure.json    # Dados brutos raspados do site original
│   └── detailed_report.json   # Mapeamento detalhado por rota
├── tools/                     # Scripts Python de raspagem e utilitários
│   ├── scrape_joao.py
│   ├── analyze.py
│   ├── detailed_extract.py
│   ├── build_data.py
│   └── create_design_tokens.py
├── UX_REFERENCE_GUIDE.md      # Guia de UX e Checklist para Referências
├── .gitignore                 # Arquivo de ignorados do Git & Vercel
└── README.md                  # Este arquivo
```

---

## 🚀 Como Rodar o Projeto Localmente

1. Clone o repositório ou navegue até a pasta do projeto:
   ```bash
   cd Joao
   ```

2. Inicie um servidor HTTP simples (ex: Python):
   ```bash
   python3 -m http.server 8080
   ```

3. Abra o navegador em `http://localhost:8080`.

---

## 🌐 Deploy na Vercel via GitHub

1. Adicione o seu repositório remoto no GitHub:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/joao-felipe-photos.git
   git push -u origin main
   ```

2. Na **Vercel** ([vercel.com](https://vercel.com)), importe o repositório `joao-felipe-photos` e clique em **Deploy**.
