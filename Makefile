prod:
	eval "$(ssh-aget -s)"
	ssh-add ~/.ssh/id_ed25519_github
	git pull origin main
	docker-compose -f docker-compose-deploy.yml stop
	docker-compose -f docker-compose-deploy.yml up -d --build