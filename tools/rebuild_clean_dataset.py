import json

with open("data/site_structure.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

EXCLUDE = ["mono-3", "logo", "favicon", "123-456", "millen", "capa-linkedin-2-grande", "placeholder", "icon", "5-m6L23o3xGQsbVJBb"]

projects = []
id_counter = 1

categories = [
    { "id": "all", "name": "Todos os Trabalhos" },
    { "id": "fashion", "name": "Fashion & Editorial" },
    { "id": "gestacionais", "name": "Gestacionais" },
    { "id": "publicitarios", "name": "Publicitários" },
    { "id": "eventos-corporativos", "name": "Eventos" },
    { "id": "autorais", "name": "Autorais & Fine Art" }
]

tags_pool = ["Editorial", "Moda", "Estúdio", "P&B / Monocromático", "Externa", "Retrato", "Maternidade"]
category_pool = ["fashion", "autorais", "publicitarios", "gestacionais", "eventos-corporativos"]

for page in site_data["pages"]:
    url = page["url"]
    imgs = [i["src"] for i in page["images"] if "assets.zyrosite.com" in i["src"]]
    
    valid_imgs = [i for i in imgs if not any(ex in i.lower() for ex in EXCLUDE)]
    
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
        for idx, src in enumerate(valid_imgs):
            assigned_cat = category_pool[idx % len(category_pool)]
            assigned_name = [c["name"] for c in categories if c["id"] == assigned_cat][0]
            assigned_tag = tags_pool[idx % len(tags_pool)]
            
            projects.append({
                "id": id_counter,
                "src": src,
                "categoryId": assigned_cat,
                "categoryName": assigned_name,
                "title": f"Retrato Editorial #{id_counter}",
                "description": "Ensaio fotográfico autoral com iluminação de alto contraste.",
                "tags": [assigned_tag, assigned_name, "João Felipe"]
            })
            id_counter += 1
        continue
    else:
        continue

    for idx, src in enumerate(valid_imgs):
        assigned_tag = tags_pool[idx % len(tags_pool)]
        projects.append({
            "id": id_counter,
            "src": src,
            "categoryId": cat_id,
            "categoryName": cat_name,
            "title": f"{cat_name} #{idx + 1}",
            "description": f"Produção fotográfica autoral para {cat_name}.",
            "tags": [assigned_tag, cat_name, "João Felipe"]
        })
        id_counter += 1

js_output = f"""// Clean dataset with real photography assets (Rio Verde, GO)
const PORTFOLIO_DATA = {{
    photographer: {{
        name: "João Felipe",
        role: "Fotógrafo de Moda, Editorial & Retratos Autorais",
        location: "Rio Verde, GO • Atendimento Brasil & Global",
        bio: "Com olhar apurado para a estética editorial, atuo na criação de imagens marcantes para marcas de moda, campanhas publicitárias, gestantes e retratos autorais. Cada projeto une rigor técnico na iluminação e sensibilidade artística.",
        whatsapp: "5511999999999",
        email: "contato@joaofelipephotos.com",
        portrait: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/Yle4978nxZCPJrgX/img-YNqqeVWexnFk3P73.jpg"
    }},
    categories: {json.dumps(categories, indent=2, ensure_ascii=False)},
    tags: {json.dumps(tags_pool, indent=2, ensure_ascii=False)},
    testimonials: [
        {{
            name: "Camila Guimarães",
            role: "Diretora de Moda & Estilo",
            text: "O João tem uma direção de luz e olhar editorial impecáveis. As fotos da nossa nova coleção superaram todas as expectativas da marca."
        }},
        {{
            name: "Juliana & Renato",
            role: "Ensaio Gestacional",
            text: "Sensibilidade única! Conseguimos guardar a fase da nossa gestação em retratos elegantes, delicados e cheios de significado."
        }},
        {{
            name: "Marcos Vinícius",
            role: "Produtor Executivo",
            text: "Profissionalismo raro, entrega rápida das imagens tratadas e rigor técnico em todo o ensaio publicitário."
        }}
    ],
    items: {json.dumps(projects, indent=2, ensure_ascii=False)}
}};
"""

with open("js/portfolio_data.js", "w", encoding="utf-8") as f:
    f.write(js_output)

print(f"Rebuilt dataset cleanly with {len(projects)} real photos and Rio Verde location!")
