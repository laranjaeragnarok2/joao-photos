# João Felipe Photos — Portfólio Fotográfico Editorial

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Portfólio web de alta performance e estética ultra-limpa para o fotógrafo **João Felipe**, especializado em fotografia de moda, editorial, retratos autorais, gestacionais, campanhas publicitárias e eventos corporativos em São Paulo.

---

## ✨ Características do Projeto

- 🎨 **Design Concept**: *Editorial Off-White Gallery* ultralimpo com opção de alternância para *Dark Obsidian*.
- 🖼️ **Grid Seamless de 2 Colunas**: Exibição de fotografias sem espaçamento entre bordas (`gap: 0`), priorizando 100% o impacto das imagens.
- ⚡ **Performance Otimizada**: Carregamento paginado (*Lazy Loading*) para suportar mais de 460 fotos sem travar dispositivos móveis.
- 📱 **Foco em Conversão (Leads)**: Integrado com botão flutuante e modal de orçamento com direcionamento automático para o WhatsApp.
- 🔍 **SEO & Metadata**: Estruturado semanticamente em HTML5 com tags Open Graph e Google Font `Inter` exclusiva.

---

## 📁 Estrutura do Repositório

```
joao-photos/
├── index.html                 # Layout principal (HTML5 semântico com SEO)
├── css/
│   └── styles.css             # Estilos em Vanilla CSS (Off-White & Dark Mode)
├── js/
│   ├── app.js                 # Lógica do filtro de categorias, lightbox e formulário
│   └── portfolio_data.js      # Catálogo com 460 fotografias originais
├── content/
│   ├── ensaios/               # 460 fotografias organizadas por ensaio
│   │   ├── fashion/
│   │   ├── gestacionais/
│   │   ├── publicitarios/
│   │   ├── eventos-corporativos/
│   │   ├── autorais/
│   │   └── in-and-out/
│   └── copy/                  # Hub de posicionamento de marca e textos
├── data/                      # Tokens de design e dados brutos raspados
├── tools/                     # Scripts de automação e organização em Python
├── UX_REFERENCE_GUIDE.md      # Guia de UX e envio de referências
├── .gitignore                 # Arquivo de ignorados Git
└── README.md                  # Este arquivo
```

---

## 🚀 Como Rodar Localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/laranjaeragnarok2/joao-photos.git

# 2. Entrar na pasta do projeto
cd joao-photos

# 3. Iniciar um servidor HTTP local
python3 -m http.server 8080
```
Acesse `http://localhost:8080` no navegador.

---

## 📄 Licença e Direitos
© 2026 **João Felipe Photos**. Todos os direitos autorais sobre as fotografias pertencem ao artista.
