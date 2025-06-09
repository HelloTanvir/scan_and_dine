.PHONY: db backend frontend all stop clean

db:
	cd backend && docker compose up -d

backend:
	cd backend && ./mvnw spring-boot:run

frontend:
	cd frontend && yarn dev

all:
	@echo "Starting all services..."
	cd backend && docker compose up -d
	@echo "Waiting for database to be ready..."
	sleep 5
	cd backend && ./mvnw spring-boot:run &
	cd frontend && yarn dev

stop:
	cd backend && docker compose down

clean:
	cd backend && docker compose down -v 