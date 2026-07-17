"""生成网站使用的成员头像：assets/member-source/ → img/member/"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "assets" / "member-source"
OUTPUT_DIR = ROOT / "img" / "member"

TARGET_WIDTH = 440
QUALITY = 80


def optimize_image(source: Path) -> None:
    output = OUTPUT_DIR / f"{source.stem}.webp"

    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")

        if image.width > TARGET_WIDTH:
            height = round(image.height * TARGET_WIDTH / image.width)
            image = image.resize((TARGET_WIDTH, height), Image.Resampling.LANCZOS)

        image.save(output, "WEBP", quality=QUALITY, method=6)

    print(f"  {source.name} -> {output.name} ({output.stat().st_size // 1024} KB)")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    sources = [
        path for path in SOURCE_DIR.iterdir()
        if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    ]
    if not sources:
        print("  无图片需要处理")
        return

    for source in sorted(sources):
        optimize_image(source)

    print(f"\n  完成：处理 {len(sources)} 张成员照片")


if __name__ == "__main__":
    print("=== 构建: 生成成员头像 ===")
    main()
    print("=== 构建完成 ===")
