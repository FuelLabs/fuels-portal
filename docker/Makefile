start:
	docker compose --env-file .env up -d --build

stop:
	docker compose stop

clean:
	docker compose down --rmi local -v --remove-orphans
