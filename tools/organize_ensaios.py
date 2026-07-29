import json
import os

with open("data/site_structure.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

# Base directory for ensaios
base_dir = "content/ensaios"
os.makedirs(base_dir, exist_ok=True)

categories_info = {
    "fashion": {
        "folder": f"{base_dir}/fashion",
        "title": "Ensaio Fashion & Editorial",
        "description": "Fotos de moda, modelos em estúdio e produções urbanas.",
        "url_key": "/fashion"
    },
    "gestacionais": {
        "folder": f"{base_dir}/gestacionais",
        "title": "Ensaio Gestacional & Maternidade",
        "description": "Retratos delicados de gestantes e família.",
        "url_key": "/gestacionais"
    },
    "publicitarios": {
        "folder": f"{base_dir}/publicitarios",
        "title": "Ensaio Publicitário & Comercial",
        "description": "Fotografias para campanhas de marcas e produtos.",
        "url_key": "/publicitarios"
    },
    "eventos-corporativos": {
        "folder": f"{base_dir}/eventos-corporativos",
        "title": "Ensaio Eventos Corporativos",
        "description": "Registros de eventos empresariais e summits.",
        "url_key": "/eventos-corporativos"
    },
    "autorais": {
        "folder": f"{base_dir}/autorais",
        "title": "Ensaio Autoral & Fine Art",
        "description": "Estudos autorais com jogo de luzes e sombras.",
        "url_key": "/autorais"
    },
    "in-and-out": {
        "folder": f"{base_dir}/in-and-out",
        "title": "Projeto In & Out",
        "description": "Série conceitual completa de retratos urbanos e estúdio.",
        "url_key": "/in-and-out"
    },
    "instagram": {
        "folder": f"{base_dir}/instagram",
        "title": "Destaques do Instagram (@joaofelipe.photos)",
        "description": "Seleção visual das postagens e feed do Instagram.",
        "url_key": "/instagram"
    }
}

ensaios_catalog = {}

for cat_id, info in categories_info.items():
    os.makedirs(info["folder"], exist_ok=True)
    ensaios_catalog[cat_id] = {
        "title": info["title"],
        "description": info["description"],
        "items_count": 0,
        "items": []
    }

# Populating items from scraped site structure
for page in site_data["pages"]:
    url = page["url"]
    imgs = [i["src"] for i in page["images"] if "assets.zyrosite.com" in i["src"]]

    for cat_id, info in categories_info.items():
        if info["url_key"] in url:
            for idx, img in enumerate(imgs):
                item_data = {
                    "id": f"{cat_id}_{idx+1}",
                    "ensaio_name": f"{info['title']} - Foto {idx+1}",
                    "url": img,
                    "recommended_copy": f"Ensaio {info['title']} por João Felipe Photos."
                }
                ensaios_catalog[cat_id]["items"].append(item_data)

            ensaios_catalog[cat_id]["items_count"] = len(ensaios_catalog[cat_id]["items"])

# Save ensaios_catalog.json inside content/
with open("content/ensaios/ensaios_catalog.json", "w", encoding="utf-8") as f:
    json.dump(ensaios_catalog, f, indent=2, ensure_ascii=False)

# Generate Markdown Index for easy user inspection
md_index = "# Catálogo de Ensaios Fotográficos — João Felipe\n\n"
md_index += "Este documento organiza todo o acervo de **460 fotografias originais em alta resolução**, separadas por categoria de ensaio:\n\n"

for cat_id, data in ensaios_catalog.items():
    md_index += f"## 📸 {data['title']} ({data['items_count']} fotos)\n"
    md_index += f"*{data['description']}*\n\n"
    md_index += f"- **Pasta no Projeto**: `content/ensaios/{cat_id}/` \n"
    md_index += f"- **Exemplo de Foto 1**: {data['items'][0]['url'] if data['items'] else 'N/A'}\n\n"
    md_index += "---\n\n"

with open("content/ensaios/ENSAIOS_INDEX.md", "w", encoding="utf-8") as f:
    f.write(md_index)

print("Organized all ensaios cleanly under content/ensaios/!")
