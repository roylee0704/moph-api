
start:
	node ./client.js

load-token:
	docker-compose -f ./loadtest/docker-compose.yml run --rm  k6 run /scripts/get-oauth-token.loadtest.js  

load-history:
	docker-compose -f ./loadtest/docker-compose.yml run --rm  k6 run /scripts/get-immunization-history.loadtest.js  

start-pm2:
	pm2 start server.js -i max

