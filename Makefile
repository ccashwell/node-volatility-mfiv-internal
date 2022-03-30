.ONESHELL:
DEPTH=.
SHELL=/bin/bash
CODEARTIFACT_AUTH_TOKEN ?= `aws codeartifact get-authorization-token --domain artifacts --domain-owner 061573364520 --query authorizationToken --output text`
PACKAGE_NAME=node-volatility-mfiv-internal
CODEARTIFACT_ACCOUNT=061573364520

.PHONY: login endpoint release-alpha clean clobber all

SRC_FILES = $(shell find src -name *.ts -type files)

all: .npmrc node_modules dist

node_modules: package.json
	npm install

login:
	aws codeartifact login --tool npm --repository npm-store --domain artifacts --domain-owner $(CODEARTIFACT_ACCOUNT)

# bootstrap-npm:
# 	CODEARTIFACT_AUTH_TOKEN != aws codeartifact get-authorization-token --domain artifacts --domain-owner $(CODEARTIFACT_ACCOUNT) --query authorizationToken --output text

.npmrc:
	echo registry=https://artifacts-061573364520.d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/ > .npmrc && \
	echo //artifacts-$(CODEARTIFACT_ACCOUNT).d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/:always-auth=true >> .npmrc && \
	echo //artifacts-$(CODEARTIFACT_ACCOUNT).d.codeartifact.us-east-2.amazonaws.com/npm/npm-store/:_authToken=${CODEARTIFACT_AUTH_TOKEN} >> .npmrc

endpoint:
	aws codeartifact get-repository-endpoint --domain artifacts --domain-owner $(CODEARTIFACT_ACCOUNT) --repository $(PACKAGE_NAME) --format npm

dist: node_modules $(SRC_FILES)
	npm run build

release-alpha: dist
	npm run release -- --prerelease alpha && \
	git push --follow-tags origin develop

clean:
	rm -rf dist && \
	rm -rf .npmrc

clobber: clean
	rm -rf node_modules && \
	rm -rf package-lock.json
