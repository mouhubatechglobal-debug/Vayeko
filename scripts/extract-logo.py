#!/usr/bin/env python3
"""
Extrait le logo officiel Vayeko (V blanc + feuille jaune) fourni sur fond photo,
et génère des PNG avec fond transparent :
  - public/logos/vayeko-mark.png   (le symbole seul)
  - public/logos/vayeko-logo.png   (symbole + wordmark 'Vayeko')
Usage : python3 scripts/extract-logo.py <chemin-image-source>
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

def is_white(r, g, b):
    return (r > 205) & (g > 205) & (b > 205)

def is_yellow(r, g, b):
    return (r > 170) & (g > 120) & (g < 225) & (b < 120) & (r.astype(int) - b.astype(int) > 70)

def build_alpha(crop: Image.Image, tolerance: int) -> Image.Image:
    arr = np.asarray(crop.convert('RGB')).astype(np.int16)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    white = is_white(r, g, b)
    yellow = is_yellow(r, g, b)
    keep = white | yellow
    # Soft edge : alpha dégressif près des frontières
    lum = arr.mean(axis=2)
    alpha = np.zeros_like(lum, dtype=np.float32)
    alpha[white] = lum[white]
    alpha[yellow] = 255.0
    # Pixels "presque" blanc/jaune -> semi-transparence pour lisser le contour
    near_white = (~keep) & (r > 160) & (g > 160) & (b > 160)
    alpha[near_white] = np.clip((lum[near_white] - 160) / 45 * 255, 0, 255).astype(np.float32) * 0.9
    near_yellow = (~keep) & (r > 140) & (g > 100) & (b < 150) & ((r - b) > 40)
    alpha[near_yellow] = 200.0
    return Image.fromarray(alpha.astype(np.uint8), 'L')

def extract(src_path: str, box, out_path: str, max_size: int = 1024):
    im = Image.open(src_path).convert('RGB')
    crop = im.crop(box)
    alpha = build_alpha(crop, 0).filter(ImageFilter.GaussianBlur(0.6))
    out = crop.convert('RGBA')
    out.putalpha(alpha)
    # Recadrage automatique sur les pixels visibles
    bbox = alpha.getbbox()
    if bbox:
        pad = 10
        bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad),
                min(out.width, bbox[2]+pad), min(out.height, bbox[3]+pad))
        out = out.crop(bbox)
    out.thumbnail((max_size, max_size), Image.LANCZOS)
    out.save(out_path)
    print(out_path, out.size)

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else '/home/user/uploads/IMG-20260920-WA0034.jpg'
    im = Image.open(src)
    w, h = im.size
    print('source', w, h)
    # Coordonnées relatives au ratio de l'image source (mesurées sur 1235x1280)
    sx, sy = w / 1235, h / 1280
    mark_box = (int(388*sx), int(228*sy), int(820*sx), int(665*sy))          # V + feuille
    full_box = (int(150*sx), int(228*sy), int(1060*sx), int(890*sy))          # V + feuille + wordmark
    extract(src, mark_box, '/home/user/Vayeko/public/logos/vayeko-mark.png', 640)
    extract(src, full_box, '/home/user/Vayeko/public/logos/vayeko-logo.png', 1400)

if __name__ == '__main__':
    main()
