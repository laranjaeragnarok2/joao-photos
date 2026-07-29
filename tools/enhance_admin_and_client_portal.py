import json
import re

with open("js/portfolio_data.js", "r", encoding="utf-8") as f:
    js_text = f.read()

# Match the JSON object using regex
match = re.search(r'const PORTFOLIO_DATA = ({.*?});$', js_text, re.DOTALL)
if match:
    json_str = match.group(1)
    data = json.loads(json_str)

    data["clientGalleries"] = [
        {
            "code": "JOAO2026",
            "clientName": "Camila & Eduardo",
            "title": "Ensaio Casal & Maternidade 2026",
            "date": "15/05/2026",
            "downloadUrl": "https://drive.google.com",
            "photos": data["items"][:12]
        },
        {
            "code": "GESTAO2026",
            "clientName": "Juliana & Renato",
            "title": "Ensaio Gestacional Exclusivo",
            "date": "10/06/2026",
            "downloadUrl": "https://drive.google.com",
            "photos": data["items"][12:24]
        },
        {
            "code": "FASHION2026",
            "clientName": "Agência VOGUE Moda",
            "title": "Coleção Inverno Editorial",
            "date": "20/06/2026",
            "downloadUrl": "https://drive.google.com",
            "photos": data["items"][24:36]
        }
    ]

    js_output = f"// Structured Ensaios & Client Galleries dataset\nconst PORTFOLIO_DATA = {json.dumps(data, indent=2, ensure_ascii=False)};\n"

    with open("js/portfolio_data.js", "w", encoding="utf-8") as f:
        f.write(js_output)

    print("Added private clientGalleries to portfolio_data.js!")
else:
    print("Could not match PORTFOLIO_DATA")
