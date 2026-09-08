#!/usr/bin/env python3
"""Embed the publish shell into index.html as a compressed base64 ZIP."""

from __future__ import annotations

import base64
import io
import re
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "publish"
INDEX = PUB / "index.html"
START = "<!-- UMI_EMBEDDED_SHELL_START -->"
END = "<!-- UMI_EMBEDDED_SHELL_END -->"


def shell_files() -> list[Path]:
    files: list[Path] = [PUB / "asset-cdn.js", PUB / "translations.json"]
    for folder in ("js", "data", "img/system", "fonts"):
        files.extend(path for path in (PUB / folder).rglob("*") if path.is_file())
    return sorted(set(files))


def make_pack(files: list[Path]) -> str:
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            key = path.relative_to(PUB).as_posix()
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
    block = (
        f"{START}\n"
        f"<style id=\"umi-embedded-style\">\n{css}\n</style>\n"
        f"<script id=\"umi-embedded-jszip\">\n{jszip}\n</script>\n"
        f"<script id=\"umi-shell-pack\" type=\"application/octet-stream\">"
        f"{payload}</script>\n"
        f"{END}\n"
    )
    marker = "<!-- UMI_BOOTSTRAP_START -->"
    if marker not in html:
        raise SystemExit("missing UMI_BOOTSTRAP_START marker")
    html = html.replace(marker, block + marker, 1)
    html = "\n".join(line.rstrip() for line in html.splitlines()) + "\n"
    INDEX.write_text(html, encoding="utf-8")
    size_mb = INDEX.stat().st_size / 1024 / 1024
    print(f"embedded {len(shell_files())} files; index.html={size_mb:.1f}MB")


if __name__ == "__main__":
    main()
