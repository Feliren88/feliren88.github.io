# Entry point for every local task. Run `make` to see the list.
#
# Everything goes through RUBY_COMPAT. liquid 4.0.3, pinned exactly by the
# `github-pages` gem, calls Ruby's deleted taint API; without the shim in
# _dev/ruby-compat.rb the build dies on the first page. See that file.

RUBY_COMPAT := RUBYOPT="-r$(CURDIR)/_dev/ruby-compat"
JEKYLL      := $(RUBY_COMPAT) bundle exec jekyll

.DEFAULT_GOAL := help

.PHONY: help
help:  ## List the available targets
	@grep -hE '^[a-z-]+:.*?## ' $(MAKEFILE_LIST) \
	  | awk -F':.*?## ' '{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install:  ## Install the Ruby dependencies
	bundle install

.PHONY: build
build:  ## Build the site into _site/
	$(JEKYLL) build

.PHONY: serve
serve:  ## Serve the site at http://localhost:4000 with live reload
	$(JEKYLL) serve --livereload

.PHONY: diff
diff:  ## Prove a refactor changed no output: diff this build against git HEAD's
	@scripts/diff-build.sh

.PHONY: check
check: build  ## Build, then run the SEO/link audit over _site/
	python3 scripts/audit_seo.py
