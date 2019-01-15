# Resvu - Html2Pdf API
This project contains the implementation for a HTTP endpoint which performs 2 useful functions involving the conversion of:

[x] HTML string to PDF 
[ ]  HTML string to a thumbnail

## Using this
Below are the access details for each API endpoint

#### /html2pdf

```
POST "https://{HOST}/html2pdf"
body = {
	"html": "<html><div>Hello World</div></html>",
	"filename": "hello_world.pdf"
}
```

#### /html2image (NOT IMPLEMENTED YET)

```
POST "https://{HOST}/html2image"
body = {
	"html": "<html><div>Hello World</div></html>",
	"filename": "hello_world",
	"type": "png",
	"width": "100",
	"height": "100"
}
```

## Deploying this
This uses a node webserver, which is contained within a Docker image. This can be deployed with little configuration changes to many different platforms. 

### Heroku
Heroku has a container registry, in which this container *image* can be built and sent to.

#### 1 Prequisites
- heroku cli
- docker

#### 2 Login
Login with the shared **resvumedia dev** account

    heroku container:login
    git clone {THIS_REPO}
    heroku git:remote -a resvu-html2pdf
    
#### 3 Deploy
Build and then deploy the container.

    yarn build
    heroku container:push web
    heroku container:release web

### Local Development

    yarn build
    docker build -t mycontainer .
    docker run mycontainer