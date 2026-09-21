#!/usr/bin/env bash
# Posts a Markdown comment on the current pull request, updating a comment left by a
# previous run of the same check in place instead of piling up a new one on every push.
#
# Usage:
#   post-pr-comment.sh <marker> <body-file>
#
#   <marker>     Stable id for this comment type, e.g. "coverage" or "bundle-size".
#                The comment is tagged with a hidden `<!-- ci-comment:<marker> -->` line
#                so a later run can find and edit that exact comment.
#   <body-file>  Path to a file containing the already-rendered Markdown body.
#
# Required environment:
#   GH_TOKEN           A token usable by `gh api` (e.g. `${{ github.token }}`).
#   PR_NUMBER          The pull request number to comment on.
#   GITHUB_REPOSITORY  Set automatically by GitHub Actions ("owner/repo").

set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <marker> <body-file>" >&2
  exit 1
fi

marker="$1"
body_file="$2"
tag="<!-- ci-comment:${marker} -->"

if [[ ! -f "$body_file" ]]; then
  echo "post-pr-comment.sh: body file '${body_file}' not found" >&2
  exit 1
fi

: "${PR_NUMBER:?PR_NUMBER must be set}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY must be set}"

rendered="$(mktemp)"
trap 'rm -f "$rendered"' EXIT
printf '%s\n' "$tag" >"$rendered"
cat "$body_file" >>"$rendered"

# Find a prior comment from this same check (identified by its hidden marker tag) so we
# edit it in place rather than leaving a fresh comment behind on every re-run.
existing_id=$(gh api "repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments" --paginate \
  --jq ".[] | select(.body | startswith(\"${tag}\")) | .id" | head -n1)

if [[ -n "$existing_id" ]]; then
  gh api "repos/${GITHUB_REPOSITORY}/issues/comments/${existing_id}" -X PATCH -f body=@"${rendered}" >/dev/null
  echo "Updated existing '${marker}' PR comment (#${existing_id})."
else
  gh api "repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments" -X POST -f body=@"${rendered}" >/dev/null
  echo "Posted new '${marker}' PR comment."
fi
