#!/usr/bin/env python3
"""Embed the publish shell into index.html as a compressed base64 ZIP."""

from __future__ import annotations

import base64
import binascii
import io
import re
import struct
import zipfile
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "publish"
INDEX = PUB / "index.html"
START = "<!-- UMI_EMBEDDED_SHELL_START -->"
END = "<!-- UMI_EMBEDDED_SHELL_END -->"
EXCLUDED = {
    "translations.json",
    "js/main.js",
    "js/libs/jszip.min.js",
    "js/libs/effekseer.min.js",
    "js/libs/effekseer.wasm",
    "js/libs/vorbisdecoder.js",
    "js/plugins/KMS_DebugUtil.js",
    "js/plugins/OptionalJsonTranslation.js",
}
PLACEHOLDER_IMAGES = {
    "img/system/IconSet.png",
    "img/system/GameOver.png",
    "img/system/States.png",
}


def shell_files() -> list[Path]:
    files: list[Path] = [PUB / "asset-cdn.js"]
    for folder in ("js", "data", "img/system"):
        files.extend(path for path in (PUB / folder).rglob("*") if path.is_file())
    return sorted(
        path
        for path in set(files)
        if path.relative_to(PUB).as_posix() not in EXCLUDED
    )


def png_chunk(kind: bytes, payload: bytes) -> bytes:
    return (
        struct.pack(">I", len(payload))
        + kind
        + payload
        + struct.pack(">I", binascii.crc32(kind + payload) & 0xFFFFFFFF)
    )


def transparent_png(source: Path) -> bytes:
    raw = source.read_bytes()
    width, height = struct.unpack(">II", raw[16:24])
    rows = (b"\x00" + b"\x00" * (width * 4)) * height
    return (
        b"\x89PNG\r\n\x1a\n"
        + png_chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + png_chunk(b"IDAT", zlib.compress(rows, 9))
        + png_chunk(b"IEND", b"")
    )


def make_pack(files: list[Path]) -> str:
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            key = path.relative_to(PUB).as_posix()
            if key in PLACEHOLDER_IMAGES:
                archive.writestr(key, transparent_png(path))
            else:
                archive.write(path, key)
    return base64.b64encode(output.getvalue()).decode("ascii")


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    html = re.sub(
        re.escape(START) + r".*?" + re.escape(END),
        "",
        html,
        flags=re.DOTALL,
    )
    css = "\n".join(
        line.rstrip()
        for line in (PUB / "css/game.css").read_text(encoding="utf-8").splitlines()
    )
    html = re.sub(
        r'\s*<link rel="stylesheet" type="text/css" href="\./css/game\.css">\s*',
        "\n",
        html,
        count=1,
    )
    jszip = (PUB / "js/libs/jszip.min.js").read_text(encoding="utf-8")
    jszip = re.sub(r"</script", r"<\\/script", jszip, flags=re.IGNORECASE)
    payload = make_pack(shell_files())
    chunks = [payload[i : i + 131072] for i in range(0, len(payload), 131072)]
    chunk_nodes = "\n".join(
        '<script class="umi-shell-chunk" type="application/octet-stream">'
        f"{chunk}</script>"
        for chunk in chunks
    )
    block = (
        f"{START}\n"
        f"<style id=\"umi-embedded-style\">\n{css}\n</style>\n"
        f"<script id=\"umi-embedded-jszip\">\n{jszip}\n</script>\n"
        f"{chunk_nodes}\n"
        f"{END}\n"
    )
    marker = "<!-- UMI_PAYLOAD_SLOT -->"
    if marker not in html:
        raise SystemExit("missing UMI_PAYLOAD_SLOT marker")
    html = html.replace(marker, block + marker, 1)
    html = "\n".join(line.rstrip() for line in html.splitlines()) + "\n"
    INDEX.write_text(html, encoding="utf-8")
    size_mb = INDEX.stat().st_size / 1024 / 1024
    print(f"embedded {len(shell_files())} files; index.html={size_mb:.1f}MB")


if __name__ == "__main__":
    main()
