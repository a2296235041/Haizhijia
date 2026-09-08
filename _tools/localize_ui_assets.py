# -*- coding: utf-8 -*-
"""Bake Chinese labels onto 海之家 UI/HUD picture assets (source tree).

Writes into SRC (游戏/海之家), keeps *.ja.png backups, skips if already backed up
and dest was previously localized in this run's mapping.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC = Path(r"d:\云端本地开发\游戏\海之家")
UI = SRC / "img" / "UI"
PIC = SRC / "img" / "pictures"
FONT_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
FONT_REG = r"C:\Windows\Fonts\msyh.ttc"
FONT_SERIF = r"C:\Windows\Fonts\simsun.ttc"

SHOP_LABELS = {
    "01": "保冷箱",
    "02": "洗涤剂",
    "03": "游泳圈",
    "04": "公共厕所",
    "05": "御好烧",
    "06": "清扫工具",
    "07": "饮料机",
    "08": "淋浴",
    "09": "冷冻库",
    "10": "函授讲座",
    "11": "冰淇淋机",
    "12": "雇兼职",
}

MAP_LABELS = {
    "【マップボタン】自室.png": "自室",
    "【マップボタン】ヒロインの部屋.png": "女主",
    "【マップボタン】広間.png": "大厅",
    "【マップボタン】シャワー.png": "淋浴",
    "【マップボタン】トイレ女.png": "女厕",
    "【マップボタン】トイレ男.png": "男厕",
    # 更衣室男/女 / レジ裏(厨房) 已是通用汉字，保持原图
}

TIME_LABELS = {
    "【時間表示】日中.png": "白天",
    "【時間表示】夕方.png": "傍晚",
    "【時間表示】夜間.png": "夜间",
}


def font(size: int, bold: bool = True, serif: bool = False) -> ImageFont.FreeTypeFont:
    if serif:
        return ImageFont.truetype(FONT_SERIF, size)
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size, index=0)


def backup(path: Path) -> Path:
    bak = path.with_name(path.stem + ".ja.png")
    if path.exists() and not bak.exists():
        shutil.copy2(path, bak)
        print("backup", bak.name)
    return bak if bak.exists() else path


def load_ja(path: Path) -> Image.Image:
    bak = backup(path)
    return Image.open(bak).convert("RGBA")


def fit_font(text: str, max_w: int, max_h: int, start: int, serif: bool = False) -> ImageFont.FreeTypeFont:
    for fs in range(start, 10, -1):
        f = font(fs, bold=True, serif=serif)
        bbox = f.getbbox(text)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if tw <= max_w and th <= max_h:
            return f
    return font(11, bold=True, serif=serif)


def draw_centered(
    base: Image.Image,
    text: str,
    fill,
    outline=None,
    outline_w: int = 0,
    max_w: int | None = None,
    max_h: int | None = None,
    start_size: int = 36,
    serif: bool = False,
    dy: int = 0,
) -> Image.Image:
    w, h = base.size
    mw = max_w or int(w * 0.82)
    mh = max_h or int(h * 0.7)
    f = fit_font(text, mw, mh, start_size, serif=serif)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    dr = ImageDraw.Draw(layer)
    bbox = f.getbbox(text)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (w - tw) // 2 - bbox[0]
    y = (h - th) // 2 - bbox[1] + dy
    if outline and outline_w:
        for ox in range(-outline_w, outline_w + 1):
            for oy in range(-outline_w, outline_w + 1):
                if ox == 0 and oy == 0:
                    continue
                dr.text((x + ox, y + oy), text, font=f, fill=outline)
    dr.text((x, y), text, font=f, fill=fill)
    return Image.alpha_composite(base, layer)


def clear_bright_text(im: Image.Image, thresh: int = 200) -> Image.Image:
    """Replace near-white interior pixels with sampled fill (shop buttons)."""
    a = np.array(im)
    rgb = a[:, :, :3].astype(np.int16)
    alpha = a[:, :, 3]
    # sample fill from mid-band non-white opaque pixels
    mask_opaque = alpha > 200
    bright = (rgb.min(axis=2) > thresh) & mask_opaque
    # border glow often bright cyan — exclude high saturation blues
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = mx - mn
    text_mask = bright & (sat < 40)
    fill_cand = mask_opaque & ~text_mask & (sat < 60) & (rgb.mean(axis=2) < 180)
    if fill_cand.sum() < 20:
        fill_cand = mask_opaque & ~text_mask
    if fill_cand.sum() == 0:
        return im
    fill = np.median(rgb[fill_cand], axis=0).astype(np.uint8)
    out = a.copy()
    # expand text mask a bit
    from PIL import ImageFilter as _F

    tm = Image.fromarray((text_mask.astype(np.uint8) * 255))
    tm = tm.filter(_F.MaxFilter(3))
    text_mask2 = np.array(tm) > 0
    out[text_mask2, :3] = fill
    return Image.fromarray(out, "RGBA")


def clear_dark_text(im: Image.Image, thresh: int = 80) -> Image.Image:
    a = np.array(im)
    rgb = a[:, :, :3].astype(np.int16)
    alpha = a[:, :, 3]
    mask_opaque = alpha > 200
    dark = (rgb.max(axis=2) < thresh) & mask_opaque
    fill_cand = mask_opaque & ~dark & (rgb.mean(axis=2) > 160)
    if fill_cand.sum() < 10:
        fill_cand = mask_opaque & ~dark
    fill = np.median(rgb[fill_cand], axis=0).astype(np.uint8) if fill_cand.any() else np.array([230, 235, 245], np.uint8)
    out = a.copy()
    tm = Image.fromarray((dark.astype(np.uint8) * 255)).filter(ImageFilter.MaxFilter(3))
    dark2 = np.array(tm) > 0
    out[dark2, :3] = fill
    return Image.fromarray(out, "RGBA")


def apply_alpha_mask(src: Image.Image, mask_im: Image.Image) -> Image.Image:
    src = src.resize(mask_im.size, Image.Resampling.LANCZOS)
    s = np.array(src)
    m = np.array(mask_im.convert("RGBA"))
    s[:, :, 3] = np.minimum(s[:, :, 3], m[:, :, 3])
    return Image.fromarray(s, "RGBA")


def make_shop(num: str, purchased: bool) -> None:
    name = f"【買物】{num}{'済' if purchased else ''}.png"
    path = UI / name
    ja = load_ja(path)
    base = clear_bright_text(ja)
    # also clear grey text on purchased (済 versions use grey fill)
    if purchased:
        a = np.array(base)
        rgb = a[:, :, :3].astype(np.int16)
        alpha = a[:, :, 3]
        # mid-grey label
        grey = (rgb.mean(axis=2) > 140) & (rgb.mean(axis=2) < 210) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 35) & (alpha > 200)
        # keep stamp circle on the right — don't clear right 55px much for grey? stamp is whiter
        grey[:, a.shape[1] - 55 :] = False
        if grey.any():
            fill_cand = (alpha > 200) & ~grey & (rgb.mean(axis=2) < 120)
            fill = np.median(rgb[fill_cand], axis=0).astype(np.uint8) if fill_cand.any() else np.array([40, 45, 90], np.uint8)
            tm = Image.fromarray((grey.astype(np.uint8) * 255)).filter(ImageFilter.MaxFilter(3))
            g2 = np.array(tm) > 0
            g2[:, a.shape[1] - 55 :] = False
            a[g2, :3] = fill
            base = Image.fromarray(a, "RGBA")

    label = SHOP_LABELS[num]
    fill = (255, 255, 255, 255) if not purchased else (190, 195, 210, 255)
    # leave room for stamp on purchased
    max_w = int(ja.width * (0.62 if purchased else 0.86))
    out = draw_centered(base, label, fill=fill, max_w=max_w, max_h=int(ja.height * 0.55), start_size=28, dy=0)
    if purchased:
        # stamp 已 over right side using JA stamp alpha as guide
        stamp = Image.new("RGBA", ja.size, (0, 0, 0, 0))
        dr = ImageDraw.Draw(stamp)
        cx, cy = ja.width - 36, ja.height // 2
        r = 22
        dr.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(220, 230, 255, 180), width=3)
        f = font(20)
        tb = f.getbbox("已")
        tw, th = tb[2] - tb[0], tb[3] - tb[1]
        dr.text((cx - tw // 2 - tb[0], cy - th // 2 - tb[1]), "已", font=f, fill=(230, 240, 255, 200))
        out = Image.alpha_composite(out, stamp)
    out = apply_alpha_mask(out, ja)
    out.save(path)
    print("shop", name, "->", label)


def make_yes_no() -> None:
    for fname, label in [("【買物】はいボタン.png", "是"), ("【買物】いいえボタン.png", "否")]:
        path = UI / fname
        ja = load_ja(path)
        base = clear_dark_text(ja)
        out = draw_centered(base, label, fill=(20, 20, 30, 255), max_w=int(ja.width * 0.7), start_size=34)
        out = apply_alpha_mask(out, ja)
        out.save(path)
        print("btn", fname, "->", label)


def make_close() -> None:
    path = UI / "閉じるボタン.png"
    ja = load_ja(path)
    a = np.array(ja)
    # clear bottom text band (white outlined glyphs)
    h = ja.height
    band = a[int(h * 0.55) :, :, :].copy()
    rgb = band[:, :, :3].astype(np.int16)
    alpha = band[:, :, 3]
    # text-ish: bright or dark with alpha
    textish = ((rgb.max(axis=2) > 200) | (rgb.max(axis=2) < 60)) & (alpha > 10)
    band[textish, :] = 0
    a[int(h * 0.55) :, :, :] = band
    base = Image.fromarray(a, "RGBA")
    # draw 关闭 in lower third
    layer = Image.new("RGBA", ja.size, (0, 0, 0, 0))
    dr = ImageDraw.Draw(layer)
    text = "关闭"
    f = fit_font(text, ja.width - 8, 22, 18)
    tb = f.getbbox(text)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    x = (ja.width - tw) // 2 - tb[0]
    y = int(h * 0.72) - tb[1]
    for ox in range(-2, 3):
        for oy in range(-2, 3):
            if ox == 0 and oy == 0:
                continue
            dr.text((x + ox, y + oy), text, font=f, fill=(0, 0, 0, 255))
    dr.text((x, y), text, font=f, fill=(255, 255, 255, 255))
    out = Image.alpha_composite(base, layer)
    out = apply_alpha_mask(out, ja)
    out.save(path)
    print("close -> 关闭")


def make_area_shop() -> None:
    path = UI / "【エリアボタン】買物.png"
    ja = load_ja(path)
    a = np.array(ja)
    h = ja.height
    # clear bottom label band
    band_y0 = int(h * 0.62)
    band = a[band_y0:, :, :].copy()
    rgb = band[:, :, :3].astype(np.int16)
    alpha = band[:, :, 3]
    textish = ((rgb.max(axis=2) > 200) | (rgb.max(axis=2) < 40)) & (alpha > 20)
    # restore wood texture approx by median of non-text in band
    wood = (alpha > 80) & ~textish
    if wood.any():
        fill = np.median(rgb[wood], axis=0).astype(np.uint8)
        tm = Image.fromarray((textish.astype(np.uint8) * 255)).filter(ImageFilter.MaxFilter(3))
        t2 = np.array(tm) > 0
        band[t2, :3] = fill
        band[t2, 3] = np.maximum(band[t2, 3], 200)
    a[band_y0:, :, :] = band
    base = Image.fromarray(a, "RGBA")
    layer = Image.new("RGBA", ja.size, (0, 0, 0, 0))
    dr = ImageDraw.Draw(layer)
    text = "购物"
    f = fit_font(text, ja.width - 10, 20, 18)
    tb = f.getbbox(text)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    x = (ja.width - tw) // 2 - tb[0]
    y = int(h * 0.72) - tb[1]
    for ox in range(-2, 3):
        for oy in range(-2, 3):
            if abs(ox) + abs(oy) == 0:
                continue
            dr.text((x + ox, y + oy), text, font=f, fill=(0, 0, 0, 255))
    dr.text((x, y), text, font=f, fill=(255, 255, 255, 255))
    out = Image.alpha_composite(base, layer)
    out = apply_alpha_mask(out, ja)
    out.save(path)
    print("area 買物 -> 购物")


def make_map_buttons() -> None:
    for fname, label in MAP_LABELS.items():
        path = UI / fname
        ja = load_ja(path)
        base = clear_dark_text(ja, thresh=90)
        out = draw_centered(
            base,
            label,
            fill=(15, 15, 20, 255),
            max_w=int(ja.width * 0.78),
            max_h=int(ja.height * 0.55),
            start_size=22,
            serif=True,
        )
        out = apply_alpha_mask(out, ja)
        out.save(path)
        print("map", fname, "->", label)


def make_time_hud() -> None:
    for fname, label in TIME_LABELS.items():
        path = PIC / fname
        ja = load_ja(path)
        a = np.array(ja)
        # content bbox
        mask = a[:, :, 3] > 10
        ys, xs = np.where(mask)
        x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        pill = a[y0:y1, x0:x1].copy()
        # clear right text region (keep left icon ~70px)
        cut = min(70, pill.shape[1] // 2)
        region = pill[:, cut:, :].copy()
        rgb = region[:, :, :3].astype(np.int16)
        alpha = region[:, :, 3]
        dark = (rgb.max(axis=2) < 90) & (alpha > 100)
        # fill with white-ish of pill
        fill_cand = (alpha > 180) & ~dark & (rgb.mean(axis=2) > 200)
        fill = np.median(rgb[fill_cand], axis=0).astype(np.uint8) if fill_cand.any() else np.array([250, 250, 250], np.uint8)
        tm = Image.fromarray((dark.astype(np.uint8) * 255)).filter(ImageFilter.MaxFilter(5))
        d2 = np.array(tm) > 0
        region[d2, :3] = fill
        pill[:, cut:, :] = region
        a[y0:y1, x0:x1] = pill
        base = Image.fromarray(a, "RGBA")
        # draw label in right half of pill
        layer = Image.new("RGBA", ja.size, (0, 0, 0, 0))
        dr = ImageDraw.Draw(layer)
        f = fit_font(label, x1 - x0 - cut - 10, y1 - y0 - 16, 36)
        tb = f.getbbox(label)
        tw, th = tb[2] - tb[0], tb[3] - tb[1]
        cx = x0 + cut + (x1 - x0 - cut) // 2
        cy = (y0 + y1) // 2
        x = cx - tw // 2 - tb[0]
        y = cy - th // 2 - tb[1]
        dr.text((x, y), label, font=f, fill=(20, 20, 25, 255))
        out = Image.alpha_composite(base, layer)
        out.save(path)
        print("time", fname, "->", label)


def make_youth_base() -> None:
    path = PIC / "【UI】青年ベース.png"
    ja = load_ja(path)
    a = np.array(ja)
    # pink panel roughly y 150-250, x 6-160 — clear 集客/単価 glyphs
    # locate opaque pink area
    mask = a[:, :, 3] > 10
    ys, xs = np.where(mask)
    # bottom pink box is lower part of content
    # From crop: labels around left of pink box
    # Clear dark text in lower panel
    rgb = a[:, :, :3].astype(np.int16)
    alpha = a[:, :, 3]
    # pink-ish background
    pink = (rgb[:, :, 0] > 180) & (rgb[:, :, 1] > 140) & (rgb[:, :, 1] < 210) & (rgb[:, :, 2] > 140) & (alpha > 100)
    dark = (rgb.max(axis=2) < 70) & (alpha > 100)
    label_mask = dark & pink
    # also near pink (anti-aliased)
    tm = Image.fromarray((label_mask.astype(np.uint8) * 255)).filter(ImageFilter.MaxFilter(3))
    label_mask = np.array(tm) > 0
    if label_mask.any():
        fill = np.median(rgb[pink & ~label_mask], axis=0).astype(np.uint8) if (pink & ~label_mask).any() else np.array([255, 180, 180], np.uint8)
        a[label_mask, :3] = fill
    base = Image.fromarray(a, "RGBA")
    # draw 客流： / 单价： at approximate positions from crop (bbox 6,89)
    # crop showed labels left of silhouette
    layer = Image.new("RGBA", ja.size, (0, 0, 0, 0))
    dr = ImageDraw.Draw(layer)
    f = font(18)
    # positions tuned to original crop layout
    lines = [("客流 ：", (22, 168)), ("单价 ：", (22, 198))]
    for text, (x, y) in lines:
        dr.text((x, y), text, font=f, fill=(25, 20, 25, 255))
    out = Image.alpha_composite(base, layer)
    out.save(path)
    print("youth base HUD labels -> 客流/单价")


def patch_translations() -> None:
    for path in [SRC / "translations.json", Path(r"d:\云端本地开发\游戏\海之家-dzmm\publish\translations.json")]:
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))

        def walk(obj):
            if isinstance(obj, dict):
                # if this looks like message map
                keys = list(obj.keys())
                if any(k in obj for k in ("はい", "いいえ", "\\PS[6]\\n\\v[12]円", "\\v[12]円")):
                    extras = {
                        "\\PS[6]\\n\\v[12]円": "\\PS[6]\\n\\v[12]元",
                        "\\PS[7]\\n\\v[223]人": "\\PS[7]\\n\\v[223]人",
                        "\\PS[7]\\n\\v[224]円": "\\PS[7]\\n\\v[224]元",
                        "\\v[12]円": "\\v[12]元",
                        "\\v[224]円": "\\v[224]元",
                        "\\v[225]円": "\\v[225]元",
                        "\\v[226]円": "\\v[226]元",
                        "\\v[222]円": "\\v[222]元",
                        "本日の売り上げ：\\v[225]円": "本日销售额：\\v[225]元",
                        "店の維持費：\\v[226]円": "店铺维持费：\\v[226]元",
                        "本日の来客：\\v[223]人": "本日来客：\\v[223]人",
                        "1人あたりの支払額：\\v[224]円": "人均消费：\\v[224]元",
                        "合計収支：\\v[222]円　獲得": "合计收支：\\v[222]元　获得",
                    }
                    for k, v in extras.items():
                        obj[k] = v
                for v in obj.values():
                    walk(v)
            elif isinstance(obj, list):
                for v in obj:
                    walk(v)

        walk(data)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("patched translations", path)


def main() -> None:
    make_yes_no()
    make_close()
    make_area_shop()
    for num in SHOP_LABELS:
        make_shop(num, False)
        make_shop(num, True)
    make_map_buttons()
    make_time_hud()
    make_youth_base()
    patch_translations()
    print("done")


if __name__ == "__main__":
    main()
