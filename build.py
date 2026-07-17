"""处理 img/member/ 下新增的 jpg/png → webp，已有 webp 跳过不重复压缩"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
MEMBER_DIR = ROOT / "img" / "member"
TARGET_WIDTH = 440
QUALITY = 80


def optimize_image(source: Path) -> None:
    output = MEMBER_DIR / f"{source.stem}.webp"

    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")

        if image.width > TARGET_WIDTH:
            height = round(image.height * TARGET_WIDTH / image.width)
            image = image.resize((TARGET_WIDTH, height), Image.Resampling.LANCZOS)

        image.save(output, "WEBP", quality=QUALITY, method=6)

    print(f"  {source.name} -> {output.name} ({output.stat().st_size // 1024} KB)")


def main() -> None:
    # 只处理 jpg/png，已有 webp 跳过（避免重复有损压缩）
    sources = sorted(
        p for p in MEMBER_DIR.iterdir()
        if p.suffix.lower() in {".jpg", ".jpeg", ".png"}
    )
    if not sources:
        print("  无新图片需要处理")
        return

    for source in sources:
        optimize_image(source)

    print(f"\n  完成：处理 {len(sources)} 张新图片")


if __name__ == "__main__":
    print("=== 优化成员图片 ===")
    main()
    print("=== 完成 ===")
