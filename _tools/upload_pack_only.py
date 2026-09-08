# -*- coding: utf-8 -*-
"""Upload umi-no-ie/game-pack.zip via yodu R2 credentials (no container sync)."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WS = Path(r"d:\云端本地开发")
ZIP = WS / "游戏" / "海之家" / "备份" / "game-pack.zip"
# fallback: publish local test zip
ZIP_FALLBACK = WS / "游戏" / "海之家-dzmm" / "publish" / "game-pack.zip"
ENV = WS / ".env"
BUCKET = "yodu"
KEY = f"{BUCKET}/umi-no-ie/game-pack.zip"
PUBLIC = "https://pub-db5421ea70f04d5e8caa7e9a211e381c.r2.dev/umi-no-ie/game-pack.zip"


def load_env():
    data = {}
    for line in ENV.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        data[k.strip()] = v.strip().strip('"').strip("'")
    token = data.get("yodu_api_key") or ""
    account = data.get("yodu_id") or ""
    if not token or not account:
        raise SystemExit("missing yodu_api_key / yodu_id in .env")
    return token, account


def main() -> None:
    zip_path = ZIP if ZIP.is_file() else ZIP_FALLBACK
    if not zip_path.is_file():
        raise SystemExit(f"missing {ZIP} (or {ZIP_FALLBACK})")
    token, account = load_env()
    env = os.environ.copy()
    env["CLOUDFLARE_API_TOKEN"] = token
    env["CLOUDFLARE_ACCOUNT_ID"] = account
    env["CI"] = "1"
    q_file = str(zip_path).replace('"', '\\"')
    cmdline = (
        f'npx.cmd --yes wrangler r2 object put "{KEY}" '
        f'--file "{q_file}" --content-type "application/zip" '
        f'--cache-control "public, max-age=31536000, immutable" --remote'
    )
    mb = zip_path.stat().st_size / 1024 / 1024
    print(f"upload {mb:.1f}MB -> {KEY} (yodu {account[:8]}…)", flush=True)
    r = subprocess.run(
        cmdline,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=600,
        shell=True,
    )
    if r.returncode != 0:
        print(r.stderr or r.stdout)
        raise SystemExit(1)
    print("ok", PUBLIC, flush=True)
    print("未推容器（按你要求）。", flush=True)


if __name__ == "__main__":
    main()
