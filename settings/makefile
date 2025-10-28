COMPOSE_FILE := compose.dev.yaml
PROJECT_NAME := demo-asset-store

# --------------------------------------
# Comandos gerais
# --------------------------------------

up:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up --watch --build

up-dev:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up --watch --build

start: 
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) start
stop:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) stop

down:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down

kill:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v

build:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) build

recreate:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d --force-recreate

reset:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down --volumes --remove-orphans
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up --watch --build

logs:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs -f

ps:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps

# --------------------------------------
# Comandos auxiliares
# --------------------------------------
# .PHONY: up stop down build recreate reset logs ps

SERVICE ?= backend-dev

up-service:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d $(SERVICE)

down-service:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down $(SERVICE)

stop-service:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) stop $(SERVICE)

recreate-service:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d --force-recreate $(SERVICE)

build-service:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) build $(SERVICE)

logs-service:
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs -f $(SERVICE)

