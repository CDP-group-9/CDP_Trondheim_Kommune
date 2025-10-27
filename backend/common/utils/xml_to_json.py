from bs4 import BeautifulSoup
import json

# Bruk raw string for filbanen
file_path = r"C:\Users\HUAWEI\tdt4290_kundestyrt\CDP_Trondheim_Kommune\backend\common\utils\lovdataxml\nl-20180622-083.xml"

# Les inn HTML-filen
with open(file_path, "r", encoding="utf-8") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, "html.parser")

# Hent metadata
metadata = {}
for dt, dd in zip(soup.select("dl.data-document-key-info dt"), soup.select("dl.data-document-key-info dd")):
    key = dt.get_text(strip=True)
    if dd.find("ul"):
        metadata[key] = [li.get_text(strip=True) for li in dd.select("li")]
    else:
        metadata[key] = dd.get_text(strip=True)

# Hent lovens innholdsfortegnelse
def parse_toc(ul):
    items = []
    for li in ul.find_all("li", recursive=False):
        item = {"title": li.contents[0].strip()}
        sub_ul = li.find("ul")
        if sub_ul:
            item["subsections"] = parse_toc(sub_ul)
        items.append(item)
    return items

toc_ul = soup.select_one("dd.table-of-contents > ul.tocTopUl")
table_of_contents = parse_toc(toc_ul) if toc_ul else []

# Hent lovtekst
articles = []
for legal_article in soup.select("article.legalArticle"):
    article_data = {
        "title": legal_article.get("data-name", ""),
        "url": legal_article.get("data-lovdata-url", ""),
        "paragraphs": []
    }
    for p in legal_article.select("article.legalP"):
        article_data["paragraphs"].append(p.get_text(strip=True))
    articles.append(article_data)


# Sett sammen alt i en JSON-struktur
lovdata_json = {
    "metadata": metadata,
    "table_of_contents": table_of_contents,
    "articles": articles
}

# Lag JSON-fil
with open("lovdata.json", "w", encoding="utf-8") as f:
    json.dump(lovdata_json, f, ensure_ascii=False, indent=2)

print("JSON-fil generert: lovdata.json")