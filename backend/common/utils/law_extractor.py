import os
import re
import requests
import tarfile
from typing import List, Set

# Base url for lovdata
BASE_URL = "https://api.lovdata.no/v1/publicData"

# List of laws for insertion in db
standard_format_laws: List[str] = [
    "LOV-2018-06-15-038",
    "LOV-2000-04-14-031",
    "LOV-2006-05-19-016",
    "LOV-1967-02-010",
    "LOV-2014-06-20-043",
    "LOV-2008-06-20-044",
    "LOV-2001-06-15-081",
    "LOV-1992-12-04-126",
    "LOV-2018-06-01-024",
    "FOR-2011-08-22-894",
    "FOR-2021-12-17-3843",
    "LOV-2016-12-09-088",
    "LOV-2010-05-28-016",
    "LOV-1998-07-17-061",
    "LOV-2005-04-01-015",
    "LOV-1997-02-28-019",
    "LOV-2006-06-16-020",
    "LOV-2018-06-22-083",
]

# Convert standard format laws into Lovdata API filenames
def format_laws_to_lovdata_format(laws: List[str]) -> Set[str]:
    api_formatted_laws: Set[str] = set()
    for law in laws:
        parts = law.split("-")
        if len(parts) < 4:
            raise ValueError(f"Illegal law/paragraph-format: {law}")

        # Determine prefix based on law type
        if parts[0] == "LOV":
            formatted_law = "nl-"
        elif parts[0] == "FOR":
            formatted_law = "sf-"
        else:
            raise ValueError(f"Unknown value (need to be LOV or FOR): {law}")

        formatted_law += f"{parts[1]}{parts[2]}{parts[3]}"

        if len(parts) > 4:
            if parts[0] == "LOV":
                formatted_law += f"-{parts[4].zfill(3)}"
            elif parts[0] == "FOR":
                formatted_law += f"-{parts[4].zfill(4)}"

        formatted_law += ".xml"
        api_formatted_laws.add(formatted_law)

    return api_formatted_laws

# Get a list of all public files from Lovdata API
def list_public_files(timeout: float = 30.0):
    url = f"{BASE_URL}/list"
    r = requests.get(url, headers={"accept": "application/json"}, timeout=timeout)
    r.raise_for_status()
    data = r.json()
    return [item for item in data if isinstance(item, dict) and "filename" in item]

# Download a specific file from Lovdata API
def download_lovdata_file(filename: str, out_dir: str = "lovdataxml", timeout: float = 180.0):
    if not re.fullmatch(r"[A-Za-z0-9._-]+\.(zip|tar\.bz2)", filename):
        raise ValueError(f"Illegal filename: {filename}")

    os.makedirs(out_dir, exist_ok=True)
    url = f"{BASE_URL}/get/download"
    params = {"filename": filename}

    # Stream download to local file
    with requests.get(url, params=params, stream=True, timeout=timeout) as r:
        r.raise_for_status()
        file_path = os.path.join(out_dir, filename)
        with open(file_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
    return file_path

# Extract selected files from a tar.bz2 archive
def extract_selected_files(file_path: str, selected_filenames: Set[str], extract_to: str):
    os.makedirs(extract_to, exist_ok=True)
    with tarfile.open(file_path, "r:bz2") as tar:
        count = 0
        for m in tar.getmembers():
            name = os.path.basename(m.name)
            if name in selected_filenames and m.isfile():
                extracted_file = tar.extractfile(m)
                if extracted_file:
                    out_path = os.path.join(extract_to, name)
                    with open(out_path, "wb") as f_out:
                        f_out.write(extracted_file.read())
                    count += 1

# Fetch and extract all desired laws from Lovdata
def fetch_lovdata_laws(standard_format_laws: List[str], out_dir: str, show_progress=False):
    print("Looking for laws ...")
    os.makedirs(out_dir, exist_ok=True)

    wanted_files = format_laws_to_lovdata_format(standard_format_laws)
    files = list_public_files()

    for item in files:
        filename = item["filename"]
        if filename.endswith(".tar.bz2"):
            file_path = os.path.join(out_dir, filename)
            if not os.path.exists(file_path):
                download_lovdata_file(filename, out_dir=out_dir)

            extract_selected_files(file_path, wanted_files, extract_to=out_dir)
            os.remove(file_path)
    
    available_filenames = set(f for f in os.listdir(out_dir) if f in wanted_files)
    missing = wanted_files - available_filenames

    print(f" Found {len(available_filenames)} of {len(wanted_files)} wanted files.")
    if missing:
        print(" These files were not found:")
        for name in sorted(missing):
            print(f"  - {name}")
