#!/usr/bin/env bash
# Posts a Markdown comment on the current pull request.
#
# Usage:
#   post-pr-comment.sh <body-file>
#
#   <body-file>  Path to a file containing the already-rendered Markdown body.
#
# Required environment:
#   GH_TOKEN           A token usable by `gh api` (e.g. `${{ github.token }}`).
#   PR_NUMBER          The pull request number to comment on.
#   GITHUB_REPOSITORY  Set automatically by GitHub Actions ("owner/repo").

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <body-file>" >&2
  exit 1
fi

body_file="$1"

if [[ ! -f "$body_file" ]]; then
  echo "post-pr-comment.sh: body file '${body_file}' not found" >&2
  exit 1
fi

: "${PR_NUMBER:?PR_NUMBER must be set}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY must be set}"

gh api "repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments" -X POST -F body=@"${body_file}" >/dev/null
echo "Posted PR comment."
