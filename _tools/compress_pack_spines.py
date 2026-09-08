# -*- coding: utf-8 -*-
"""Compress spine + pack images, rebuild game-pack.zip (incl. spines), thin shell."""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WS = Path(r"d:\云端本地开发")
SRC = WS / "游戏" / "海之家"
DST = WS / "游戏" / "海之家-dzmm"
PUB = DST / "publish"
# 临时压缩目录放在源盘备份下，避免撑大壳工程
WORK = SRC / "备份" / "_pack_work"
PNGQUANT = DST / "_tools" / "pngquant-dist" / "pngquant" / "pngquant.exe"
CACHE_TAG = "umi260908h"

# shell keeps only Boot essentials
SHELL_LOCAL = ("img/system/", "fonts/")
# everything else under img/audio goes into pack (incl. spines)
PACK_ROOTS = ("img", "audio")
STORE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".ogg", ".m4a", ".mp3", ".wav"}


def run_pngquant(src: Path, dst: Path) -> bool:
    dst.parent.mkdir(parents=True, exist_ok=True)
    # pngquant refuses overwrite same path sometimes — write temp then replace
    tmp = dst.with_suffix(dst.suffix + ".qtmp.png")
    if tmp.exists():
        tmp.unlink()
    cmd = [
        str(PNGQUANT),
        "--quality=55-80",
        "--speed=1",
        "--force",
        "--output",
        str(tmp),
        str(src),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode not in (0, 99):  # 99 = quality gate miss but may still write
        # fallback copy original
        if tmp.exists():
            tmp.unlink()
        shutil.copy2(src, dst)
        return False
    if not tmp.exists():
        shutil.copy2(src, dst)
        return False
    # keep smaller
    if tmp.stat().st_size < src.stat().st_size:
        if dst.exists():
            dst.unlink()
        tmp.replace(dst)
        return True
    tmp.unlink(missing_ok=True)
    shutil.copy2(src, dst)
    return False


def minify_json(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    try:
        data = json.loads(src.read_text(encoding="utf-8"))
        raw = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        if len(raw) < src.stat().st_size:
            dst.write_bytes(raw)
            return
    except Exception:
        pass
    shutil.copy2(src, dst)


def prepare_work() -> list[tuple[Path, str]]:
    if WORK.exists():
        shutil.rmtree(WORK)
    WORK.mkdir(parents=True)
    files: list[tuple[Path, str]] = []
    png_in = png_out = 0
    png_saved = 0
    json_saved = 0
    for root in PACK_ROOTS:
        base = SRC / root
        if not base.is_dir():
            continue
        for f in base.rglob("*"):
            if not f.is_file():
                continue
            if f.name.endswith(".ja.png"):
                continue
            rel = f.relative_to(SRC).as_posix()
            if any(rel.startswith(p) for p in SHELL_LOCAL):
                continue
            out = WORK / rel
            out.parent.mkdir(parents=True, exist_ok=True)
            ext = f.suffix.lower()
            if ext == ".png":
                png_in += f.stat().st_size
                ok = run_pngquant(f, out)
                png_out += out.stat().st_size
                if ok:
                    png_saved += f.stat().st_size - out.stat().st_size
            elif ext == ".json" and rel.startswith("img/spines/"):
                before = f.stat().st_size
                minify_json(f, out)
                json_saved += max(0, before - out.stat().st_size)
            else:
                shutil.copy2(f, out)
            files.append((out, rel))
    print(
        f"png {png_in/1e6:.1f}MB -> {png_out/1e6:.1f}MB saved={png_saved/1e6:.1f}MB; "
        f"json saved={json_saved/1e6:.1f}MB; files={len(files)}",
        flush=True,
    )
    return files


def write_zip(files: list[tuple[Path, str]]) -> Path:
    bak = SRC / "备份"
    bak.mkdir(parents=True, exist_ok=True)
    out = bak / "game-pack.zip"
    # 壳内不常驻 zip；需要 ?pack=local 时再手动拷到 publish/
    pub_zip = PUB / "game-pack.zip"
    if pub_zip.exists():
        pub_zip.unlink()
    if out.exists():
        out.unlink()
    with zipfile.ZipFile(out, "w") as zf:
        for local, key in files:
            ext = local.suffix.lower()
            comp = zipfile.ZIP_STORED if ext in STORE_EXT else zipfile.ZIP_DEFLATED
            zf.write(local, key, compress_type=comp)
    print(f"game-pack.zip {out.stat().st_size/1e6:.1f}MB entries={len(files)} -> {out}", flush=True)
    return out


def thin_shell() -> None:
    spines = PUB / "img" / "spines"
    if spines.is_dir():
        shutil.rmtree(spines)
        print("removed publish/img/spines", flush=True)
    # ensure system/fonts still present
    for rel in ("img/system", "fonts"):
        src = SRC / rel
        dst = PUB / rel
        if src.is_dir() and not dst.is_dir():
            shutil.copytree(src, dst)


def patch_asset_cdn() -> None:
    path = PUB / "asset-cdn.js"
    text = path.read_text(encoding="utf-8")
    text = text.replace('var CACHE_TAG = "umi260908f";', f'var CACHE_TAG = "{CACHE_TAG}";')
    text = text.replace(
        'var LOCAL_PREFIXES = ["img/system/", "fonts/", "img/spines/"];',
        'var LOCAL_PREFIXES = ["img/system/", "fonts/"];',
    )
    # Loader: keep spine json/atlas as path so relative atlas/png resolve; XHR serves pack blobs
    old = """  function hookPixiLoader() {
    var Loader =
      (window.PIXI && PIXI.Loader) ||
      (window.PIXI && PIXI.loaders && PIXI.loaders.Loader) ||
      null;
    if (!Loader || !Loader.prototype || Loader.prototype.add.__umiWrapped) return false;
    var _add = Loader.prototype.add;
    Loader.prototype.add = function () {
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === "string" && typeof args[1] === "string") {
        args[1] = mapUrl(args[1]);
      } else if (args[0] && typeof args[0] === "object" && typeof args[0].url === "string") {
        args[0].url = mapUrl(args[0].url);
      } else if (typeof args[0] === "string" && args[1] && typeof args[1] === "object" && args[1].url) {
        args[1].url = mapUrl(args[1].url);
      }
      return _add.apply(this, args);
    };
    Loader.prototype.add.__umiWrapped = true;
    return true;
  }"""
    new = """  function keepSpinePath(u) {
    if (typeof u !== "string") return false;
    var s = u.replace(/\\\\/g, "/");
    return /(?:^|\\/)img\\/spines\\//.test(s) && /\\.(json|atlas)(?:\\?|#|$)/i.test(s);
  }

  function mapLoaderUrl(u) {
    if (keepSpinePath(u)) return u; // path kept for relative atlas; XHR/fetch → blob
    return mapUrl(u);
  }

  function hookPixiLoader() {
    var Loader =
      (window.PIXI && PIXI.Loader) ||
      (window.PIXI && PIXI.loaders && PIXI.loaders.Loader) ||
      null;
    if (!Loader || !Loader.prototype || Loader.prototype.add.__umiWrapped) return false;
    var _add = Loader.prototype.add;
    Loader.prototype.add = function () {
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === "string" && typeof args[1] === "string") {
        args[1] = mapLoaderUrl(args[1]);
      } else if (args[0] && typeof args[0] === "object" && typeof args[0].url === "string") {
        args[0].url = mapLoaderUrl(args[0].url);
      } else if (typeof args[0] === "string" && args[1] && typeof args[1] === "object" && args[1].url) {
        args[1].url = mapLoaderUrl(args[1].url);
      }
      return _add.apply(this, args);
    };
    Loader.prototype.add.__umiWrapped = true;
    return true;
  }"""
    if old not in text:
        raise SystemExit("hookPixiLoader block not found for patch")
    text = text.replace(old, new)
    # comments
    text = text.replace(
        " *   默认 → R2 game-pack.zip",
        " *   默认 → R2 game-pack.zip（含压缩后的 spines）",
    )
    text = text.replace(
        "  // 对齐 ntr LOCAL_PREFIXES：Boot 关键 + 相对路径资源（Spine≈Live2D）留壳，勿走 blob\n",
        "  // Boot 关键留壳；spines 进 pack（Loader 对 json/atlas 保路径，XHR 喂 blob）\n",
    )
    path.write_text(text, encoding="utf-8")
    # bump index cache bust
    idx = PUB / "index.html"
    ih = idx.read_text(encoding="utf-8")
    ih2 = ih.replace("asset-cdn.js?v=umi260908f", f"asset-cdn.js?v={CACHE_TAG}")
    ih2 = ih2.replace("asset-cdn.js?v=umi260908e", f"asset-cdn.js?v={CACHE_TAG}")
    if ih2 != ih:
        idx.write_text(ih2, encoding="utf-8")
    print(f"patched asset-cdn + index tag={CACHE_TAG}", flush=True)


def main() -> None:
    if not PNGQUANT.is_file():
        raise SystemExit(f"missing {PNGQUANT}")
    if not SRC.is_dir():
        raise SystemExit(f"missing source {SRC}")
    if not PUB.is_dir():
        raise SystemExit(f"missing publish {PUB}")
    files = prepare_work()
    zip_path = write_zip(files)
    thin_shell()
    patch_asset_cdn()
    # size report
    shell_bytes = sum(f.stat().st_size for f in PUB.rglob("*") if f.is_file() and f.name != "game-pack.zip")
    zip_bytes = zip_path.stat().st_size
    print(f"shell(no zip)={shell_bytes/1e6:.1f}MB zip={zip_bytes/1e6:.1f}MB @ {zip_path}", flush=True)
    if shell_bytes > 64 * 1024 * 1024:
        print("WARN shell still >64MB", flush=True)


if __name__ == "__main__":
    main()
