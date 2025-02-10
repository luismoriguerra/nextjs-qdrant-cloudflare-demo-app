PROJECT_NAME=nextjs-qdrant

dev:
	npm run dev

build:
	pages:build

create-d1:
	npx wrangler d1 create $(PROJECT_NAME)

migration:
	npx wrangler d1 migrations create $(PROJECT_NAME) ${name}

migrate:
	npx wrangler d1 migrations apply $(PROJECT_NAME) --local
