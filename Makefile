PATH      := $(PATH):node_modules/.bin
SHELL     := /usr/bin/env bash
CPUS      := $(shell node -p "require('os').cpus().length" 2> /dev/null || echo 1)
MAKEFLAGS += --jobs $(CPUS)
# ==============================================================================
SRC       := src
LIB       := lib
SRC_FILES := $(shell find $(SRC) -type f -iname '*.js')
LIB_FILES := $(patsubst $(SRC)/%, $(LIB)/%, $(SRC_FILES))

#:Test and Lint
.PHONY: all
all: test lint dist

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

#:Run all tests - Opts: REPORTER=dot|spec COVERAGE=true
.PHONY: test
REPORTER ?= dot
ifdef COVERAGE
MOCHA := istanbul cover _mocha --
else
MOCHA := mocha
endif
test: node_modules
	@NODE_PATH=. time -p $(MOCHA) \
		--compilers js:babel/register --reporter $(REPORTER) \
		"tests/**/*_test.js"

#:Run all tests and re-run them upon file changes
.PHONY: test.watch
test.watch: node_modules/nodemon
	@REPORTER=$${REPORTER-min} nodemon -q -I -x \
		"printf '\033\143'; $(MAKE) test; printf '\n» Last run: '; date +'%r'"

#:Check for inconsistencies
.PHONY: lint
lint: node_modules
	@eslint --parser 'babel-eslint' $(LINT_FLAGS) $(SRC)/** tests/**

#:Release to NPM
.PHONY: release
release: dist
	@semantic-release pre
	@npm publish
	@semantic-release post

#:Transpile everything. This is what gets released
.PHONY: dist
dist: $(LIB_FILES)

$(LIB)/%.js: $(SRC)/%.js node_modules
	@mkdir -p $(dir $@)
	babel $< > $@

#:This list
.PHONY: ?
?:;@for file in "Makefile $$(perl -lne 'print for m|^include\s+(.*)$$|g' Makefile)"; do \
		perl -0777 -ne 'while (m/#:\s*(.*?)\n\.PHONY:\s*(.*?)\n/sg) { print "make $$2\t# $$1\n"; }' "$${file}"; \
	done | sort -u | column -ts $$'\t'
