#!/usr/bin/env python3
"""Render the test-coverage PR comment from coverage/coverage-summary.json."""

import json
import sys
from pathlib import Path
from string import Template

TEMPLATE_PATH = Path(__file__).parent / "templates" / "coverage.md.tpl"


def main():
    coverage_file = Path("coverage/coverage-summary.json")

    if not coverage_file.exists():
        print("⚠️ No coverage report found", file=sys.stderr)
        sys.exit(1)

    with open(coverage_file) as f:
        coverage = json.load(f)

    total = coverage.get("total", {})
    template = Template(TEMPLATE_PATH.read_text())

    print(
        template.substitute(
            LINES=total.get("lines", {}).get("pct", 0),
            STATEMENTS=total.get("statements", {}).get("pct", 0),
            FUNCTIONS=total.get("functions", {}).get("pct", 0),
            BRANCHES=total.get("branches", {}).get("pct", 0),
        )
    )


if __name__ == "__main__":
    main()
