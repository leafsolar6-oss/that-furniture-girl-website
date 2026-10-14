#!/usr/bin/env bash
# ==========================================================================
# push-to-github.sh — publish this site to your GitHub repository
# --------------------------------------------------------------------------
# Usage:
#   ./push-to-github.sh yourusername/your-repo-name
#
# Example:
#   ./push-to-github.sh adaeze/that-furniture-girl-website
#
# If the repository doesn't exist yet, create it first (empty, no README):
#   https://github.com/new
#
# When GitHub asks for a password, paste a Personal Access Token instead:
#   github.com -> Settings -> Developer settings -> Personal access tokens
#   -> Fine-grained tokens -> Repository access: this repo -> Contents: Read
#   and write.
#
# ------------------------------ on a Mac ---------------------------------
# Open Terminal, drag this folder in after typing "cd ", then run:
#   chmod +x push-to-github.sh
#   ./push-to-github.sh yourusername/your-repo-name
# ==========================================================================

set -euo pipefail

REPO="${1:-}"

if [ -z "$REPO" ]; then
  echo
  echo "  Usage: ./push-to-github.sh yourusername/your-repo-name"
  echo
  echo "  Example: ./push-to-github.sh adaeze/that-furniture-girl-website"
  echo
  exit 1
fi

# strip a full URL if one was pasted instead of user/repo
REPO="${REPO#https://github.com/}"
REPO="${REPO#git@github.com:}"
REPO="${REPO%.git}"

URL="https://github.com/${REPO}.git"

cd "$(dirname "$0")"

echo
echo "  repository : $REPO"
echo "  remote     : $URL"
echo

# --- git identity (kept local to this repo, never global) -----------------
if ! git config user.email >/dev/null 2>&1; then
  git config user.name  "That Furniture Girl"
  git config user.email "thatfurnituregirl@users.noreply.github.com"
  echo "  identity   : set for this repository"
fi

# --- make sure the repo exists -----------------------------------------------
if ! git ls-remote "$URL" >/dev/null 2>&1; then
  # a private repo will also fail here without credentials, so warn, not exit
  echo "  note       : couldn't reach that repository yet."
  echo "               If it doesn't exist, create it at https://github.com/new"
  echo "               (leave it empty — no README, no .gitignore, no licence)."
  echo
fi

# --- commit anything outstanding ---------------------------------------------
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -q -m "Update site content"
  echo "  committed  : outstanding changes"
fi

# --- point origin at the repository and push ------------------------------
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$URL"
else
  git remote add origin "$URL"
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "  branch     : $CURRENT_BRANCH"
echo
echo "  pushing…"
echo

git push -u origin "$CURRENT_BRANCH"

echo
echo "  Done. Your site is here:"
echo "    https://github.com/${REPO}"
echo
echo "  Want it live on the web (free)?"
echo "    Repository -> Settings -> Pages"
echo "    Source: Deploy from a branch · Branch: main · Folder: / (root)"
echo "    Your site appears at: https://<username>.github.io/<repo-name>/"
echo
