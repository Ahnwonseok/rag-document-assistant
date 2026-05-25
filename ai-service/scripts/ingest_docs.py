"""CLI script to ingest documents from a folder into the RAG service."""

import argparse
import sys
from pathlib import Path

import httpx

INGEST_URL = "http://localhost:8000/api/ingest"
SUPPORTED_EXTENSIONS = {".md", ".txt"}


def ingest_file(filepath: Path, base_url: str) -> int:
    content = filepath.read_text(encoding="utf-8", errors="replace")
    payload = {
        "title": filepath.name,
        "content": content,
        "source": str(filepath),
    }

    response = httpx.post(base_url, json=payload, timeout=60.0)
    response.raise_for_status()
    data = response.json()
    return data["chunks_created"]


def main():
    parser = argparse.ArgumentParser(description="Ingest documents into the RAG service")
    parser.add_argument("folder", type=str, help="Path to folder containing documents")
    parser.add_argument(
        "--url", type=str, default=INGEST_URL, help="Ingest API URL"
    )
    args = parser.parse_args()

    folder = Path(args.folder)
    if not folder.is_dir():
        print(f"Error: '{folder}' is not a valid directory.")
        sys.exit(1)

    files = [f for f in folder.iterdir() if f.suffix.lower() in SUPPORTED_EXTENSIONS]

    if not files:
        print(f"No .md or .txt files found in '{folder}'.")
        sys.exit(0)

    print(f"Found {len(files)} file(s) to ingest.\n")
    total_chunks = 0

    for i, filepath in enumerate(files, 1):
        try:
            chunks = ingest_file(filepath, args.url)
            total_chunks += chunks
            print(f"[{i}/{len(files)}] {filepath.name} -> {chunks} chunks")
        except Exception as e:
            print(f"[{i}/{len(files)}] {filepath.name} -> FAILED: {e}")

    print(f"\nDone. Total chunks created: {total_chunks}")


if __name__ == "__main__":
    main()
