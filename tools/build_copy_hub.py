import os
import json

# Ensure directories exist
os.makedirs("content/behance", exist_ok=True)
os.makedirs("content/instagram", exist_ok=True)
os.makedirs("content/copy", exist_ok=True)

# 1. Brand Positioning Copy
brand_positioning = """# Posicionamento de Marca — João Felipe Photos

## 1. Proposta de Valor (Value Proposition)
"Fotografia editorial, retratos autorais e produções de moda com olhar contemporâneo, direção precisa de iluminação e composição sofisticada."

## 2. Pilares da Marca (Brand Pillars)
- **Sofisticação & Minimalismo**: Uso inteligente de luz, sombra e espaço negativo.
- **Foco na Autenticidade**: Captura da essência das marcas, modelos e gestantes sem exageros artificiais.
- **Excelência Editorial**: Padrão de revista de moda adaptado para campanhas publicitárias e retratos exclusivos.

## 3. Tom de Voz (Tone of Voice)
- Elegante, direto, profissional, minimalista e seguro.
- Frases curtas e de forte apelo estético ("Luz, Forma e Essência").
"""

# 2. Website Copy (Textos Prontos para Uso)
website_copy = """# Copys Prontas para o Novo Website — João Felipe Photos

## 1. Hero Section (Capa)
- **Título**: JOÃO FELIPE
- **Subtítulo**: Fotografia de Moda, Editorial & Retratos Autorais
- **Tagline Secundária**: "Luz, composição e estética editorial para marcas, campanhas e retratos memoráveis."

## 2. Seção Sobre (Bio Curta)
"Com olhar apurado para a estética editorial, atuo na criação de imagens marcantes para marcas de moda, campanhas publicitárias, gestantes e retratos autorais. Cada projeto une rigor técnico na iluminação e sensibilidade artística para transformar momentos e coleções em registros inesquecíveis."

## 3. Chamadas para Ação (CTAs de Conversão)
- **Botão Principal**: "Solicitar Orçamento"
- **Botão Secundário**: "Explorar Portfólio"
- **WhatsApp Direto**: "Falar com o Fotógrafo no WhatsApp"
- **Solicitação de Ensaio**: "Olá João! Gostaria de consultar a disponibilidade de data para meu ensaio."

## 4. Textos de Categorias
- **Fashion & Editorial**: "Ensaios conceituais e coleções de moda com estética contemporânea e direção editorial refinada."
- **Gestacionais**: "Retratos de maternidade que celebram a forma e a delicadeza com sensibilidade, luz natural e elegância."
- **Publicitários**: "Campanhas visuais de alto impacto para marcas que buscam autoridade e sofisticação."
- **Eventos Corporativos**: "Registros dinâmicos e impecáveis para convenções, lançamentos de marcas e summits."
- **Autorais**: "Estudos visuais livres focados na interação entre luz, textura e expressão humana."
"""

# 3. Category Copys
category_copys = """# Copys Curtas por Categoria (Para Cards e Modais)

### Fashion
- "Direção de cena e linguagem visual para marcas e editoriais de moda."

### Gestacionais
- "Ensaios intimistas e atemporais celebrando a maternidade com arte."

### Publicitários
- "Fotografia comercial focada na valorização da marca e do produto."

### Eventos Corporativos
- "Acompanhamento fotográfico de alto nível para eventos empresariais."

### Autorais
- "Exploração artística contemporânea e retratos fine art."
"""

with open("content/copy/brand_positioning.md", "w", encoding="utf-8") as f:
    f.write(brand_positioning)

with open("content/copy/website_copy.md", "w", encoding="utf-8") as f:
    f.write(website_copy)

with open("content/copy/category_copys.md", "w", encoding="utf-8") as f:
    f.write(category_copys)

print("Copy Hub successfully built under content/ folder!")
