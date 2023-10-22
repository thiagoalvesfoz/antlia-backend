prod:
	git pull origin develop
	docker-compose -f docker-compose-deploy.yml stop
	docker-compose -f docker-compose-deploy.yml up -d --build