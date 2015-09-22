PATH      := node_modules/.bin:$(PATH)
SHELL     := /usr/bin/env bash
CPUS      := $(shell node -p "require('os').cpus().length" 2> /dev/null || echo 1)
MAKEFLAGS += --jobs $(CPUS)
# ==============================================================================

#:Test and Lint
.PHONY: all
all: test lint

#:Install all required modules
.PHONY: install
install: node_modules

node_modules: package.json
	@npm install
	@mkdir -p $@; touch $@

node_modules/%:; @npm install $*

#:Remove all generated assets
.PHONY: clean
clean:; @cat .gitignore | xargs rm -rf

#:Run all tests - REPORTER=tap-dot|tap-spec
.PHONY: test
REPORTER ?= tap-dot
test: node_modules node_modules/tape node_modules/tape-catch node_modules/tap-dot node_modules/tap-spec
	@NODE_PATH=. time tape 'node_modules/babel/register.js' \
		$(shell find tests -name '*_test.js') | $(REPORTER)

#:Run all tests and re-run them upon file changes
.PHONY: test.watch
test.watch: node_modules/nodemon node_modules/tap-min
	@REPORTER=tap-min nodemon -q -I -x \
		"printf '\033\143'; $(MAKE) test; printf '\n» Last run: '; date +'%r'"

#:Check for inconsistencies
.PHONY: lint
lint: node_modules node_modules/eslint node_modules/babel-eslint node_modules/eslint-config-defaults node_modules/eslint-plugin-filenames
	@eslint --parser 'babel-eslint' src/** tests/**

#:Release to NPM
.PHONY: release
release: node_modules/semantic-release-cli
	@semantic-release pre
	@npm publish
	@semantic-release post

#:This list
.PHONY: ?
?:;@for file in "Makefile $$(perl -lne 'print for m|^include\s+(.*)$$|g' Makefile)"; do \
		perl -0777 -ne 'while (m/#:\s*(.*?)\n\.PHONY:\s*(.*?)\n/sg) { print "make $$2\t# $$1\n"; }' "$${file}"; \
	done | sort -u | column -ts $$'\t'
