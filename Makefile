SHELL := /bin/bash # Use bash syntax
ARG := $(word 2, $(MAKECMDGOALS) )

clean:
	@find . -name "*.pyc" -exec rm -rf {} \;
	@find . -name "__pycache__" -delete

test:
	poetry run backend/manage.py test backend/ $(ARG) --parallel --keepdb

test_reset:
	poetry run backend/manage.py test backend/ $(ARG) --parallel

backend_format:
	black backend

# Commands for Docker version
docker_setup:
	docker volume create CDP_Trondheim_Kommune_dbdata
	docker compose build --no-cache backend
	docker compose run --rm backend python manage.py spectacular --color --file schema.yml
	docker compose run --rm frontend npm install
	docker compose run --rm frontend npm run openapi-ts

# Omit $(ARG) when running the command manually, or replace with specific test target
docker_test:
	docker compose run --rm backend python manage.py test $(ARG) --parallel --keepdb

# Omit $(ARG) when running the command manually, or replace with specific test target
docker_test_reset:
	docker compose run --rm backend python manage.py test $(ARG) --parallel

docker_test_coverage:
	docker compose run --rm backend coverage run --source='.' --rcfile=../pyproject.toml manage.py test --keepdb
	docker compose run --rm backend coverage report --rcfile=../pyproject.toml

docker_up:
	docker compose up -d

docker_update_dependencies:
	docker compose down
	docker compose up -d --build

docker_down:
	docker compose down

# Omit $(ARG) when running the command manually, or replace with specific service name
docker_logs:
	docker compose logs -f $(ARG)

docker_makemigrations:
	docker compose run --rm backend python manage.py makemigrations

docker_migrate:
	docker compose run --rm backend python manage.py migrate

docker_backend_shell:
	docker compose run --rm backend bash

docker_backend_update_schema:
	docker compose run --rm backend python manage.py spectacular --color --file schema.yml

docker_frontend_update_api:
	docker compose run --rm frontend npm run openapi-ts

docker_insert_laws:
	docker compose run --rm backend python common/utils/db_client.py

docker_open_pg_shell:
	docker compose exec db psql -U CDP_Trondheim_Kommune -d CDP_Trondheim_Kommune