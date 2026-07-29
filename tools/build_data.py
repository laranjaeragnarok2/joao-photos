import json

with open("site_structure.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

projects = []
id_counter = 1

page_category_map = {
    "https://joaofelipephotos.com/fashion": {"id": "fashion", "name": "Fashion & Editorial"},
    "https://joaofelipephotos.com/gestacionais": {"id": "gestacionais", "name": "Gestacionais"},
    "https://joaofelipephotos.com/publicitarios": {"id": "publicitarios", "name": "Publicitários"},
    "https://joaofelipephotos.com/eventos-corporativos": {"id": "eventos-corporativos", "name": "Eventos Corporativos"},
    "https://joaofelipephotos.com/autorais": {"id": "autorais", "name": "Autorais & Fine Art"},
    "https://joaofelipephotos.com/in-and-out": {"id": "in-and-out", "name": "Projeto In & Out"}
}

for page in site_data["pages"]:
    url = page["url"]
    if url in page_category_map:
        cat_info = page_category_map[url]
        imgs = [i["src"] for i in page["images"] if "assets.zyrosite.com" in i["src"]]
        
        for idx, src in enumerate(imgs):
            projects.append({
                "id": id_counter,
                "src": src,
                "categoryId": cat_info["id"],
                "categoryName": cat_info["name"],
                "title": f"{cat_info['name']} #{idx + 1}",
                "aspectRatio": "portrait" if (idx % 3 != 0) else "landscape"
            })
            id_counter += 1

js_output = f"""// Complete dataset extracted from joaofelipephotos.com
const PORTFOLIO_DATA = {{
    photographer: {{
        name: "João Felipe",
        role: "Fotógrafo de Moda, Editorial & Retratos",
        bio: "Com olhar apurado para composições marcantes, luz natural e direção editorial, João Felipe cria retratos e ensaios que capturam a essência e a sofisticação de marcas, modelos e momentos únicos.",
        location: "São Paulo, SP & Disponível para Projetos Globais",
        stats: [
            {{ label: "Ensaios Realizados", value: "+500" }},
            {{ label: "Anos de Experiência", value: "8+" }},
            {{ label: "Categorias de Atuação", value: "6" }}
        ],
        instagram: "https://www.instagram.com/joaofelipe.photos/",
        behance: "https://www.behance.net/joaofelipephotos",
        whatsapp: "5511999999999",
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
    items: {json.dumps(projects, indent=2, ensure_ascii=False)}
}};
"""

with open("js/portfolio_data.js", "w", encoding="utf-8") as f:
    f.write(js_output)

print(f"Generated portfolio_data.js with {len(projects)} total items!")
