#!/usr/bin/env python3
"""
Sync script for Google Drive.
Supports:
1. Local sync: copies PDFs from a local Google Drive folder path to 'Engineering guides/'.
2. Cloud sync (GitHub Actions): queries Google Drive API using GDRIVE_FOLDER_ID.
"""

import os
import sys
import shutil
import argparse

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST_DIR = os.path.join(REPO_ROOT, "Engineering guides")

def sync_local_folder(src_folder):
    """Sync from a local directory (e.g. Google Drive Desktop mount on Windows)."""
    if not os.path.exists(src_folder):
        print(f"Error: Source directory '{src_folder}' not found.")
        return 0

    os.makedirs(DEST_DIR, exist_ok=True)
    existing_files = {f.lower() for f in os.listdir(DEST_DIR)}
    added = 0

    for item in os.listdir(src_folder):
        if item.lower().endswith(".pdf"):
            if item.lower() not in existing_files:
                src_path = os.path.join(src_folder, item)
                dest_path = os.path.join(DEST_DIR, item)
                print(f"[+] Copying new guide: {item}")
                shutil.copy2(src_path, dest_path)
                added += 1
            else:
                print(f"[-] Already exists: {item}")

    print(f"\nLocal sync complete. Added {added} new PDF(s).")
    return added

def sync_remote_gdrive(folder_id, api_key=None, service_account_json=None):
    """Sync from Google Drive using Google Drive API."""
    try:
        import requests
    except ImportError:
        print("Please install requests: pip install requests")
        return 0

    if not folder_id:
        print("Warning: GDRIVE_FOLDER_ID is not configured. Skipping remote Google Drive sync.")
        return 0

    print(f"Checking Google Drive folder ID: {folder_id}...")

    # If Service Account JSON is provided in env
    if service_account_json:
        try:
            from google.oauth2 import service_account
            from googleapiclient.discovery import build
            import json

            info = json.loads(service_account_json)
            creds = service_account.Credentials.from_service_account_info(
                info, scopes=['https://www.googleapis.com/auth/drive.readonly']
            )
            service = build('drive', 'v3', credentials=creds)

            query = f"'{folder_id}' in parents and mimeType = 'application/pdf' and trashed = false"
            results = service.files().list(q=query, fields="files(id, name, size)").execute()
            items = results.get('files', [])

            existing = {f.lower() for f in os.listdir(DEST_DIR)}
            added = 0

            for item in items:
                filename = item['name']
                if filename.lower() not in existing:
                    print(f"[+] Downloading new guide from Drive: {filename}")
                    request = service.files().get_media(fileId=item['id'])
                    dest_file = os.path.join(DEST_DIR, filename)
                    with open(dest_file, 'wb') as f:
                        f.write(request.execute())
                    added += 1

            print(f"Drive API sync finished: {added} new file(s) added.")
            return added
        except Exception as e:
            print(f"Service account sync error: {e}")

    # Fallback with API Key for public/shared folders
    if api_key:
        try:
            url = f"https://www.googleapis.com/drive/v3/files?q='{folder_id}'+in+parents+and+trashed=false&key={api_key}&fields=files(id,name,size,mimeType)"
            res = requests.get(url)
            data = res.json()
            if 'files' in data:
                existing = {f.lower() for f in os.listdir(DEST_DIR)}
                added = 0
                for item in data['files']:
                    if item.get('mimeType') == 'application/pdf' or item.get('name', '').lower().endswith('.pdf'):
                        filename = item['name']
                        if filename.lower() not in existing:
                            print(f"[+] Downloading: {filename}")
                            download_url = f"https://www.googleapis.com/drive/v3/files/{item['id']}?alt=media&key={api_key}"
                            file_res = requests.get(download_url)
                            dest_file = os.path.join(DEST_DIR, filename)
                            with open(dest_file, 'wb') as f:
                                f.write(file_res.content)
                            added += 1
                print(f"Public API sync finished: {added} new file(s) added.")
                return added
            else:
                print(f"Drive API response: {data}")
        except Exception as e:
            print(f"Public API sync error: {e}")

    print("No valid credentials or direct access available. To configure:")
    print("1. Set GDRIVE_FOLDER_ID and GDRIVE_SERVICE_ACCOUNT (or GDRIVE_API_KEY) in GitHub Secrets.")
    print("2. Or run locally: python scripts/sync_gdrive.py --local-dir \"C:\\Users\\...\\Google Drive\\EngineeringGuides\"")
    return 0

def main():
    parser = argparse.ArgumentParser(description="Sync PDF guides from Google Drive.")
    parser.add_argument("--local-dir", help="Path to local Google Drive folder on disk")
    args = parser.parse_args()

    if args.local_dir:
        sync_local_folder(args.local_dir)
        return

    folder_id = os.environ.get("GDRIVE_FOLDER_ID")
    api_key = os.environ.get("GDRIVE_API_KEY")
    service_account = os.environ.get("GDRIVE_SERVICE_ACCOUNT")

    if folder_id:
        sync_remote_gdrive(folder_id, api_key, service_account)
    else:
        print("Usage:")
        print("  python scripts/sync_gdrive.py --local-dir \"<path-to-gdrive-folder>\"")
        print("Or set environment variable GDRIVE_FOLDER_ID")

if __name__ == "__main__":
    main()
