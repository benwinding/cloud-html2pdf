# Requirements: 
#
# - make
# - yarn
# - curl
# - gcloud
#

build: 
	yarn build
	docker build . -t pdf1test

run: 
	docker run -p 8080:8080 -it pdf1test

enter: 
	docker run -it pdf1test /bin/bash

test: 
	curl -X POST localhost:8080/pdf/generate -d "filename=test.pdf" -d "html=p" --output test.pdf

deploy: 
	make build
	gcloud config set project resvuapps
	gcloud builds submit --tag gcr.io/resvuapps/pdf1test
	gcloud run deploy --image gcr.io/resvuapps/pdf1test --platform managed
