import json

with open("data/site_structure.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

print("=== INSPECTING PHOTO ASSETS ===")
for page in site_data["pages"]:
    url = page["url"]
    imgs = [i["src"] for i in page["images"] if "assets.zyrosite.com" in i["src"]]
    print(f"Page: {url} | Count: {len(imgs)}")
    if imgs:
        print("  Sample 1:", imgs[0])
        if len(imgs) > 1:
            print("  Sample 2:", imgs[1])
    print("-" * 50)
