import urllib.request
import re
import json
import os

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
}

url = "https://www.instagram.com/joaofelipe.photos/"
os.makedirs("content/instagram", exist_ok=True)
os.makedirs("content/copy", exist_ok=True)

print(f"Fetching Instagram metadata for {url}...")
req = urllib.request.Request(url, headers=HEADERS)

ig_data = {
    "url": url,
    "handle": "joaofelipe.photos",
    "meta_title": "",
    "meta_description": "",
    "extracted_copy": []
}

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
        title_match = re.search(r'<meta property="og:title" content="(.*?)"', html)
        if title_match:
            ig_data["meta_title"] = title_match.group(1)
            
        desc_match = re.search(r'<meta property="og:description" content="(.*?)"', html)
        if not desc_match:
            desc_match = re.search(r'<meta name="description" content="(.*?)"', html)
            
        if desc_match:
            ig_data["meta_description"] = desc_match.group(1)
            ig_data["extracted_copy"].append({
                "source": "Instagram Bio & Stats",
                "copy": desc_match.group(1)
            })

except Exception as e:
    print(f"Error fetching Instagram: {e}")

with open("content/instagram/instagram_data.json", "w", encoding="utf-8") as f:
    json.dump(ig_data, f, indent=2, ensure_ascii=False)

print("Saved instagram_data.json:", ig_data)
