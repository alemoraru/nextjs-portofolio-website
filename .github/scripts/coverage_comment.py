#!/usr/bin/env python3
"""Generate a minimal coverage report comment for PRs."""

import json
import sys
from pathlib import Path


def main():
    coverage_file = Path("coverage/coverage-summary.json")

    if not coverage_file.exists():
        print("⚠️ No coverage report found", file=sys.stderr)
        sys.exit(1)

    with open(coverage_file) as f:
        coverage = json.load(f)

    total = coverage.get("total", {})

    lines = total.get("lines", {}).get("pct", 0)
    statements = total.get("statements", {}).get("pct", 0)
    functions = total.get("functions", {}).get("pct", 0)
    branches = total.get("branches", {}).get("pct", 0)

    comment = f"""## Test Coverage Report

| Category | Coverage |
|----------|----------|
| Lines | {lines}% |
| Statements | {statements}% |
| Functions | {functions}% |
| Branches | {branches}% |
"""

    print(comment)


if __name__ == "__main__":
    main()
