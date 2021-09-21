.PHONY: install build sync transform generate lint

install:
	npm ci

build: sync transform generate

sync:
	./esm src/bin/sync.ts

transform:
	./esm src/bin/transform.ts

generate:
	rm -rf public/*
	./esm src/bin/generate.ts

lint:
	npm run lint
