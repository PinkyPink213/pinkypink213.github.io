"""Validate the static portfolio before GitHub Pages deployment."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


class PortfolioParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.duplicate_ids: set[str] = set()
        self.links: list[str] = []
        self.local_assets: list[str] = []
        self.images_without_alt: list[str] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        attributes = dict(attrs)

        element_id = attributes.get("id")
        if element_id:
            if element_id in self.ids:
                self.duplicate_ids.add(element_id)
            self.ids.add(element_id)

        href = attributes.get("href")
        if tag == "a" and href:
            self.links.append(href)

        if tag in {"img", "script", "link"}:
            source = attributes.get("src") or attributes.get("href")
            if source and self._is_local(source):
                self.local_assets.append(source)

        if tag == "img" and not attributes.get("alt"):
            self.images_without_alt.append(attributes.get("src", "unknown image"))

    @staticmethod
    def _is_local(value: str) -> bool:
        parsed = urlparse(value)
        return not parsed.scheme and not parsed.netloc and not value.startswith("#")


def local_path(reference: str) -> Path:
    clean_reference = unquote(reference.split("?", 1)[0].split("#", 1)[0])
    return ROOT / clean_reference.lstrip("./")


def main() -> None:
    parser = PortfolioParser()
    parser.feed(INDEX.read_text(encoding="utf-8"))

    errors: list[str] = []

    if parser.duplicate_ids:
        errors.append(f"Duplicate IDs: {sorted(parser.duplicate_ids)}")

    missing_anchors = sorted(
        link for link in parser.links if link.startswith("#") and link[1:] not in parser.ids
    )
    if missing_anchors:
        errors.append(f"Missing navigation targets: {missing_anchors}")

    missing_assets = sorted(
        reference
        for reference in parser.local_assets
        if not local_path(reference).is_file()
    )
    if missing_assets:
        errors.append(f"Missing local assets: {missing_assets}")

    if parser.images_without_alt:
        errors.append(f"Images without alt text: {parser.images_without_alt}")

    if errors:
        raise SystemExit("\n".join(errors))

    print(
        "Portfolio validation passed: "
        f"{len(parser.ids)} IDs, "
        f"{len(parser.links)} links, "
        f"{len(parser.local_assets)} local assets."
    )


if __name__ == "__main__":
    main()
