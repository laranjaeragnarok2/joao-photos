import json

with open("detailed_report.json", "r", encoding="utf-8") as f:
    report = json.load(f)

# Extract images per section
categories_map = {
    "fashion": {"title": "Fashion & Editorial", "images": []},
    "gestacionais": {"title": "Gestacionais", "images": []},
    "publicitarios": {"title": "Publicitários & Commercial", "images": []},
    "eventos-corporativos": {"title": "Eventos Corporativos", "images": []},
    "autorais": {"title": "Autorais & Fine Art", "images": []},
    "in-and-out": {"title": "In & Out Project", "images": []}
}

all_images = []

for key, data in report.items():
    clean_key = key.replace("/", "")
    imgs = data.get("images", [])
    
    # Clean image URLs (remove duplicate queries or cdn variations if needed)
    valid_imgs = [i for i in imgs if "assets.zyrosite.com" in i or "http" in i]
    
    if clean_key in categories_map:
        categories_map[clean_key]["images"] = valid_imgs
    
    for img in valid_imgs:
        if img not in all_images:
            all_images.append(img)

# Format into JS module / data object
js_content = f"""// Auto-generated portfolio dataset from joaofelipephotos.com
const PORTFOLIO_DATA = {{
    photographer: {{
        name: "João Felipe",
        title: "Fotógrafo de Moda, Editorial & Retratos",
        bio: "Fotógrafo especializado em ensaios de moda, editorial, retratos autorais, campanhas publicitárias e eventos corporativos. Com olhar atento ao detalhe, textura e composição visual marcante.",
        instagram: "https://www.instagram.com/joaofelipe.photos/",
        behance: "https://www.behance.net/joaofelipephotos",
        whatsapp: "https://wa.me/5511999999999?text=Ol%C3%A1%20Jo%C3%A3o,%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20ensaio.",
        email: "contato@joaofelipephotos.com"
    }},
    categories: [
        {{ id: "all", name: "Todos os Trabalhos" }},
        {{ id: "fashion", name: "Fashion" }},
        {{ id: "gestacionais", name: "Gestacionais" }},
        {{ id: "publicitarios", name: "Publicitários" }},
        {{ id: "eventos-corporativos", name: "Eventos" }},
        {{ id: "autorais", name: "Autorais" }},
        {{ id: "in-and-out", name: "In & Out" }}
    ],
    items: {json.dumps(categories_map, indent=2, ensure_ascii=False)}
}};
"""

with open("portfolio_data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated portfolio_data.js with categories and images.")
