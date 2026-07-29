import urllib.request
import urllib.parse
import re
from html.parser import HTMLParser
import json
import os

BASE_URL = "https://joaofelipephotos.com"

visited = set()
to_visit = [BASE_URL]

site_structure = {
    "pages": [],
    "images": [],
    "social_links": [],
    "external_links": [],
    "typography": set(),
    "colors": set()
}

class PageParser(HTMLParser):
    def __init__(self, current_url):
        super().__init__()
        self.current_url = current_url
        self.links = []
        self.images = []
        self.title = ""
        self.headings = []
        self.in_title = False
        self.in_heading = False
        self.current_heading_tag = None
        self.current_heading_text = ""
        self.text_content = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag in ["h1", "h2", "h3", "h4", "h5", "h6"]:
            self.in_heading = True
            self.current_heading_tag = tag
            self.current_heading_text = ""
        elif tag == "a" and "href" in attr_dict:
            href = attr_dict["href"]
            full_url = urllib.parse.urljoin(self.current_url, href)
            self.links.append((full_url, attr_dict.get("title", "")))
        elif tag == "img" and "src" in attr_dict:
            src = attr_dict["src"]
            full_src = urllib.parse.urljoin(self.current_url, src)
            self.images.append({
                "src": full_src,
                "alt": attr_dict.get("alt", ""),
                "title": attr_dict.get("title", "")
            })

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag in ["h1", "h2", "h3", "h4", "h5", "h6"] and self.in_heading:
            self.headings.append({
                "tag": self.current_heading_tag,
                "text": self.current_heading_text.strip()
            })
            self.in_heading = False

    def handle_data(self, data):
        cleaned = data.strip()
        if self.in_title:
            self.title += data
        if self.in_heading:
            self.current_heading_text += data
        if cleaned and len(cleaned) > 2:
            self.text_content.append(cleaned)

def crawl():
    print(f"Starting crawl for {BASE_URL}...")
    while to_visit:
        url = to_visit.pop(0)
        # Normalize URL
        url_clean = url.split('#')[0].rstrip('/')
        if not url_clean:
            url_clean = BASE_URL
        
        if url_clean in visited:
            continue
        if not url_clean.startswith(BASE_URL):
            continue
            
        visited.add(url_clean)
        print(f"Fetching: {url_clean}")

        req = urllib.request.Request(
            url_clean,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"}
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                content_type = resp.headers.get('Content-Type', '')
                if 'text/html' not in content_type:
                    continue
                html = resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"Error fetching {url_clean}: {e}")
            continue

        parser = PageParser(url_clean)
        parser.feed(html)

        # Collect fonts and styles from inline or styles
        fonts = re.findall(r'font-family\s*:\s*([^;}"]+)', html, re.IGNORECASE)
        for f in fonts:
            site_structure["typography"].add(f.strip())

        colors = re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\([^)]+\)|hsl\([^)]+\)', html)
        for c in colors:
            site_structure["colors"].add(c.strip())

        page_data = {
            "url": url_clean,
            "title": parser.title.strip(),
            "headings": parser.headings,
            "images_count": len(parser.images),
            "images": parser.images,
            "sample_text": parser.text_content[:20]
        }
        site_structure["pages"].append(page_data)

        for img in parser.images:
            if img not in site_structure["images"]:
                site_structure["images"].append(img)

        for link, link_title in parser.links:
            link_clean = link.split('#')[0].rstrip('/')
            if link_clean.startswith(BASE_URL):
                if link_clean not in visited and link_clean not in to_visit:
                    to_visit.append(link_clean)
            elif any(s in link for s in ["instagram.com", "behance.net", "wa.me", "whatsapp.com", "facebook.com", "linkedin.com"]):
                if link not in site_structure["social_links"]:
                    site_structure["social_links"].append({"url": link, "title": link_title})
            else:
                if link not in site_structure["external_links"]:
                    site_structure["external_links"].append(link)

    # Convert sets to lists for JSON output
    site_structure["typography"] = list(site_structure["typography"])
    site_structure["colors"] = list(site_structure["colors"])

    with open("site_structure.json", "w", encoding="utf-8") as f:
        json.dump(site_structure, f, indent=2, ensure_ascii=False)

    print(f"Finished crawl. Found {len(site_structure['pages'])} pages, {len(site_structure['images'])} images.")

if __name__ == "__main__":
    crawl()
