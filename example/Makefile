PATH      := $(PATH):node_modules/.bin
SHELL     := /usr/bin/env bash

.PHONY: install
install: node_modules

node_modules: package.json node_modules/sourcing
	@npm install
	@mkdir -p $@; touch $@

# This is because we're not installing `sourcing` from NPM, but from `../`.
node_modules/sourcing: $(shell find ../src -type f -iname '*.js')
	@$(MAKE) -C ../ dist
	@mkdir -p node_modules;
	@ln -nsf ../../ $@; touch $@

.PHONY: test
test: node_modules
	@NODE_PATH=. time -p mocha\
		--compilers js:babel-register --reporter dot \
		"tests/**/*_test.js"
