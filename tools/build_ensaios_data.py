import json

with open("data/site_structure.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

EXCLUDE = ["mono-3", "logo", "favicon", "123-456", "millen", "capa-linkedin-2-grande", "placeholder", "icon", "5-m6L23o3xGQsbVJBb"]

categories = [
    { "id": "all", "name": "Todos os Ensaios" },
    { "id": "fashion", "name": "Fashion & Editorial" },
    { "id": "gestacionais", "name": "Gestacionais" },
    { "id": "publicitarios", "name": "Publicitários" },
    { "id": "eventos-corporativos", "name": "Eventos" },
    { "id": "autorais", "name": "Autorais & Fine Art" }
]

ensaios_dict = {
    "fashion": [
        {"id": "fashion_1", "title": "Editorial Moda Urbana", "category": "fashion", "categoryName": "Fashion & Editorial", "photos": []},
        {"id": "fashion_2", "title": "Coleção Inverno Conceitual", "category": "fashion", "categoryName": "Fashion & Editorial", "photos": []},
        {"id": "fashion_3", "title": "Retratos de Modelos Estúdio", "category": "fashion", "categoryName": "Fashion & Editorial", "photos": []}
    ],
    "gestacionais": [
        {"id": "gest_1", "title": "Ensaio Maternidade Luz Natural", "category": "gestacionais", "categoryName": "Gestacionais", "photos": []},
        {"id": "gest_2", "title": "Retratos Gestante Minimalista", "category": "gestacionais", "categoryName": "Gestacionais", "photos": []}
    ],
    "publicitarios": [
        {"id": "pub_1", "title": "Campanha Publicitária Marca", "category": "publicitarios", "categoryName": "Publicitários", "photos": []},
        {"id": "pub_2", "title": "Editorial Comercial Produtos", "category": "publicitarios", "categoryName": "Publicitários", "photos": []}
    ],
    "eventos-corporativos": [
        {"id": "evt_1", "title": "Summit & Convenção Empresarial", "category": "eventos-corporativos", "categoryName": "Eventos", "photos": []}
    ],
    "autorais": [
        {"id": "aut_1", "title": "Série Autoral Luz & Sombra", "category": "autorais", "categoryName": "Autorais & Fine Art", "photos": []},
        {"id": "aut_2", "title": "Estudo de Texturas & Formas", "category": "autorais", "categoryName": "Autorais & Fine Art", "photos": []}
    ]
}

all_items = []
id_counter = 1

for page in site_data["pages"]:
    url = page["url"]
    imgs = [i["src"] for i in page["images"] if "assets.zyrosite.com" in i["src"]]
    valid_imgs = [i for i in imgs if not any(ex in i.lower() for ex in EXCLUDE)]
    
    if not valid_imgs:
        continue

    if "/fashion" in url:
        target_cat = "fashion"
    elif "/gestacionais" in url:
        target_cat = "gestacionais"
    elif "/publicitarios" in url:
        target_cat = "publicitarios"
    elif "/eventos-corporativos" in url:
        target_cat = "eventos-corporativos"
    elif "/autorais" in url:
        target_cat = "autorais"
    else:
        target_cat = "fashion"

    album_list = ensaios_dict[target_cat]
    for idx, src in enumerate(valid_imgs):
        album = album_list[idx % len(album_list)]
        photo_item = {
            "id": id_counter,
            "src": src,
            "title": f"{album['title']} — Foto #{len(album['photos'])+1}",
            "categoryId": album["category"],
            "categoryName": album["categoryName"],
            "albumId": album["id"],
            "albumTitle": album["title"],
            "description": f"Fotografia integrante do {album['title']}.",
            "tags": [album["categoryName"], "João Felipe", "Editorial"]
        }
        album["photos"].append(photo_item)
        all_items.append(photo_item)
        id_counter += 1

ensaios_list = []
for cat, albums in ensaios_dict.items():
    for album in albums:
        if album["photos"]:
            album["cover"] = album["photos"][0]["src"]
            album["photoCount"] = len(album["photos"])
            ensaios_list.append(album)

full_data = {
    "photographer": {
        "name": "João Felipe",
        "role": "Fotógrafo de Moda, Editorial & Retratos Autorais",
        "location": "Rio Verde, GO • Atendimento Brasil & Global",
        "bio": "Com olhar apurado para a estética editorial, atuo na criação de imagens marcantes para marcas de moda, campanhas publicitárias, gestantes e retratos autorais. Cada projeto une rigor técnico na iluminação e sensibilidade artística.",
        "whatsapp": "5511999999999",
        "email": "contato@joaofelipephotos.com",
        "portrait": "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/Yle4978nxZCPJrgX/img-YNqqeVWexnFk3P73.jpg"
    },
    "categories": categories,
    "ensaios": ensaios_list,
    "clientGalleries": [
        {
            "code": "JOAO2026",
            "clientName": "Camila & Eduardo",
            "title": "Ensaio Casal & Maternidade 2026",
            "date": "15/05/2026",
            "downloadUrl": "https://drive.google.com",
            "photos": all_items[:12]
        },
        {
            "code": "GESTAO2026",
            "clientName": "Juliana & Renato",
            "title": "Ensaio Gestacional Exclusivo",
            "date": "10/06/2026",
            "downloadUrl": "https://drive.google.com",
            "photos": all_items[12:24]
        },
        {
            "code": "FASHION2026",
            "clientName": "Agência VOGUE Moda",
            "title": "Coleção Inverno Editorial",
            "date": "20/06/2026",
            "downloadUrl": "https://drive.google.com",
            "photos": all_items[24:36]
        }
    ],
    "testimonials": [
        {
            "name": "Camila Guimarães",
            "role": "Diretora de Moda & Estilo",
            "text": "O João tem uma direção de luz e olhar editorial impecáveis. As fotos da nossa nova coleção superaram todas as expectativas da marca."
        },
        {
            "name": "Juliana & Renato",
            "role": "Ensaio Gestacional",
            "text": "Sensibilidade única! Conseguimos guardar a fase da nossa gestação em retratos elegantes, delicados e cheios de significado."
        },
        {
            "name": "Marcos Vinícius",
            "role": "Produtor Executivo",
            "text": "Profissionalismo raro, entrega rápida das imagens tratadas e rigor técnico em todo o ensaio publicitário."
        }
    ],
    "items": all_items
}

js_output = f"const PORTFOLIO_DATA = {json.dumps(full_data, indent=4, ensure_ascii=False)};\n"

with open("js/portfolio_data.js", "w", encoding="utf-8") as f:
    f.write(js_output)

print(f"Generated clean dataset with {len(ensaios_list)} Ensaios and {len(full_data['clientGalleries'])} Client Galleries!")
