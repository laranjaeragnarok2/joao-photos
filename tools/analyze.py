import json

with open("site_structure.json") as f:
    data = json.load(f)

print("=== PAGES FOUND ===")
for p in data["pages"]:
    headings = [h["text"] for h in p["headings"]]
    print(f"URL: {p['url']}\n  Title: {p['title']}\n  Headings: {headings}\n  Images count: {p['images_count']}")
    if p["sample_text"]:
        print(f"  Sample Text: {p['sample_text'][:5]}")
    print("-" * 50)

print("\n=== SOCIAL LINKS ===")
for s in data["social_links"]:
    print(s)

print("\n=== EXTERNAL LINKS ===")
for e in data["external_links"]:
    print(e)

print("\n=== TYPOGRAPHY ===")
print(data["typography"])

print("\n=== COLORS (SAMPLE) ===")
print(data["colors"][:20])
