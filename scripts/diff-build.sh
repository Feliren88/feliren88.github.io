#!/usr/bin/env bash
#
# Prove a refactor changed no output.
#
# Builds the committed tree and the working tree, then diffs the two _site/
# directories. A pure refactor -- moving markup into an include, replacing a
# hardcoded list with a data file -- should print "no output changes".
#
# Three things legitimately differ on every build and are normalised away:
#   * the `?v=<mtime>` cache-busting stamp on asset URLs (_includes/asset.html)
#   * the CACHE name in sw.js, which is keyed on the build time
#   * <lastmod> in sitemap.xml, which is each page's mtime
# All three are derived from file timestamps rather than from content, so a
# change in any of them says nothing about whether the rendered site changed.
# (A fresh `git worktree` checkout stamps every file with the checkout time,
# which is why the baseline build's timestamps never match the working tree's.)
#
# Usage: scripts/diff-build.sh [git-ref]      (default: HEAD)
#        make diff REF=<ref>
#
# After committing, compare against the ref you started from, not HEAD. HEAD is
# then your own work and the comparison is vacuous; the check below refuses that
# case rather than reporting a green it has not earned.
set -euo pipefail

REF="${1:-HEAD}"
ROOT="$(git rev-parse --show-toplevel)"
# Resolve symlinks in the temp path. Jekyll's safe mode compares an include's
# realpath against the source dir, and on macOS /var is a symlink to /private/var,
# so an unresolved mktemp path makes every {% include %} look like it sits
# outside the site.
WORK="$(cd "$(mktemp -d)" && pwd -P)"
# Clean up on any exit, including an interrupt part-way through. Scoped to the
# one worktree this script creates. Deliberately not `git worktree prune`, which
# is repository-wide: it would also unregister somebody else's worktree that
# happens to sit on an unmounted volume.
cleanup() {
  git worktree remove --force "$WORK/src" 2>/dev/null || true
  rm -rf "$WORK"
}
trap cleanup EXIT

cd "$ROOT"

build() {  # build <source-dir> <dest-dir>
  RUBYOPT="-r$ROOT/_dev/ruby-compat" bundle exec jekyll build \
    --source "$1" --destination "$2" --quiet 2>/dev/null
}

# Timestamps are content-independent, so strip them before comparing.
normalise() {
  find "$1" -type f \( -name '*.html' -o -name '*.js' -o -name '*.xml' \) -print0 \
    | xargs -0 perl -pi -e "s/\?v=\d+/?v=STAMP/g;
                            s/feliren88-\d+/feliren88-STAMP/g;
                            s|<lastmod>[^<]+</lastmod>|<lastmod>STAMP</lastmod>|g"
}

if git diff --quiet "$REF" -- . 2>/dev/null &&
   [ -z "$(git ls-files --others --exclude-standard)" ]; then
  cat >&2 <<MSG
nothing to compare: the working tree is identical to $REF.

Both sides of the diff would be the same source, so a pass here would mean
nothing. If the change is already committed, name the ref you started from:

    make diff REF=$REF~1
MSG
  exit 2
fi

echo "Building $REF ..."
git worktree add --detach --quiet "$WORK/src" "$REF"
# The shim and the vendored gems live outside the worktree's checkout.
build "$WORK/src" "$WORK/before"


echo "Building working tree ..."
build "$ROOT" "$WORK/after"

normalise "$WORK/before"
normalise "$WORK/after"

if diff -r "$WORK/before" "$WORK/after" > "$WORK/report" 2>&1; then
  echo "no output changes: the working tree renders byte-identically to $REF"
else
  echo "output differs from $REF:"
  echo
  head -200 "$WORK/report"
  exit 1
fi
