#!/usr/bin/env python3
"""
Catalog generator for EngineeringGuides.
Scans the 'Engineering guides' directory, extracts metadata,
determines discipline/category, tags, and generates public/guides.json.
"""

import os
import json
import re
from datetime import datetime

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDES_DIR = os.path.join(REPO_ROOT, "Engineering guides")
OUTPUT_FILE = os.path.join(REPO_ROOT, "public", "guides.json")

CATEGORIES = [
    {
        "id": "aerospace",
        "name": "Aerospace & Satellites",
        "icon": "Rocket",
        "color": "from-cyan-500 to-blue-600",
        "keywords": ["satellite", "space", "sky", "eavesdrop"]
    },
    {
        "id": "robotics-drones",
        "name": "Robotics & Drones",
        "icon": "Bot",
        "color": "from-amber-500 to-orange-600",
        "keywords": ["drone", "drones", "precision", "move with precision", "ohmie"]
    },
    {
        "id": "cs-ai",
        "name": "CS, AI & Machine Learning",
        "icon": "Cpu",
        "color": "from-purple-500 to-indigo-600",
        "keywords": ["cs", "ai", "ml", "think for themselves", "embodiment", "machine learning"]
    },
    {
        "id": "electronics",
        "name": "Electronics & Hardware",
        "icon": "Zap",
        "color": "from-yellow-500 to-amber-600",
        "keywords": ["electronics", "learn-electronics", "glow-up", "radio", "light", "read the body", "invisible", "survive"]
    },
    {
        "id": "career",
        "name": "Career & Portfolio",
        "icon": "Briefcase",
        "color": "from-emerald-500 to-teal-600",
        "keywords": ["portfolio", "recruiter", "overeducated", "guide engineers", "follow"]
    },
    {
        "id": "ee-general",
        "name": "Electrical Engineering",
        "icon": "Compass",
        "color": "from-blue-500 to-indigo-600",
        "keywords": ["ee", "engineering"]
    }
]

def format_size(num_bytes):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if num_bytes < 1024.0:
            return f"{num_bytes:.1f} {unit}" if unit != 'B' else f"{num_bytes} B"
        num_bytes /= 1024.0
    return f"{num_bytes:.1f} GB"

def clean_title(filename):
    name = os.path.splitext(filename)[0]
    
    part_match = re.match(r'^\((PART\s*\d+)\)\s*(.*)$', name, re.IGNORECASE)
    part_suffix = ""
    if part_match:
        part_suffix = f" ({part_match.group(1).title()})"
        name = part_match.group(2)
        
    name = name.replace('_', ' ').replace('-', ' ')
    name = re.sub(r'\s+', ' ', name).strip()
    
    # Capitalize appropriately
    words = name.split()
    capitalized = []
    lowercase_words = {'that', 'for', 'the', 'a', 'an', 'and', 'in', 'on', 'with', 'from', 'to', 'at', 'of'}
    for i, w in enumerate(words):
        if i == 0 or w.lower() not in lowercase_words or w.upper() in ['EE', 'CS', 'AI', 'ML', 'ME']:
            if w.upper() in ['EE', 'CS', 'AI', 'ML', 'ME', 'PART2']:
                capitalized.append(w.upper())
            else:
                capitalized.append(w.capitalize())
        else:
            capitalized.append(w.lower())
            
    result = " ".join(capitalized) + part_suffix
    return result

def detect_category(filename, title):
    text = (filename + " " + title).lower()
    
    for cat in CATEGORIES:
        for kw in cat["keywords"]:
            if kw in text:
                return cat["id"]
                
    return "ee-general"

def generate_tags(filename, title, category_id):
    tags = set()
    text = (filename + " " + title).lower()
    
    if "satellite" in text or "space" in text:
        tags.add("Satellites")
        tags.add("Aerospace")
    if "drone" in text:
        tags.add("Drones")
        tags.add("UAV")
    if "precision" in text or "move" in text:
        tags.add("Motion Control")
        tags.add("Motors")
    if "radio" in text or "rf" in text:
        tags.add("RF & SDR")
        tags.add("Wireless")
    if "light" in text or "optics" in text:
        tags.add("Photonics")
        tags.add("Optics")
    if "body" in text or "bio" in text:
        tags.add("Bioelectronics")
        tags.add("Sensors")
    if "invisible" in text:
        tags.add("Sensors")
        tags.add("Radar/IR")
    if "ai" in text or "embodiment" in text or "ml" in text:
        tags.add("Embedded AI")
        tags.add("Machine Learning")
    if "portfolio" in text:
        tags.add("Portfolio")
        tags.add("Career")
    if "defense" in text:
        tags.add("Defense Tech")
    if "electronics" in text or "glow up" in text:
        tags.add("Fundamentals")
        tags.add("Circuits")
    if "ohmie" in text:
        tags.add("Robotics")
        tags.add("DIY Build")
    if "cs" in text:
        tags.add("Software")
        
    if not tags:
        tags.add("Engineering")
        
    return sorted(list(tags))

def build_catalog():
    if not os.path.exists(GUIDES_DIR):
        print(f"Error: Directory not found: {GUIDES_DIR}")
        return
        
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    files = [f for f in os.listdir(GUIDES_DIR) if f.lower().endswith(".pdf")]
    files.sort()
    
    guides = []
    
    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(GUIDES_DIR, filename)
        stats = os.stat(filepath)
        title = clean_title(filename)
        category_id = detect_category(filename, title)
        tags = generate_tags(filename, title, category_id)
        
        guide = {
            "id": f"guide-{idx:03d}",
            "filename": filename,
            "title": title,
            "relativePath": f"Engineering guides/{filename}",
            "sizeBytes": stats.st_size,
            "sizeFormatted": format_size(stats.st_size),
            "categoryId": category_id,
            "tags": tags,
            "lastModified": datetime.fromtimestamp(stats.st_mtime).isoformat()
        }
        guides.append(guide)
        
    result = {
        "generatedAt": datetime.now().isoformat(),
        "totalGuides": len(guides),
        "totalSizeBytes": sum(g["sizeBytes"] for g in guides),
        "totalSizeFormatted": format_size(sum(g["sizeBytes"] for g in guides)),
        "categories": CATEGORIES,
        "guides": guides
    }
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        
    print(f"Catalog successfully generated at {OUTPUT_FILE}")
    print(f"Total guides indexed: {len(guides)}")

if __name__ == "__main__":
    build_catalog()
