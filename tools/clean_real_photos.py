import json
import re

with open("data/site_structure.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

# Exclude logos and template static graphics
EXCLUDE_TERMS = [
    "mono-3", "logo", "favicon", "123-456", "millen", "capa-linkedin-2-grande",
    "placeholder", "icon", "5-m6L23o3xGQsbVJBb"
]

clean_photos_by_category = {
    "fashion": [],
    "gestacionais": [],
    "publicitarios": [],
    "eventos-corporativos": [],
    "autorais": []
}

for page in site_data["pages"]:
    url = page["url"]
    imgs = [i["src"] for i in page["images"] if "assets.zyrosite.com" in i["src"]]
    
    valid_imgs = []
    for img in imgs:
        if not any(ex in img.lower() for ex in EXCLUDE_TERMS):
            valid_imgs.append(img)
            
    print(f"Page: {url} | Raw: {len(imgs)} | Real Photos: {len(valid_imgs)}")
    if valid_imgs:
        print("  Sample Real Photo 1:", valid_imgs[0])
        if len(valid_imgs) > 1:
            print("  Sample Real Photo 2:", valid_imgs[1])
    print("-" * 50)
