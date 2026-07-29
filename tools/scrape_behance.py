import urllib.request
import re
import json
import os

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "max-age=0",
    "Sec-Ch-Ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
}

# Create content folders
os.makedirs("content/behance", exist_ok=True)
os.makedirs("content/instagram", exist_ok=True)
os.makedirs("content/copy", exist_ok=True)

print("Fetching Behance initial profile state...")
url = "https://www.behance.net/joaofelipephotos"
req = urllib.request.Request(url, headers=HEADERS)

behance_data = {
    "profile": "João Felipe Photos",
    "url": url,
    "extracted_copy": [],
    "projects": []
}

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Look for initial state embedded JSON in script tag
        state_match = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.*?});</script>', html, re.DOTALL)
        if not state_match:
            state_match = re.search(r'window\.beConfig\s*=\s*({.*?});</script>', html, re.DOTALL)

        # Extract title and description meta tags
        titles = re.findall(r'<meta property="og:title" content="(.*?)"', html)
        descs = re.findall(r'<meta property="og:description" content="(.*?)"', html)
        imgs = re.findall(r'<meta property="og:image" content="(.*?)"', html)

        print("Found profile metadata:", titles, descs)

        if descs:
            behance_data["extracted_copy"].append({
                "source": "Behance Profile Bio",
                "copy": descs[0]
            })

except Exception as e:
    print(f"Error: {e}")

# Save JSON
with open("content/behance/behance_data.json", "w", encoding="utf-8") as f:
    json.dump(behance_data, f, indent=2, ensure_ascii=False)

print("Saved behance_data.json")
