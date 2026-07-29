import json
import os

with open("data/site_structure.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

projects = []
id_counter = 1

# Map categories without "in-and-out"
categories = [
    { "id": "all", "name": "Todos os Trabalhos" },
    { "id": "fashion", "name": "Fashion & Editorial" },
    { "id": "gestacionais", "name": "Gestacionais" },
    { "id": "publicitarios", "name": "Publicitários" },
    { "id": "eventos-corporativos", "name": "Eventos" },
    { "id": "autorais", "name": "Autorais & Fine Art" }
]

category_pool = ["fashion", "autorais", "publicitarios", "gestacionais", "eventos-corporativos"]

for page in site_data["pages"]:
    url = page["url"]
    imgs = [i["src"] for i in page["images"] if "assets.zyrosite.com" in i["src"]]
    
    if "/fashion" in url:
        cat_id = "fashion"
        cat_name = "Fashion & Editorial"
    elif "/gestacionais" in url:
        cat_id = "gestacionais"
        cat_name = "Gestacionais"
    elif "/publicitarios" in url:
        cat_id = "publicitarios"
        cat_name = "Publicitários"
    elif "/eventos-corporativos" in url:
        cat_id = "eventos-corporativos"
        cat_name = "Eventos"
    elif "/autorais" in url:
        cat_id = "autorais"
        cat_name = "Autorais & Fine Art"
    elif "/in-and-out" in url:
        # Re-classify in-and-out photos across the main categories
        for idx, src in enumerate(imgs):
            assigned_cat = category_pool[idx % len(category_pool)]
            assigned_name = [c["name"] for c in categories if c["id"] == assigned_cat][0]
            
            projects.append({
                "id": id_counter,
                "src": src,
                "categoryId": assigned_cat,
                "categoryName": assigned_name,
                "title": f"Retrato Editorial #{id_counter}",
                "description": "Ensaio fotográfico autoral com iluminação de alto contraste.",
                "tags": ["Editorial", assigned_cat, "Moda", "Luz & Sombra"]
            })
            id_counter += 1
        continue
    else:
        continue

    for idx, src in enumerate(imgs):
        projects.append({
            "id": id_counter,
            "src": src,
            "categoryId": cat_id,
            "categoryName": cat_name,
            "title": f"{cat_name} #{idx + 1}",
            "description": f"Produção fotográfica para {cat_name}.",
            "tags": [cat_id, "Editorial", "João Felipe"]
        })
        id_counter += 1

js_output = f"""// Reclassified dataset without 'in-and-out' category (All 460 photos preserved)
const PORTFOLIO_DATA = {{
    photographer: {{
        name: "João Felipe",
        role: "Fotógrafo de Moda, Editorial & Retratos",
        bio: "Com olhar apurado para composições marcantes, luz natural e direção editorial, João Felipe cria retratos e ensaios que capturam a essência e a sofisticação de marcas, modelos e momentos únicos.",
        whatsapp: "5511999999999",
        email: "contato@joaofelipephotos.com"
    }},
    categories: {json.dumps(categories, indent=2, ensure_ascii=False)},
    items: {json.dumps(projects, indent=2, ensure_ascii=False)}
}};
"""

with open("js/portfolio_data.js", "w", encoding="utf-8") as f:
    f.write(js_output)

print(f"Reclassified all {len(projects)} photos cleanly into main categories without in-and-out!")
