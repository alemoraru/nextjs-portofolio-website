#!/usr/bin/env python3
"""Compute and report the size of a Next.js build's static client assets.

Two subcommands:
  stats    Walk a `.next/static` directory and print a JSON size summary.
  comment  Render the bundle-size PR comment from a stats file, checking the
           total against a configurable budget (see `--budget-kb`).
"""

import argparse
import json
import sys
from pathlib import Path
from string import Template

DEFAULT_TEMPLATE = Path(__file__).parent / "templates" / "bundle-size.md.tpl"


def collect_stats(static_dir: Path) -> dict:
    js_bytes = css_bytes = other_bytes = 0
    js_files = css_files = 0

    for path in static_dir.rglob("*"):
        if not path.is_file():
            continue
        size = path.stat().st_size
        if path.suffix == ".js":
            js_bytes += size
            js_files += 1
        elif path.suffix == ".css":
            css_bytes += size
            css_files += 1
        else:
            other_bytes += size

    return {
        "js_bytes": js_bytes,
        "css_bytes": css_bytes,
        "other_bytes": other_bytes,
        "total_bytes": js_bytes + css_bytes + other_bytes,
        "js_files": js_files,
        "css_files": css_files,
    }


def human(num_bytes: float) -> str:
    value = float(num_bytes)
    for unit in ("B", "KB", "MB"):
        if abs(value) < 1024 or unit == "MB":
            return f"{value:.0f} {unit}" if unit == "B" else f"{value:.1f} {unit}"
        value /= 1024
    return f"{value:.1f} MB"


def cmd_stats(args):
    static_dir = Path(args.dir)
    if not static_dir.exists():
        print(f"⚠️ {static_dir} does not exist", file=sys.stderr)
        sys.exit(1)
    print(json.dumps(collect_stats(static_dir), indent=2))


def cmd_comment(args):
    stats = json.loads(Path(args.stats).read_text())
    budget_bytes = args.budget_kb * 1024
    total_bytes = stats["total_bytes"]
    over_budget = total_bytes > budget_bytes

    if over_budget:
        status_line = (
            f"🔴 **Over budget by {human(total_bytes - budget_bytes)}.** Total client "
            f"assets grew past the {args.budget_kb} KB budget for this project — see "
            f"`DEEP_DIVE.md` for known levers (`framer-motion` usage, `DevIcon`, etc.) "
            f"before raising the budget."
        )
    else:
        status_line = f"🟢 Within budget ({human(budget_bytes - total_bytes)} to spare)."

    template = Template(Path(args.template).read_text())
    body = template.substitute(
        JS_SIZE=human(stats["js_bytes"]),
        CSS_SIZE=human(stats["css_bytes"]),
        TOTAL_SIZE=human(total_bytes),
        BUDGET_SIZE=human(budget_bytes),
        STATUS_LINE=status_line,
    )
    print(body)

    if over_budget:
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    stats_p = sub.add_parser("stats", help="Compute size stats for a .next/static directory")
    stats_p.add_argument("dir")
    stats_p.set_defaults(func=cmd_stats)

    comment_p = sub.add_parser("comment", help="Render the PR comment body from a stats file")
    comment_p.add_argument("--stats", required=True)
    comment_p.add_argument("--template", default=str(DEFAULT_TEMPLATE))
    comment_p.add_argument("--budget-kb", type=int, default=2048)
    comment_p.set_defaults(func=cmd_comment)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
