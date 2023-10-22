prod:
	git pull origin develop
	docker-compose stop
	docker-compose up -d --build