import json
import urllib.request
import re
from html.parser import HTMLParser

urls = [
    "https://joaofelipephotos.com",
    "https://joaofelipephotos.com/in-and-out",
    "https://joaofelipephotos.com/galeria",
    "https://joaofelipephotos.com/fashion",
    "https://joaofelipephotos.com/autorais",
    "https://joaofelipephotos.com/publicitarios",
    "https://joaofelipephotos.com/gestacionais",
    "https://joaofelipephotos.com/eventos-corporativos",
    "https://joaofelipephotos.com/sobre-mim"
]

report = {}

class CustomParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texts = []
        self.imgs = []
        self.links = []
        self.in_script = False
        self.in_style = False

    def handle_starttag(self, tag, attrs):
        if tag in ["script", "style"]:
            self.in_script = True
        attr_dict = dict(attrs)
        if tag == "img" and "src" in attr_dict:
            self.imgs.append(attr_dict["src"])
        if tag == "a" and "href" in attr_dict:
            self.links.append((attr_dict["href"], attr_dict.get("title", "")))

    def handle_endtag(self, tag):
        if tag in ["script", "style"]:
            self.in_script = False

    def handle_data(self, data):
        if not self.in_script:
            t = data.strip()
            if t and not t.startswith('{') and not t.startswith('(') and not t.startswith(':root') and len(t) > 1:
                self.texts.append(t)

for url in urls:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
            title = title_match.group(1) if title_match else ""
            
            parser = CustomParser()
            parser.feed(html)
            
            page_name = url.replace("https://joaofelipephotos.com", "") or "/"
            report[page_name] = {
                "title": title,
                "image_count": len(parser.imgs),
                "images": parser.imgs[:10],
                "links": list(set([l[0] for l in parser.links])),
                "texts": parser.texts
            }
    except Exception as e:
        print(f"Error on {url}: {e}")

with open("detailed_report.json", "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print("Detailed extraction complete!")
