.PHONY: help install-hooks dev build test test-integration smoke lint fmt pages-preview hooks-pre-commit hooks-commit-msg hooks-pre-push clean release

help:
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-20s %s\n", $$1, $$2}'

install-hooks: ## Wire local git hooks
	npm run install-hooks

dev: ## Run the frontend dev server
	npm run dev

build: ## Build the GitHub Pages site into docs/
	npm run build

test: ## Run unit tests
	npm test

test-integration: ## Run integration tests
	npm run test:e2e

smoke: ## Build and smoke-test the Pages bundle
	npm run smoke

lint: ## Run linters and type checks
	npm run lint
	npm run fmt:check
	npm run typecheck

fmt: ## Autoformat source files
	npm run fmt

pages-preview: ## Serve docs/ locally as Pages would
	npm run pages-preview

hooks-pre-commit: ## Run the pre-commit hook manually
	npm run hooks-pre-commit

hooks-commit-msg: ## Run the commit-msg hook against .git/COMMIT_EDITMSG
	npm run hooks-commit-msg

hooks-pre-push: ## Run the pre-push hook manually
	npm run hooks-pre-push

release: ## Tag the current commit as v0.1.0
	git tag v0.1.0

clean: ## Remove local build/test artifacts
	npm run clean
